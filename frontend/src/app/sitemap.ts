import type { MetadataRoute } from 'next';
import {
  emptyToolSeoFields,
  resolveSitemapEligible,
  type ToolSeoSource,
} from '@/lib/seo/tool-seo';
import { getPublicCategories } from '@/server/catalog/categories';
import { getPublicToolBySlug, type PublicToolDetail } from '@/server/catalog/tools';
import { getPublicSiteOrigin } from '@/server/seo/public-site';
import { isRegisteredComponentKey } from '@/tools/registry/keys';

/** Known implemented public tool slugs (registry-backed). Extend when new calculators ship. */
const IMPLEMENTED_TOOL_SLUGS = [
  'loan-calculator',
  'auto-loan-calculator',
  'reduced-row-echelon-form-calculator',
  'arm-mortgage-calculator',
  '100-day-calculator',
  '12-volt-wire-size-calculator',
  '0-60-calculator',
  '12-hour-shift-pay-calculator',
  '3x-rent-calculator',
  '3d-printer-buy-vs-outsource-calculator',
  'ar-days-calculator',
  '403b-calculator',
  'adr-calculator',
  'affo-calculator',
  '529-calculator',
  '702010-rule-money-calculator',
  '401k-calculator',
  'amortization-calculator',
  'acreage-calculator',
] as const;

const STATIC_PATHS = [
  '/',
  '/tools',
  '/categories',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
] as const;

function toSeoSource(dbTool: PublicToolDetail): ToolSeoSource {
  return {
    name: dbTool.name,
    slug: dbTool.slug,
    shortDescription: dbTool.shortDescription,
    componentKey: dbTool.componentKey,
    isActive: dbTool.isActive,
    ...emptyToolSeoFields({
      metaTitle: dbTool.metaTitle,
      metaDescription: dbTool.metaDescription,
      canonicalUrl: dbTool.canonicalUrl,
      indexable: dbTool.indexable,
      sitemapInclude: dbTool.sitemapInclude,
      sitemapPriority: dbTool.sitemapPriority,
      sitemapChangeFrequency:
        (dbTool.sitemapChangeFrequency as ToolSeoSource['sitemapChangeFrequency']) || '',
    }),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getPublicSiteOrigin().replace(/\/+$/, '');
  if (!origin || origin.includes('localhost')) {
    // Avoid publishing localhost URLs; configure NEXT_PUBLIC_SITE_URL / SITE_URL in production.
    return [];
  }

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${origin}${path === '/' ? '' : path}`,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.6,
  }));

  try {
    const categories = await getPublicCategories();
    for (const category of categories) {
      entries.push({
        url: `${origin}/categories/${category.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch {
    // Categories optional if API unreachable during build.
  }

  for (const slug of IMPLEMENTED_TOOL_SLUGS) {
    try {
      const tool = await getPublicToolBySlug(slug);
      if (!tool || !isRegisteredComponentKey(tool.componentKey)) continue;
      if (!resolveSitemapEligible(toSeoSource(tool), true)) continue;
      entries.push({
        url: `${origin}/tools/${tool.slug}`,
        lastModified: tool.updatedAt ? new Date(tool.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: typeof tool.sitemapPriority === 'number' ? tool.sitemapPriority : 0.8,
      });
    } catch {
      // Skip unreachable tools.
    }
  }

  return entries;
}
