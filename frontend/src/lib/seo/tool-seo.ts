import type { Metadata } from 'next';

export type TwitterCardType = '' | 'summary' | 'summary_large_image';
export type SchemaPageType = '' | 'WebPage' | 'WebApplication';
export type MaxImagePreview = '' | 'none' | 'standard' | 'large';
export type SitemapChangeFrequency =
  | ''
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

/** Flat optional SEO fields persisted on Tool records. */
export interface ToolSeoFields {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  indexable: boolean;
  robotsFollow: boolean;
  robotsNoArchive: boolean;
  robotsNoSnippet: boolean;
  robotsNoImageIndex: boolean;
  robotsMaxSnippet: number | null;
  robotsMaxImagePreview: MaxImagePreview;
  robotsMaxVideoPreview: number | null;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  ogImageAlt: string;
  ogType: string;
  ogSiteName: string;
  twitterCard: TwitterCardType;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageUrl: string;
  twitterImageAlt: string;
  twitterSite: string;
  schemaType: SchemaPageType;
  includeFaqSchema: boolean;
  sitemapInclude: boolean;
  sitemapPriority: number | null;
  sitemapChangeFrequency: SitemapChangeFrequency;
}

export interface ToolSeoSource extends ToolSeoFields {
  name: string;
  slug: string;
  shortDescription: string;
  componentKey: string;
  isActive: boolean;
}

export interface BuildToolMetadataOptions {
  siteName: string;
  siteUrl: string;
  defaultOgImageUrl?: string;
  isImplemented: boolean;
}

const EMPTY_SEO: ToolSeoFields = {
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  canonicalUrl: '',
  indexable: true,
  robotsFollow: true,
  robotsNoArchive: false,
  robotsNoSnippet: false,
  robotsNoImageIndex: false,
  robotsMaxSnippet: null,
  robotsMaxImagePreview: '',
  robotsMaxVideoPreview: null,
  ogTitle: '',
  ogDescription: '',
  ogImageUrl: '',
  ogImageAlt: '',
  ogType: '',
  ogSiteName: '',
  twitterCard: '',
  twitterTitle: '',
  twitterDescription: '',
  twitterImageUrl: '',
  twitterImageAlt: '',
  twitterSite: '',
  schemaType: '',
  includeFaqSchema: false,
  sitemapInclude: true,
  sitemapPriority: null,
  sitemapChangeFrequency: '',
};

export function emptyToolSeoFields(overrides: Partial<ToolSeoFields> = {}): ToolSeoFields {
  return { ...EMPTY_SEO, ...overrides };
}

export function normalizeSiteOrigin(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return `${url.protocol}//${url.host}`;
  } catch {
    return '';
  }
}

export function isSafeHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isLocalHostOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '::1';
  } catch {
    return false;
  }
}

export function buildToolPath(slug: string): string {
  return `/tools/${slug.replace(/^\/+|\/+$/g, '')}`;
}

/**
 * Production canonical never uses localhost.
 * Prefer a valid admin canonical; otherwise siteOrigin + /tools/slug.
 */
export function resolveCanonicalUrl(input: {
  adminCanonical: string;
  siteOrigin: string;
  slug: string;
}): string {
  const admin = input.adminCanonical.trim();
  if (admin && isSafeHttpUrl(admin)) {
    try {
      const parsed = new URL(admin);
      const adminOrigin = `${parsed.protocol}//${parsed.host}`;
      const allowLocal = process.env.NODE_ENV !== 'production';
      if (!isLocalHostOrigin(adminOrigin) || allowLocal) {
        const normalizedPath = parsed.pathname.replace(/\/+$/, '') || '';
        return `${adminOrigin}${normalizedPath}${parsed.search}`;
      }
    } catch {
      // fall through to generated canonical
    }
  }

  const origin = normalizeSiteOrigin(input.siteOrigin);
  if (!origin) return '';
  if (isLocalHostOrigin(origin) && process.env.NODE_ENV === 'production') {
    return '';
  }
  return `${origin}${buildToolPath(input.slug)}`;
}

export function resolveEffectiveIndexable(tool: Pick<ToolSeoSource, 'indexable' | 'isActive'>, isImplemented: boolean): boolean {
  return Boolean(tool.isActive && tool.indexable && isImplemented);
}

export function resolveSitemapEligible(tool: ToolSeoSource, isImplemented: boolean): boolean {
  if (!tool.sitemapInclude) return false;
  return resolveEffectiveIndexable(tool, isImplemented);
}

