/**
 * 지역별 실사 사진 메타데이터.
 *
 * scripts/fetch-photos.mjs 가 public/photos/<slug>.webp 와 photos.json 을 만듭니다.
 * 파일이 없으면 null 을 반환하고, 지역 페이지는 기존 SVG 일러스트를 그대로 씁니다.
 *
 * 사진은 공공누리 제1유형(출처표시)이므로 화면에 출처를 반드시 노출해야 합니다.
 */

export type PhotoMeta = {
  title: string;
  author: string;
  place: string;
  source: string;
  license: string;
};

const found = import.meta.glob<{ default: Record<string, PhotoMeta> }>('./photos.json', {
  eager: true,
});
const data: Record<string, PhotoMeta> | null = Object.values(found)[0]?.default ?? null;

export function photoFor(slug: string): PhotoMeta | null {
  return data?.[slug] ?? null;
}

export function photoSrc(slug: string): string {
  return `/photos/${slug}.webp`;
}

/** 출처 표기 문자열 (공공누리 제1유형 의무사항) */
export function creditLine(m: PhotoMeta): string {
  const who = m.author ? `${m.author}, ` : '';
  return `${m.title ? m.title + ' — ' : ''}${who}${m.source} (${m.license})`;
}
