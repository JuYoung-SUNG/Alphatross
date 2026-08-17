/**
 * 공공데이터포털 「전국주차장정보표준데이터」에서 만든 지역별 대표 주차장 목록.
 *
 * scripts/fetch-parking-data.mjs 로 parking-lots.json 을 생성하면 자동으로 잡힙니다.
 * 파일이 없으면 빈 값을 반환하므로, 데이터가 없어도 사이트는 정상 동작합니다.
 * (import.meta.glob 을 쓰는 이유: 파일이 없을 때 빌드가 깨지지 않게 하기 위해서입니다.)
 */

export type Lot = {
  /** 주차장명 */
  name: string;
  /** 주차장구분 (노상/노외) */
  kind: string;
  /** 소재지 주소 */
  addr: string;
  /** 주차구획수 */
  slots: number;
  /** 요금정보 (무료/유료 등) */
  payType: string;
  /** 운영요일 */
  operDay: string;
  /** 평일 운영 시작/종료 시각 (HHMM) */
  open: string;
  close: string;
  tel: string;
  /** 관리기관명 */
  org: string;
  /** 데이터 기준일자 */
  updated: string;
};

export type RegionLots = { total: number; lots: Lot[] };
type Payload = { fetchedAt: string; regions: Record<string, RegionLots> };

const found = import.meta.glob<{ default: Payload }>('./parking-lots.json', { eager: true });
const payload: Payload | null = Object.values(found)[0]?.default ?? null;

/** 데이터가 준비되어 있는지 */
export function hasLotData(): boolean {
  return payload !== null;
}

/** 데이터를 내려받은 날짜 (YYYY-MM-DD) */
export function lotDataDate(): string | null {
  return payload?.fetchedAt ?? null;
}

/** 특정 지역의 대표 주차장 목록 */
export function lotsFor(slug: string): RegionLots | null {
  return payload?.regions?.[slug] ?? null;
}

/** 'HHMM' → 'HH:MM'. 값이 없거나 형식이 다르면 그대로 돌려줍니다. */
export function hhmm(v: string): string {
  if (!v) return '';
  const d = v.replace(/\D/g, '');
  return d.length === 4 ? `${d.slice(0, 2)}:${d.slice(2)}` : v;
}

/** 운영 시간을 사람이 읽는 형태로 */
export function operatingText(lot: Lot): string {
  const o = hhmm(lot.open);
  const c = hhmm(lot.close);
  if (!o && !c) return '확인 필요';
  if (o === c) return '24시간';
  return `${o || '?'} ~ ${c || '?'}`;
}
