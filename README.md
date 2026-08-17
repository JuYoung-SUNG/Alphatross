# 전국 공영주차장 안내

전국 17개 시·도의 공영주차장 이용 정보와 주차 제도를 정리한 정적 웹사이트입니다.
Astro로 빌드하고 Cloudflare Pages에 배포하도록 구성되어 있습니다.

- **총 38페이지** (지역 17 + 가이드 12 + 목록/정책 9)
- SEO: 사이트맵 자동 생성, canonical, Open Graph, JSON-LD 구조화 데이터
- 애드센스 심사 대비: 개인정보처리방침 · 이용약관 · 면책조항 · 소개 · 문의 페이지
- 외부 이미지 의존 없음 (일러스트는 인라인 SVG, OG 이미지는 빌드 스크립트로 생성)
- 지역 17종 + 가이드 12종 + 본문 도식 4종 오리지널 일러스트 (전부 직접 그린 SVG)

---

## 1. 로컬에서 실행하기

```bash
npm install      # 최초 1회
npm run dev      # http://localhost:4321
npm run build    # dist/ 에 정적 파일 생성
npm run preview  # 빌드 결과 미리보기
npm run og       # OG 이미지 재생성 (public/og-default.png)
```

---

## 2. 배포 전에 반드시 바꿔야 할 값

### `src/consts.ts`

| 상수 | 설명 |
| --- | --- |
| `CONTACT_EMAIL` | **실제 수신 가능한 이메일**. 애드센스 심사에서 확인합니다. |
| `ADSENSE_CLIENT` | 애드센스 게시자 ID (`ca-pub-...`). 비어 있으면 광고 스크립트가 삽입되지 않습니다. |
| `SITE_NAME` / `SITE_TAGLINE` | 사이트 이름을 바꾸려면 수정 |

### `astro.config.mjs`

`SITE` 값이 배포 도메인입니다. Cloudflare 환경변수 `SITE_URL`로 덮어쓸 수 있습니다.

### `public/robots.txt`

마지막 줄 `Sitemap:` 주소를 실제 도메인으로 바꾸세요.

### `public/ads.txt`

애드센스 승인 후 게시자 ID를 넣고 주석(`#`)을 제거하세요.

---

## 3. 내가 해야 할 일 — GitHub 연결

> 아래는 **직접 진행하셔야 하는 작업**입니다.

### 3-1. GitHub 저장소 만들기

1. https://github.com/new 접속
2. Repository name: 예) `parking-guide-kr`
3. **Public / Private 아무거나 상관없습니다** (Cloudflare는 둘 다 지원)
4. **README, .gitignore, license 체크는 모두 해제** (이미 로컬에 있습니다)
5. `Create repository` 클릭

### 3-2. 로컬 저장소를 GitHub에 올리기

저장소 생성 후 나오는 주소를 복사해서 아래를 실행하세요.

```bash
cd c:/works/Alphatross
git remote add origin https://github.com/<사용자명>/<저장소명>.git
git branch -M main
git push -u origin main
```

> 로컬 git 저장소와 첫 커밋은 이미 준비되어 있습니다. 위 3줄만 실행하면 됩니다.
> push 시 로그인을 요구하면 GitHub 비밀번호가 아니라 **Personal Access Token**을 입력해야 합니다.
> (GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → `repo` 권한)

---

## 4. 내가 해야 할 일 — Cloudflare Pages 배포

### 4-1. 프로젝트 연결

1. https://dash.cloudflare.com 로그인
2. 왼쪽 메뉴 **Workers & Pages** → **Create** → **Pages** 탭 → **Connect to Git**
3. GitHub 계정 연동 승인 (처음 한 번만) → 방금 만든 저장소 선택

### 4-2. 빌드 설정 — 아래 값을 그대로 입력

| 항목 | 값 |
| --- | --- |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | (비워 둠) |
| Node version | `20` 이상 |

**환경 변수 (Environment variables)** — `Add variable`로 추가

| 변수명 | 값 |
| --- | --- |
| `SITE_URL` | 배포될 실제 주소 (예: `https://parking-guide-kr.pages.dev`) |
| `NODE_VERSION` | `20` |

