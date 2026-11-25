/**
 * Hand-maintained lastModified dates for pages that are not catalog records.
 * Change the date when that page's content changes. Do not use the request time.
 */
export const STATIC_SITEMAP_PAGES = [
  { path: '/', lastModified: '2026-11-25', priority: 1 },
  { path: '/tools', lastModified: '2026-11-25', priority: 0.9 },
  { path: '/categories', lastModified: '2026-11-25', priority: 0.7 },
  { path: '/about', lastModified: '2026-11-25', priority: 0.4 },
  { path: '/contact', lastModified: '2026-11-25', priority: 0.4 },
  { path: '/privacy-policy', lastModified: '2026-11-25', priority: 0.3 },
  { path: '/terms-of-service', lastModified: '2026-11-25', priority: 0.3 },
  { path: '/disclaimer', lastModified: '2026-11-25', priority: 0.3 },
  { path: '/dmca-policy', lastModified: '2026-11-25', priority: 0.3 },
] as const;

export const STATIC_SITEMAP_ID = 'static';
export const UNASSIGNED_SITEMAP_ID = 'unassigned';

/** Pillar slugs that would collide with reserved sitemap file names. */
export function sitemapIdForPillar(slug: string): string {
  if (slug === STATIC_SITEMAP_ID || slug === UNASSIGNED_SITEMAP_ID) return `pillar-${slug}`;
  return slug;
}