export function buildToolPageMetadata(
  tool: ToolSeoSource,
  options: BuildToolMetadataOptions
): Metadata {
  const siteOrigin = normalizeSiteOrigin(options.siteUrl);
  const titleText = tool.metaTitle.trim() || `${tool.name} | ${options.siteName}`;
  const description =
    tool.metaDescription.trim() ||
    tool.shortDescription.trim() ||
    `${tool.name} on ${options.siteName}.`;
  const canonical = resolveCanonicalUrl({
    adminCanonical: tool.canonicalUrl,
    siteOrigin,
    slug: tool.slug,
  });
  const ogTitle = tool.ogTitle.trim() || tool.metaTitle.trim() || tool.name;
  const ogDescription = tool.ogDescription.trim() || description;
  const ogImage = tool.ogImageUrl.trim() || options.defaultOgImageUrl?.trim() || '';
  const twitterTitle = tool.twitterTitle.trim() || ogTitle;
  const twitterDescription = tool.twitterDescription.trim() || ogDescription;
  const twitterImage = tool.twitterImageUrl.trim() || ogImage;
  const index = resolveEffectiveIndexable(tool, options.isImplemented);

  const robots: Metadata['robots'] = {
    index,
    follow: tool.robotsFollow,
    noarchive: tool.robotsNoArchive || undefined,
    nosnippet: tool.robotsNoSnippet || undefined,
    noimageindex: tool.robotsNoImageIndex || undefined,
  };

  if (tool.robotsMaxSnippet !== null && Number.isFinite(tool.robotsMaxSnippet)) {
    robots['max-snippet'] = tool.robotsMaxSnippet;
  }
  if (tool.robotsMaxImagePreview) {
    robots['max-image-preview'] = tool.robotsMaxImagePreview;
  }
  if (tool.robotsMaxVideoPreview !== null && Number.isFinite(tool.robotsMaxVideoPreview)) {
    robots['max-video-preview'] = tool.robotsMaxVideoPreview;
  }

  const openGraph: Metadata['openGraph'] = {
    title: ogTitle,
    description: ogDescription,
    type: (tool.ogType.trim() || 'website') as 'website',
    siteName: tool.ogSiteName.trim() || options.siteName,
    url: canonical || undefined,
  };
  if (ogImage) {
    openGraph.images = [{ url: ogImage, alt: tool.ogImageAlt.trim() || ogTitle }];
  }

  const twitter = {
    card: (tool.twitterCard || (twitterImage ? 'summary_large_image' : 'summary')) as
      | 'summary'
      | 'summary_large_image',
    title: twitterTitle,
    description: twitterDescription,
    site: tool.twitterSite.trim() || undefined,
    images: twitterImage ? [twitterImage] : undefined,
  };

  return {
    title: { absolute: titleText },
    description,
    keywords: tool.keywords.trim() || undefined,
    alternates: canonical ? { canonical } : undefined,
    robots,
    openGraph,
    twitter,
  };
}

export interface FaqJsonLdItem {
  question: string;
  answer: string;
}

export function buildToolJsonLd(input: {
  tool: ToolSeoSource;
  siteName: string;
  siteUrl: string;
  isImplemented: boolean;
  breadcrumbs: Array<{ name: string; path: string }>;
  faqs?: readonly FaqJsonLdItem[];
}): Record<string, unknown>[] {
  const origin = normalizeSiteOrigin(input.siteUrl);
  const pageUrl = resolveCanonicalUrl({
    adminCanonical: input.tool.canonicalUrl,
    siteOrigin: origin,
    slug: input.tool.slug,
  });
  const description =
    input.tool.metaDescription.trim() ||
    input.tool.shortDescription.trim() ||
    `${input.tool.name} on ${input.siteName}.`;
  const schemaType =
    input.tool.schemaType || (input.isImplemented ? 'WebApplication' : 'WebPage');

  const graph: Record<string, unknown>[] = [
    {
      '@type': schemaType,
      name: input.tool.name,
      description,
      url: pageUrl || undefined,
      applicationCategory: schemaType === 'WebApplication' ? 'FinanceApplication' : undefined,
      operatingSystem: schemaType === 'WebApplication' ? 'Any' : undefined,
      isAccessibleForFree: true,
    },
  ];

  if (input.breadcrumbs.length > 0 && origin) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: input.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${origin}${crumb.path.startsWith('/') ? crumb.path : `/${crumb.path}`}`,
      })),
    });
  }

  // Caller supplies faqs only when matching Q&A are visible on the page.
  if (input.faqs && input.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: input.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return graph;
}

export function serializeJsonLd(graph: Record<string, unknown>[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  }).replace(/</g, '\\u003c');
}