> `SITE_URL`은 첫 배포 후 도메인이 확정되면 정확한 값으로 다시 저장하고 **Retry deployment**를 눌러 주세요.
> canonical 태그와 sitemap에 이 주소가 들어갑니다.

4. **Save and Deploy** 클릭 → 1~2분 후 배포 완료

이후 `git push`할 때마다 자동으로 재배포됩니다.

### 4-3. (선택) 커스텀 도메인 연결

애드센스 승인에는 `.pages.dev` 주소로도 신청할 수 있지만, **본인 소유 도메인**을 쓰는 편이 승인에 유리합니다.

1. Pages 프로젝트 → **Custom domains** → **Set up a custom domain**
2. 보유한 도메인 입력
3. 도메인을 Cloudflare에서 관리 중이면 자동 설정됩니다
4. 연결 후 `SITE_URL` 환경변수와 `public/robots.txt`의 Sitemap 주소를 새 도메인으로 변경 → 재배포

---

## 5. 내가 해야 할 일 — 애드센스 신청

> **먼저 배포를 완료하고, 사이트가 정상 접속되는지 확인한 뒤에 진행하세요.**

### 5-1. 신청 전 체크리스트

- [ ] 사이트가 실제 도메인으로 접속됨
- [ ] `src/consts.ts`의 `CONTACT_EMAIL`이 실제 수신 가능한 주소
- [ ] 개인정보처리방침 / 이용약관 / 면책조항 / 소개 / 문의 페이지가 모두 열림
- [ ] 모바일에서 메뉴와 레이아웃이 정상 동작
- [ ] `https://<도메인>/sitemap-index.xml` 접속됨
- [ ] `https://<도메인>/robots.txt` 접속되고 Sitemap 주소가 올바름

### 5-2. Google Search Console 등록 (권장, 먼저)

1. https://search.google.com/search-console 접속
2. 속성 추가 → **URL 접두어**에 사이트 주소 입력
3. 소유권 확인 (HTML 태그 방식이면 `src/components/BaseHead.astro`에 meta 태그 추가)
4. **Sitemaps** 메뉴에서 `sitemap-index.xml` 제출

색인이 어느 정도 진행된 뒤 애드센스를 신청하면 통과 확률이 올라갑니다.

### 5-3. 애드센스 신청

1. https://adsense.google.com 접속 → 사이트 주소 입력
2. 안내되는 **확인 코드**를 `src/consts.ts`의 `ADSENSE_CLIENT`에 입력
   ```ts
   export const ADSENSE_CLIENT = 'ca-pub-0000000000000000';
   ```
   → 이 값을 채우면 `BaseHead.astro`가 자동으로 애드센스 스크립트를 삽입합니다.
3. `git push` → 자동 배포
4. 애드센스에서 **검토 요청**

### 5-4. 승인 후

1. `public/ads.txt`에서 주석을 풀고 본인 게시자 ID 입력
2. 애드센스에서 광고 단위를 만들고 **슬롯 ID** 발급
3. 광고를 넣고 싶은 페이지에서 `AdSlot` 컴포넌트 사용

   ```astro
   ---
   import AdSlot from '../components/AdSlot.astro';
   ---
   <AdSlot slot="1234567890" />
   ```

> **심사 중에는 광고를 넣지 않아도 됩니다.** `ADSENSE_CLIENT`만 채워 두면 심사용 스크립트가 삽입됩니다.
> 한 페이지에 광고를 3개 이상 넣거나 콘텐츠보다 광고가 많아 보이면 정책 위반이 될 수 있습니다.

---

## 6. 콘텐츠 추가하기

### 가이드 글 추가

`src/content/guides/` 에 마크다운 파일을 만들면 자동으로 목록과 사이트맵에 반영됩니다.

```markdown
---
title: 글 제목
description: 검색 결과에 표시될 요약 (120자 내외)
category: 이용 요령   # 제도 이해 | 요금·감면 | 신청·절차 | 법규·단속 | 이용 요령
publishedAt: 2026-09-01
order: 130            # 작을수록 목록 위쪽
keywords: [키워드1, 키워드2]
---

본문...
```

### 지역 정보 수정

`src/data/regions.ts` 를 수정하면 됩니다.

### 일러스트 시스템

