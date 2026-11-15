import type { MetadataRoute } from 'next';
import { getPublicSiteOrigin } from '@/server/seo/public-site';
import { isSiteIndexingEnabled } from '@/server/seo/site-indexing';

export default function robots(): MetadataRoute.Robots {
  const origin = getPublicSiteOrigin().replace(/\/+$/, '');

  // Development / pre-launch: block all crawlers until SITE_ALLOW_INDEXING=true.
  if (!isSiteIndexingEnabled()) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
      host: origin || undefined,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/embed/', '/tools-audit'],
      },
    ],
    sitemap: origin ? `${origin}/sitemap.xml` : undefined,
    host: origin || undefined,
  };
}
