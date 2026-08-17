/**
 * 가이드 글 slug → 일러스트 키 매핑.
 * GuideArt 컴포넌트의 GuideArtKey 와 값이 일치해야 합니다.
 * 새 글을 추가하면 여기에 한 줄만 더하면 됩니다. (없으면 'types' 로 표시)
 */
export type GuideArtKey =
  | 'types' | 'calc' | 'discount' | 'resident' | 'data' | 'penalty'
  | 'accessible' | 'ev' | 'pass' | 'shared' | 'transit' | 'travel';

const ART: Record<string, GuideArtKey> = {
  'what-is-public-parking': 'types',
  'parking-fee-structure': 'calc',
  'parking-fee-discounts': 'discount',
  'resident-priority-parking': 'resident',
  'find-parking-open-data': 'data',
  'illegal-parking-penalty': 'penalty',
  'disabled-parking-zone': 'accessible',
  'ev-charging-parking': 'ev',
  'monthly-parking-pass': 'pass',
  'shared-building-parking': 'shared',
  'transfer-parking': 'transit',
  'travel-parking-tips': 'travel',
};

export function artOf(id: string): GuideArtKey {
  return ART[id] ?? 'types';
}