모든 그림은 **직접 그린 인라인 SVG**입니다. 외부 이미지를 전혀 쓰지 않으므로 저작권 문제가 없고,
별도 파일 요청이 없어 로딩도 빠릅니다.

| 컴포넌트 | 용도 |
| --- | --- |
| `components/art/RegionArt.astro` | 지역 일러스트 10종 장면(도심·해안·항만·계획도시·산업·환승·산악·도농·유적·섬) |
| `components/art/GuideArt.astro` | 가이드 일러스트 12종 |
| `components/art/Icon.astro` | 선 아이콘 8종 (홈 특징 카드용) |
| `components/HeroArt.astro` | 홈 상단 대표 일러스트 |

- 지역 ↔ 장면 연결은 `src/data/regions.ts` 의 `SCENE` 맵에서 바꿉니다.
- 가이드 ↔ 그림 연결은 `src/data/guide-art.ts` 의 `ART` 맵에서 바꿉니다.
- 색상은 지역별 `hue` 값(0~360)으로 자동 생성되므로, 숫자만 바꾸면 색이 통째로 바뀝니다.
- 본문 안 도식(요금 구조 그래프, 노면 표시 비교 등)은 각 마크다운 파일에 `<figure class="figure">`
  형태로 들어 있으며, `var(--*)` 토큰을 쓰기 때문에 다크 모드에서도 자동으로 맞춰집니다.

---

## 7. 콘텐츠 작성 원칙 (중요)

이 사이트는 애드센스 정책상 문제가 될 수 있는 요소를 피하기 위해 다음 원칙으로 작성되었습니다.
글을 추가하실 때도 유지해 주세요.

1. **구체적인 요금 금액을 단정하지 않습니다.** 조례 개정으로 금방 틀린 정보가 되기 때문입니다.
   대신 요금이 계산되는 *구조*를 설명하고 공식 확인처를 안내합니다.
2. **계산 예시는 가상의 수치임을 명시합니다.**
3. **전국 공통인 것과 지역마다 다른 것을 구분**해 표기합니다.
4. **법령 관련 내용은 국가법령정보센터를 안내**하고, 법률 자문이 아님을 밝힙니다.
5. **출처가 불분명한 정보나 개인 경험담을 사실처럼 쓰지 않습니다.**

---

## 8. 프로젝트 구조

```
src/
  consts.ts              사이트 전역 설정 (이메일, 애드센스 ID 등)
  content.config.ts      가이드 컬렉션 스키마
  data/regions.ts        17개 시·도 데이터
  styles/global.css      디자인 토큰 + 전역 스타일 (다크모드 포함)
  components/
    BaseHead.astro       SEO 메타, JSON-LD, 애드센스 스크립트
    Header.astro         상단 메뉴바 (모바일 토글)
    Footer.astro         푸터 (정책 링크, 인기 지역)
    Breadcrumbs.astro    빵부스러기 네비게이션
    HeroArt.astro        홈 상단 인라인 SVG 일러스트
    AdSlot.astro         애드센스 광고 자리
  layouts/
    BaseLayout.astro     html 뼈대
    PageLayout.astro     제목 + 브레드크럼 + 본문
  pages/
    index.astro          홈
    regions/             지역 목록 + 상세 17개
    guides/              가이드 목록 + 상세 12개
    about / contact / privacy / terms / disclaimer / 404
  content/guides/        가이드 마크다운 12편
public/
  robots.txt  ads.txt  favicon.svg  _headers
  og-default.png  apple-touch-icon.png
scripts/make-og.mjs      OG 이미지 생성
```

---

## 9. 참고: 행정구역 변경 반영

2026년 8월 기준, **광주광역시와 전라남도의 공식 홈페이지가 「전남광주통합특별시」 명칭으로
운영 중**임을 확인하여 해당 지역 페이지에 안내를 표시했습니다.
검색 유입을 고려해 `광주`, `전남` 페이지는 그대로 유지하되, 통합 관련 고지를 함께 노출합니다.

강원(`www.gwd.go.kr`)과 전북(`www.jeonbuk.go.kr`)도 특별자치도 출범에 따른 주소를 반영했습니다.
모든 외부 링크는 2026-08-17 기준으로 실제 접속을 확인했습니다.
