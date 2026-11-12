import * as React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { MobileNavigation } from './MobileNavigation';
import { Search, ChevronDown, Sparkles } from 'lucide-react';
import { getPublicCategories } from '@/server/catalog/categories';

export async function Header() {
  const categories = await getPublicCategories();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-md transition-shadow">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="group flex shrink-0 items-center">
          <img
            src="/images/logo/horizontal-logo.png"
            alt="Omega Calculators"
            className="h-8 w-auto sm:h-9 lg:h-10 transition-transform group-hover:scale-[1.01]"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-0.5 md:flex lg:gap-1"
        >
          <Link
            href="/"
            className="whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted hover:text-primary lg:px-3 lg:text-sm"
          >
            Home
          </Link>
          <Link
            href="/tools"
            className="whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted hover:text-primary lg:px-3 lg:text-sm"
          >
            All Tools
          </Link>

          {/* Categories Dropdown Container */}
          <div className="group relative">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted hover:text-primary lg:px-3 lg:text-sm"
            >
              <span>Categories</span>
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </Link>

            {/* Dropdown Menu */}
            <div className="invisible absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/2 translate-y-2 rounded-2xl border border-border bg-white p-4 shadow-lg opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex items-baseline justify-between gap-4 px-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Browse by subject</p>
                <Link href="/categories" className="text-xs font-medium text-accent hover:text-primary">
                  All categories
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="rounded-lg px-3 py-2 text-sm leading-snug text-accent transition-colors hover:bg-secondary hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/about"
            className="whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted hover:text-primary lg:px-3 lg:text-sm"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted hover:text-primary lg:px-3 lg:text-sm"
          >
            Contact
          </Link>
        </nav>

        {/* Right CTA & Search */}
        <div className="flex shrink-0 items-center gap-2.5 lg:gap-3">
          <Link
            href="/tools"
            aria-label="Search tools"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href="/tools"
            className="hidden h-9 items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-3.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-[hsl(var(--primary-hover))] lg:inline-flex"
          >
            <Sparkles className="h-4 w-4" />
            <span>Explore Tools</span>
          </Link>

          {/* Mobile Navigation Trigger */}
          <MobileNavigation categories={categories.map(({ id, name, slug }) => ({ id, name, slug }))} />
        </div>
      </Container>
    </header>
  );
}
