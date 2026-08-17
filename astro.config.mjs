// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 배포 도메인. Cloudflare Pages 환경변수 SITE_URL 로 덮어쓸 수 있습니다.
// 예) SITE_URL = https://parking.example.com
const SITE = process.env.SITE_URL || 'https://jeonguk-parking.pages.dev';

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
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
