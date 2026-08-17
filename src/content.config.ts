import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * YAML 은 따옴표 없는 2026-08-17 을 Date 로 파싱합니다.
 * 따옴표 유무와 상관없이 항상 'YYYY-MM-DD' 문자열이 되도록 정규화합니다.
 */
const isoDate = z
  .union([z.string(), z.date()])
  .transform((v) => (typeof v === 'string' ? v : v.toISOString().slice(0, 10)));

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** 목록 카드에 표시할 분류 */
    category: z.enum(['제도 이해', '요금·감면', '신청·절차', '법규·단속', '이용 요령']),
    publishedAt: isoDate,
    updatedAt: isoDate.optional(),
    /** 목록 정렬 순서(작을수록 앞) */
    order: z.number().default(50),
    keywords: z.array(z.string()).default([]),
  }),
});

export const collections = { guides };
