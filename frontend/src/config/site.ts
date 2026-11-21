function resolveSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    '';
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  return 'http://localhost:3000';
}

export const siteConfig = {
  name: 'Omega Calculators',
  description:
    'Comprehensive online tools platform featuring calculators, converters, PDF utilities, image tools, and developer utilities.',
  url: resolveSiteUrl(),
  defaultOgImage: '/images/logo/icon-with-bg.png',
  links: {
    github: 'https://github.com/mega-tools/platform',
  },
  /** Footer social icons. Change hrefs here; empty href hides that icon. */
  social: [
    { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/' },
    { id: 'x', label: 'X', href: 'https://x.com/' },
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/' },
    { id: 'youtube', label: 'YouTube', href: 'https://youtube.com/' },
    { id: 'github', label: 'GitHub', href: 'https://github.com/' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
