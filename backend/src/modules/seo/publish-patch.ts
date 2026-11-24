import type { SeoContent } from './content';

export const PUBLISH_PATCH_KEYS = [
  'metaTitle',
  'metaDescription',
  'keywords',
  'ogTitle',
  'ogDescription',
  'twitterTitle',
  'twitterDescription',
  'includeFaqSchema',
] as const;

export interface SeoPublishPatch {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  includeFaqSchema: true;
}

/** Fields written onto Tool at publish. Indexing and activation flags are intentionally absent. */
export function buildPublishPatch(
  content: Pick<SeoContent, 'metaTitle' | 'metaDescription' | 'keywords'>
): SeoPublishPatch {
  return {
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    keywords: content.keywords,
    ogTitle: content.metaTitle,
    ogDescription: content.metaDescription.slice(0, 200),
    twitterTitle: content.metaTitle,
    twitterDescription: content.metaDescription,
    includeFaqSchema: true,
  };
}
