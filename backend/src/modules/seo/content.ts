import { z } from 'zod';

export const FINANCE_CATEGORY_SLUG = 'finance-business';
export const CAMPAIGN_MAX_TOOLS = 50;

export const SECTION_PARAGRAPH_MAX = 16;
export const SECTION_BULLET_MAX = 12;
export const SECTION_PARAGRAPH_LEN = 5000;
export const SECTION_BULLET_LEN = 500;

const sectionSchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(160),
  paragraphs: z
    .array(z.string().trim().min(1).max(SECTION_PARAGRAPH_LEN))
    .min(1)
    .max(SECTION_PARAGRAPH_MAX),
  bullets: z
    .array(z.string().trim().min(1).max(SECTION_BULLET_LEN))
    .max(SECTION_BULLET_MAX)
    .default([]),
  formula: z.string().trim().max(500).default(''),
  formulaNote: z.string().trim().max(500).default(''),
});

export const seoContentSchema = z.object({
  metaTitle: z.string().trim().min(1).max(70),
  metaDescription: z.string().trim().min(1).max(160),
  keywords: z.string().trim().min(1).max(200),
  primaryKeyword: z.string().trim().min(1).max(120),
  sections: z.array(sectionSchema).min(4).max(8),
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(1).max(200),
        answer: z.string().trim().min(1).max(2000),
      })
    )
    .min(3)
    .max(8),
  links: z
    .array(
      z.object({
        slug: z.string().trim().min(1).max(160),
        anchor: z.string().trim().min(1).max(160),
      })
    )
    .min(3)
    .max(6),
  disclaimer: z.string().trim().min(1).max(500),
});

export type SeoContent = z.infer<typeof seoContentSchema>;

export interface PublicPublishedGuide {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  primaryKeyword: string;
  disclaimer: string;
  sections: SeoContent['sections'];
  faqs: SeoContent['faqs'];
  links: SeoContent['links'];
}

export function toPublicGuide(content: SeoContent): PublicPublishedGuide {
  return {
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    keywords: content.keywords,
    primaryKeyword: content.primaryKeyword,
    disclaimer: content.disclaimer,
    sections: content.sections,
    faqs: content.faqs,
    links: content.links,
  };
}

export function safeSectionId(id: string, index: number): string {
  const cleaned = id
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || `section-${index + 1}`;
}

function clipString(value: unknown, max: number): unknown {
  return typeof value === 'string' ? value.trim().slice(0, max) : value;
}

/**
 * Keep at most `maxItems` strings. Extra items merge into the last slot so word
 * count is not thrown away when the model over-splits a section.
 */
export function clipStringList(
  value: unknown,
  maxItems: number,
  maxLen: number,
  options: { mergeExtra?: boolean } = {}
): unknown {
  if (!Array.isArray(value)) return value;
  const cleaned = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().slice(0, maxLen))
    .filter(Boolean);
  if (cleaned.length <= maxItems) return cleaned;
  if (!options.mergeExtra || maxItems < 1) return cleaned.slice(0, maxItems);
  const kept = cleaned.slice(0, maxItems - 1);
  const merged = cleaned.slice(maxItems - 1).join('\n\n').slice(0, maxLen);
  return [...kept, merged];
}

/** Trim model output to the Tool field limits before schema validation. */
export function clipSeoRaw(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const row = value as Record<string, unknown>;
  const sections = Array.isArray(row.sections)
    ? row.sections.slice(0, 8).map((section, index) => {
        if (!section || typeof section !== 'object') return section;
        const item = section as Record<string, unknown>;
        return {
          ...item,
          id: safeSectionId(typeof item.id === 'string' ? item.id : '', index),
          title: clipString(item.title, 160),
          paragraphs: clipStringList(item.paragraphs, SECTION_PARAGRAPH_MAX, SECTION_PARAGRAPH_LEN, {
            mergeExtra: true,
          }),
          bullets: clipStringList(item.bullets, SECTION_BULLET_MAX, SECTION_BULLET_LEN),
          formula: clipString(item.formula, 500),
          formulaNote: clipString(item.formulaNote, 500),
        };
      })
    : row.sections;
  const faqs = Array.isArray(row.faqs)
    ? row.faqs.slice(0, 8).map((faq) => {
        if (!faq || typeof faq !== 'object') return faq;
        const item = faq as Record<string, unknown>;
        return {
          ...item,
          question: clipString(item.question, 200),
          answer: clipString(item.answer, 2000),
        };
      })
    : row.faqs;
  const links = Array.isArray(row.links)
    ? row.links.slice(0, 6).map((link) => {
        if (!link || typeof link !== 'object') return link;
        const item = link as Record<string, unknown>;
        return {
          ...item,
          slug: clipString(item.slug, 160),
          anchor: clipString(item.anchor, 160),
        };
      })
    : row.links;
  return {
    ...row,
    metaTitle: clipString(row.metaTitle, 70),
    metaDescription: clipString(row.metaDescription, 160),
    keywords: clipString(row.keywords, 200),
    primaryKeyword: clipString(row.primaryKeyword, 120),
    disclaimer: clipString(row.disclaimer, 500),
    sections,
    faqs,
    links,
  };
}

export function alignDraftContent(
  content: SeoContent,
  allowedKeywords: readonly string[],
  slugNames: ReadonlyMap<string, string>
): SeoContent {
  const match = allowedKeywords.find(
    (keyword) => keyword.toLowerCase() === content.primaryKeyword.toLowerCase()
  );
  return {
    ...content,
    primaryKeyword: match ?? content.primaryKeyword,
    sections: content.sections.map((section, index) => ({
      ...section,
      id: safeSectionId(section.id, index),
    })),
    links: content.links.map((link) => ({
      slug: link.slug,
      anchor: slugNames.get(link.slug) ?? link.anchor,
    })),
  };
}

export function countDraftWords(content: Pick<SeoContent, 'sections' | 'faqs' | 'disclaimer'>): number {
  const parts = [
    content.disclaimer,
    ...content.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
      ...(section.bullets ?? []),
      section.formula ?? '',
      section.formulaNote ?? '',
    ]),
    ...content.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ];
  return parts
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
