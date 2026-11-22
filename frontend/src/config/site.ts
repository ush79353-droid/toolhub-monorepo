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
  /**
   * Who runs the site. Change these here.
   * Empty fields stay off the public pages.
   * `email` is the general address on About and Contact.
   */
  operator: {
    name: '',
    city: 'Karachi',
    country: 'Pakistan',
    email: 'info@omegacalculators.com',
  },
  /**
   * Contact page. Empty business email and address lines stay off the page.
   * Set `responseTime` to a window you can keep. Leave it blank to hide that line.
   * City and country for a postal address come from `operator`.
   */
  contact: {
    businessEmail: 'contact@omegacalculators.com',
    phone: '+923123456789',
    responseTime: '3 to 5 business days',
    company: 'Uzair Software House',
    street: '',
  },
  /**
   * Privacy policy. Change the date and the email-keeping period here.
   */
  privacy: {
    updated: 'November 14, 2026',
    emailRetention: '12 months',
  },
  /** Terms of service. Change the date here. */
  terms: {
    updated: 'November 14, 2026',
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
