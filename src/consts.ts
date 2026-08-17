/**
 * 사이트 전역 상수.
 * 배포 전에 SITE_NAME / CONTACT_EMAIL / ADSENSE_CLIENT 값을 본인 것으로 바꾸세요.
 */

export const SITE_NAME = '전국 공영주차장 안내';
export const SITE_SHORT = '공영주차장 안내';
export const SITE_TAGLINE = '지역별 공영주차장 이용 정보와 주차 제도 가이드';
export const SITE_DESCRIPTION =
  '전국 17개 시·도의 공영주차장 운영 방식, 요금 체계, 감면 대상, 정기권 신청 방법을 한곳에서 정리했습니다. 주차 관련 법령과 공공데이터를 바탕으로 한 무료 주차 정보 안내 사이트입니다.';

/** 문의용 이메일 — 반드시 실제로 수신 가능한 주소로 바꾸세요. 애드센스 심사 시 확인됩니다. */
export const CONTACT_EMAIL = 'danceinjyi@gmail.com';

/** 사이트 운영자 표기 */
export const PUBLISHER = '전국 공영주차장 안내';

/**
 * 애드센스 게시자 ID. 승인 신청 시 발급받은 값(ca-pub-0000000000000000)으로 교체하세요.
 * 값이 비어 있으면 광고 스크립트를 아예 넣지 않습니다.
 */
export const ADSENSE_CLIENT = '';

/** 사이트 최초 공개일 / 문서 최종 점검일 */
export const SITE_LAUNCH = '2026-08-17';
export const LAST_REVIEWED = '2026-08-17';

/**
 * 빌드 산출물 경로를 사이트 표준 경로로 정규화합니다.
 * build.format 이 'file' 이라 빌드 시점의 Astro.url.pathname 은 '/regions/seoul.html' 처럼
 * 확장자가 붙습니다. canonical 과 메뉴 활성화 판정에는 '/regions/seoul' 형태가 필요합니다.
 */
export function normalizePath(pathname: string): string {
  const p = pathname
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

export type NavItem = { href: string; label: string };

export const MAIN_NAV: NavItem[] = [
  { href: '/', label: '홈' },
  { href: '/regions', label: '지역별 안내' },
  { href: '/guides', label: '주차 가이드' },
  { href: '/about', label: '사이트 소개' },
  { href: '/contact', label: '문의' },
];

export const FOOTER_POLICY_NAV: NavItem[] = [
  { href: '/privacy', label: '개인정보처리방침' },
  { href: '/terms', label: '이용약관' },
  { href: '/disclaimer', label: '면책조항' },
  { href: '/contact', label: '문의하기' },
];

/** 외부 공식 출처 — 링크 유효성을 실제로 확인한 주소만 둡니다. */
export const SOURCES = {
  dataPortal: 'https://www.data.go.kr',
  lawCenter: 'https://www.law.go.kr',
} as const;
