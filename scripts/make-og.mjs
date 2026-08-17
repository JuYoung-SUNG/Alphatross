/**
 * OG 이미지(og-default.png)와 apple-touch-icon.png 를 생성합니다.
 *
 *   npm run og
 *
 * 결과물은 public/ 에 저장되며 git 에 커밋됩니다.
 * Cloudflare 빌드에서는 실행되지 않으므로 sharp 는 devDependency 로만 필요합니다.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = resolve(root, 'public');

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0e4a8d"/>
      <stop offset="55%" stop-color="#1462b8"/>
      <stop offset="100%" stop-color="#0f9488"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 주차 구획선 -->
  <g stroke="#ffffff" stroke-opacity="0.16" stroke-width="6" stroke-linecap="round">
    <path d="M0 560 L120 400"/><path d="M170 560 L260 400"/>
    <path d="M340 560 L400 400"/><path d="M510 560 L540 400"/>
    <path d="M1200 560 L1080 400"/><path d="M1030 560 L940 400"/>
    <path d="M120 400 H1080"/>
  </g>

  <!-- P 아이콘 -->
  <g transform="translate(96 150)">
    <rect x="0" y="0" width="150" height="196" rx="30" fill="#ffffff" fill-opacity="0.14"/>
    <rect x="12" y="12" width="126" height="172" rx="22" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="5"/>
    <path d="M50 152V44h34c19 0 31.5 11.8 31.5 30.2 0 18.8-12.5 30.5-31.5 30.5H70V152H50zm20-63.5h13.5c8.6 0 13.5-4.7 13.5-13s-4.9-13-13.5-13H70v26z" fill="#ffffff"/>
  </g>

  <text x="300" y="238" font-family="Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, sans-serif"
        font-size="76" font-weight="800" fill="#ffffff" letter-spacing="-2">전국 공영주차장 안내</text>
  <text x="300" y="308" font-family="Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, sans-serif"
        font-size="36" font-weight="500" fill="#ffffff" fill-opacity="0.86">지역별 공영주차장 이용 정보와 주차 제도 가이드</text>

  <g font-family="Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-size="27" font-weight="700" fill="#ffffff">
    <rect x="300" y="348" width="196" height="54" rx="27" fill="#ffffff" fill-opacity="0.18"/>
    <text x="330" y="384" fill-opacity="0.95">17개 시·도</text>
    <rect x="512" y="348" width="216" height="54" rx="27" fill="#ffffff" fill-opacity="0.18"/>
    <text x="542" y="384" fill-opacity="0.95">요금 · 감면</text>
    <rect x="744" y="348" width="232" height="54" rx="27" fill="#ffffff" fill-opacity="0.18"/>
    <text x="774" y="384" fill-opacity="0.95">정기권 · 법규</text>
  </g>
</svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#1462b8"/>
  <path d="M21 49V15h13.6c7.6 0 12.6 4.5 12.6 11.6 0 7.3-5 11.8-12.6 11.8h-6.6V49H21zm7-16.6h5.4c3.5 0 5.5-1.9 5.5-5.3s-2-5.3-5.5-5.3H28v10.6z" fill="#fff"/>
</svg>`;

await mkdir(publicDir, { recursive: true });

await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile(resolve(publicDir, 'og-default.png'));
await sharp(Buffer.from(iconSvg)).resize(180, 180).png().toFile(resolve(publicDir, 'apple-touch-icon.png'));

// 소셜 미리보기 확인용으로 SVG 원본도 남겨 둡니다.
await writeFile(resolve(publicDir, 'og-default.svg'), ogSvg, 'utf8');

console.log('생성 완료: public/og-default.png, public/apple-touch-icon.png');
