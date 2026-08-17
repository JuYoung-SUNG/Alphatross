/**
 * 한국관광공사 사진갤러리(공공누리 제1유형: 출처표시, 상업적 이용·변형 허용)에서
 * 지역별 대표 사진을 받아 WebP 로 최적화해 저장합니다.
 *
 *   $env:DATA_GO_KR_KEY="발급받은키"
 *   npm run photos
 *
 * 결과: public/photos/<slug>.webp  +  src/data/photos.json (출처 표기용 메타)
 *
 * 사진이 없으면 기존 SVG 일러스트가 그대로 쓰이므로 사이트는 항상 정상 동작합니다.
 *
 * ※ 공공누리 제1유형은 "출처 표시"가 의무입니다. photos.json 에 저장한
 *   저작권자·제목을 화면에 반드시 노출해야 합니다 (PhotoFigure 컴포넌트가 처리).
 */
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = process.env.DATA_GO_KR_KEY;
if (!KEY) {
  console.error(
    '\n오류: 인증키가 없습니다.\n' +
      '  https://www.data.go.kr 에서 "한국관광공사_관광사진정보" 활용신청 후\n' +
      '  $env:DATA_GO_KR_KEY="키"  설정하고 다시 실행하세요.\n',
  );
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const photoDir = resolve(root, 'public/photos');

/** 지역 slug → 사진 검색 키워드 (관광공사 갤러리에 실제로 많이 잡히는 지명 위주) */
const QUERIES = {
  seoul: '서울', busan: '부산', daegu: '대구', incheon: '인천', gwangju: '광주',
  daejeon: '대전', ulsan: '울산', sejong: '세종', gyeonggi: '수원', gangwon: '강릉',
  chungbuk: '청주', chungnam: '공주', jeonbuk: '전주', jeonnam: '여수',
  gyeongbuk: '경주', gyeongnam: '통영', jeju: '제주',
};

const BASE = 'https://apis.data.go.kr/B551011/PhotoGalleryService1/galleryKeywordList1';

async function search(keyword) {
  const url =
    `${BASE}?serviceKey=${encodeURIComponent(KEY)}` +
    `&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=parking-guide-kr` +
    `&arrange=A&keyword=${encodeURIComponent(keyword)}&_type=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'parking-guide-kr/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`JSON 아님: ${text.slice(0, 160)}`);
  }
  const body = json.response?.body;
  let items = body?.items?.item ?? [];
  if (!Array.isArray(items)) items = [items].filter(Boolean);
  return items;
}

await mkdir(photoDir, { recursive: true });
const meta = {};
let printedKeys = false;

for (const [slug, keyword] of Object.entries(QUERIES)) {
  try {
    const items = await search(keyword);
    if (!printedKeys && items[0]) {
      console.log('필드 예시:', Object.keys(items[0]).join(', '), '\n');
      printedKeys = true;
    }
    const hit = items.find((i) => i.galWebImageUrl || i.galFullImageUrl);
    if (!hit) {
      console.log(`${slug.padEnd(10)} 결과 없음 (일러스트 유지)`);
      continue;
    }

    const src = hit.galWebImageUrl || hit.galFullImageUrl;
    const imgRes = await fetch(src, { headers: { 'User-Agent': 'parking-guide-kr/1.0' } });
    if (!imgRes.ok) throw new Error(`이미지 HTTP ${imgRes.status}`);
    const buf = Buffer.from(await imgRes.arrayBuffer());

    await sharp(buf)
      .resize(1000, 500, { fit: 'cover', position: 'attention' })
      .webp({ quality: 78 })
      .toFile(resolve(photoDir, `${slug}.webp`));

    meta[slug] = {
      title: String(hit.galTitle ?? '').trim(),
      author: String(hit.galPhotographer ?? '').trim(),
      place: String(hit.galPhotographyLocation ?? '').trim(),
      source: '한국관광공사 사진갤러리',
      license: '공공누리 제1유형(출처표시)',
    };
    console.log(`${slug.padEnd(10)} OK  ${meta[slug].title}`);
  } catch (e) {
    console.log(`${slug.padEnd(10)} 실패: ${e.message} (일러스트 유지)`);
  }
}

const dest = resolve(root, 'src/data/photos.json');
await writeFile(dest, JSON.stringify(meta, null, 0), 'utf8');
console.log(`\n사진 ${Object.keys(meta).length}장 저장 → public/photos/, src/data/photos.json`);
console.log('※ 공공누리 제1유형은 출처 표시가 의무입니다. 화면에 저작권자가 함께 노출됩니다.');
