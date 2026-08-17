// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 배포 도메인. Cloudflare Pages 환경변수 SITE_URL 로 덮어쓸 수 있습니다.
// 예) SITE_URL = https://parking.example.com
const SITE = process.env.SITE_URL || 'https://alphatross.pages.dev';

export default defineConfig({
  site: SITE,
  // Cloudflare Pages 는 /foo.html 을 /foo 로 서빙하고, 슬래시가 붙은 형태는 308 로 정리해 줍니다.
  // 'file' 포맷을 쓰면 사이트가 내보내는 canonical·sitemap·내부 링크가 모두
  // 서버가 실제로 200 을 주는 "슬래시 없는" 주소와 일치합니다.
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'weekly',
      lastmod: new Date(),
    }),
  ],
  compressHTML: true,
});
