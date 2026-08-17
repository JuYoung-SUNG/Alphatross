/**
 * 공공데이터포털 「전국주차장정보표준데이터」를 받아 지역별 대표 주차장 목록을 만듭니다.
 *
 *   set DATA_GO_KR_KEY=발급받은키   (PowerShell: $env:DATA_GO_KR_KEY="키")
 *   npm run data
 *
 * 결과: src/data/parking-lots.json  (git 에 커밋해서 배포에 포함시킵니다)
 *
 * 이 파일이 없어도 사이트는 정상 빌드됩니다. 있으면 지역 페이지에 실제 주차장 표가 추가됩니다.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = process.env.DATA_GO_KR_KEY;
if (!KEY) {
  console.error(
    '\n오류: 인증키가 없습니다.\n' +
      '  1) https://www.data.go.kr 회원가입\n' +
      '  2) "전국주차장정보표준데이터" 검색 → 오픈API 활용신청 (즉시 승인)\n' +
      '  3) 마이페이지 > 인증키에서 "일반 인증키(Decoding)" 복사\n' +
      '  4) $env:DATA_GO_KR_KEY="복사한키"  후 npm run data\n',
  );
  process.exit(1);
}

const ENDPOINT = 'https://api.data.go.kr/openapi/tn_pubr_prkplce_info_api';
const PER_PAGE = 1000;
const MAX_PAGES = 60; // 안전장치
/** 지역당 목록에 넣을 주차장 수 */
const PER_REGION = 25;

/** 주소 앞부분 → 지역 slug */
const REGION_MATCHERS = [
  ['seoul', /^서울/],
  ['busan', /^부산/],
  ['daegu', /^대구/],
  ['incheon', /^인천/],
  ['gwangju', /^광주/],
  ['daejeon', /^대전/],
  ['ulsan', /^울산/],
  ['sejong', /^세종/],
  ['gyeonggi', /^경기/],
  ['gangwon', /^강원/],
  ['chungbuk', /^(충청북도|충북)/],
  ['chungnam', /^(충청남도|충남)/],
  ['jeonbuk', /^(전라북도|전북)/],
  ['jeonnam', /^(전라남도|전남)/],
  ['gyeongbuk', /^(경상북도|경북)/],
  ['gyeongnam', /^(경상남도|경남)/],
  ['jeju', /^제주/],
];

const regionOf = (addr = '') => {
  const a = String(addr).trim();
  for (const [slug, re] of REGION_MATCHERS) if (re.test(a)) return slug;
  return null;
};

/** 표준데이터 필드명이 조금씩 달라도 견디도록 후보를 순서대로 찾습니다. */
const pick = (row, ...keys) => {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
};

async function fetchPage(pageNo) {
  const url =
    `${ENDPOINT}?serviceKey=${encodeURIComponent(KEY)}` +
    `&pageNo=${pageNo}&numOfRows=${PER_PAGE}&type=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'parking-guide-kr/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} — 인증키가 올바른지, 활용신청이 승인됐는지 확인하세요.`);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`JSON 이 아닌 응답을 받았습니다. 앞부분: ${text.slice(0, 200)}`);
  }
  const body = json.response?.body ?? json.body ?? json;
  const items = body?.items ?? [];
  const totalCount = Number(body?.totalCount ?? 0);
  return { items: Array.isArray(items) ? items : [items].filter(Boolean), totalCount };
}

const all = [];
let total = 0;
for (let page = 1; page <= MAX_PAGES; page++) {
  const { items, totalCount } = await fetchPage(page);
  if (page === 1) {
    total = totalCount;
    console.log(`전체 ${total.toLocaleString()}건`);
    if (items[0]) console.log('필드 예시:', Object.keys(items[0]).join(', '));
  }
  if (!items.length) break;
  all.push(...items);
  process.stdout.write(`\r수집 ${all.length.toLocaleString()} / ${total.toLocaleString()}`);
  if (all.length >= total) break;
}
console.log('');

// 지역별로 묶고, 공영 + 구획 수가 큰 순으로 대표를 고릅니다.
const byRegion = {};
for (const row of all) {
  const addr = pick(row, 'rdnmadr', 'lnmadr', '소재지도로명주소', '소재지지번주소');
  const slug = regionOf(addr);
  if (!slug) continue;

  const type = pick(row, 'prkplceType', '주차장유형');
  if (type && !type.includes('공영')) continue; // 공영만

  const rec = {
    name: pick(row, 'prkplceNm', '주차장명'),
    kind: pick(row, 'prkplceSe', '주차장구분'),
    addr,
    slots: Number(pick(row, 'prkcmprt', '주차구획수')) || 0,
    payType: pick(row, 'parkingchrgeInfo', '요금정보'),
    operDay: pick(row, 'operDay', '운영요일'),
    open: pick(row, 'weekdayOperOpenHhmm', '평일운영시작시각'),
    close: pick(row, 'weekdayOperCloseHhmm', '평일운영종료시각'),
    tel: pick(row, 'phoneNumber', '전화번호'),
    org: pick(row, 'institutionNm', '관리기관명'),
    updated: pick(row, 'referenceDate', '데이터기준일자'),
  };
  if (!rec.name || !rec.addr) continue;
  (byRegion[slug] ??= []).push(rec);
}

const out = {};
let kept = 0;
for (const [slug, list] of Object.entries(byRegion)) {
  list.sort((a, b) => b.slots - a.slots);
  out[slug] = { total: list.length, lots: list.slice(0, PER_REGION) };
  kept += out[slug].lots.length;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dest = resolve(root, 'src/data/parking-lots.json');
await mkdir(dirname(dest), { recursive: true });
await writeFile(
  dest,
  JSON.stringify({ fetchedAt: new Date().toISOString().slice(0, 10), regions: out }, null, 0),
  'utf8',
);

console.log(`\n지역 ${Object.keys(out).length}개 / 목록에 담은 주차장 ${kept}건`);
for (const [slug, v] of Object.entries(out).sort()) {
  console.log(`  ${slug.padEnd(10)} 공영 ${String(v.total).padStart(6)}곳 중 ${v.lots.length}곳 수록`);
}
console.log(`\n저장 완료: src/data/parking-lots.json`);
