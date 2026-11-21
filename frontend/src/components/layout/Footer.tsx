import * as React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { siteConfig } from '@/config/site';
import { getPublicCategories } from '@/server/catalog/categories';

const SITE_PAGES = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'All Tools' },
  { href: '/categories', label: 'All Categories' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

type SocialId = (typeof siteConfig.social)[number]['id'];

function SocialIcon({ id }: { id: SocialId }) {
  const common = {
    className: 'h-4 w-4',
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true as const,
  };

  switch (id) {
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.26 2.09 16.09 2 14.79 2 11.96 2 10 3.66 10 7.15V9.5H7v4h3V22h4z" />
        </svg>
      );
    case 'x':
      return (
        <svg {...common}>
          <path d="M18.244 2H21.5l-7.1 8.11L22.5 22h-6.53l-5.11-6.69L5.2 22H1.93l7.59-8.67L1.5 2h6.7l4.62 6.13L18.244 2zm-1.15 18.02h1.81L7.01 3.88H5.07l12.02 16.14z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common}>
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 1.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M6.94 8.5H3.56V21h3.38V8.5zM5.25 3A1.96 1.96 0 1 0 5.26 6.9 1.96 1.96 0 0 0 5.25 3zM20.44 21h-3.37v-6.66c0-1.59-.03-3.63-2.21-3.63-2.22 0-2.56 1.73-2.56 3.52V21H9.93V8.5h3.24v1.71h.05c.45-.85 1.55-1.75 3.19-1.75 3.41 0 4.04 2.25 4.04 5.17V21z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...common}>
          <path d="M23.5 7.2a3.1 3.1 0 0 0-2.18-2.2C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.32.5A3.1 3.1 0 0 0 .5 7.2 32.6 32.6 0 0 0 0 12a32.6 32.6 0 0 0 .5 4.8 3.1 3.1 0 0 0 2.18 2.2c1.82.5 9.32.5 9.32.5s7.5 0 9.32-.5a3.1 3.1 0 0 0 2.18-2.2A32.6 32.6 0 0 0 24 12a32.6 32.6 0 0 0-.5-4.8zM9.75 15.5v-7l6.2 3.5-6.2 3.5z" />
        </svg>
      );
    case 'github':
      return (
        <svg {...common}>
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
        </svg>
      );
    default:
      return null;
  }
}

export async function Footer() {
  const categories = await getPublicCategories();
  const currentYear = new Date().getFullYear();
  const columnSize = Math.ceil(categories.length / 3) || 0;
  const categoryColumns = [0, 1, 2]
    .map((index) => categories.slice(index * columnSize, (index + 1) * columnSize))
    .filter((column) => column.length > 0);
  const socialLinks = siteConfig.social.filter((item) => item.href.trim().length > 0);

  return (
    <footer className="border-t border-border bg-white pt-14 pb-8 text-foreground">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-3">
            <Link href="/" className="inline-flex">
              <img src="/images/logo/horizontal-logo.png" alt="Omega Calculators" className="h-12 w-auto" />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your comprehensive platform for fast, free, in-browser online tools. From financial
              calculators and unit converters to developer formatters and PDF utilities.
            </p>
            {socialLinks.length > 0 ? (
              <nav aria-label="Social media" className="mt-4 flex flex-wrap items-center gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-muted hover:text-primary"
                  >
                    <SocialIcon id={item.id} />
                  </a>
                ))}
              </nav>
            ) : null}
          </div>

          <div className="sm:col-span-2 lg:col-span-7">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-accent">Tools Categories</h2>
            {categories.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Categories are not available right now.</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-3">
                {categoryColumns.map((column, columnIndex) => (
                  <ul key={columnIndex} className="space-y-2.5 text-sm">
                    {column.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/categories/${category.slug}`}
                          className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                        >
                          {category.iconUrl ? (
                            <img src={category.iconUrl} alt="" className="h-4 w-4 shrink-0 object-contain" />
                          ) : (
                            <span className="h-4 w-4 shrink-0 rounded-sm bg-muted" aria-hidden="true" />
                          )}
                          <span>{category.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-accent">Meet Omega</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SITE_PAGES.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="text-muted-foreground transition-colors hover:text-primary">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <nav aria-label="Legal" className="flex items-center gap-4">
            <Link href="/privacy-policy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </nav>
          <p className="text-center sm:text-right">© {currentYear} Omega Calculators. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
