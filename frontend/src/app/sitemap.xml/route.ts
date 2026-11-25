import { sitemapIndex } from '@/lib/seo/sitemap-xml';
import { getSitemapCatalog, sitemapFileIds, sitemapOrigin } from '@/server/seo/sitemap';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const origin = sitemapOrigin();
  const ids = origin ? sitemapFileIds(await getSitemapCatalog()) : [];
  const xml = sitemapIndex(ids.map((id) => `${origin}/sitemap/${id}.xml`));
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
