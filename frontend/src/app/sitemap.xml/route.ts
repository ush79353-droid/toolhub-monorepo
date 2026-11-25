import { sitemapIndex } from '@/lib/seo/sitemap-xml';
import { getPublicSiteOrigin } from '@/server/seo/public-site';
import { isSiteIndexingEnabled } from '@/server/seo/site-indexing';
import { getSitemapCatalog, sitemapFileIds } from '@/server/seo/sitemap';

export const dynamic = 'force-dynamic';

function originOrNull(): string | null {
  if (!isSiteIndexingEnabled()) return null;
  const origin = getPublicSiteOrigin().replace(/\/+$/, '');
  if (!origin || origin.includes('localhost')) return null;
  return origin;
}

export async function GET(): Promise<Response> {
  const origin = originOrNull();
  const ids = origin ? sitemapFileIds(await getSitemapCatalog()) : [];
  const xml = sitemapIndex(ids.map((id) => `${origin}/sitemap/${id}.xml`));
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
