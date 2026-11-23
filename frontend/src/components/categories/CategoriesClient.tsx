'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, SearchX, X } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import type { PublicCategory } from '@/server/catalog/categories';

export function CategoriesClient({ categories }: { categories: PublicCategory[] }) {
  const [query, setQuery] = React.useState('');
  const trimmed = query.trim().toLowerCase();
  const visible = trimmed
    ? categories.filter(
        (category) =>
          category.name.toLowerCase().includes(trimmed) ||
          category.description.toLowerCase().includes(trimmed) ||
          category.slug.toLowerCase().includes(trimmed)
      )
    : categories;

  return (
    <div>
      <section className="relative border-b border-border bg-gradient-to-br from-[#cfeeed] via-[#e7f6f4] to-[#f4f7f2]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_32%_32%,#ffffff,hsl(177,42%,78%))]" />
          <div className="absolute -right-20 top-6 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,hsl(175,35%,84%))]" />
          <div className="absolute bottom-10 right-[18%] h-40 w-40 rounded-full bg-[radial-gradient(circle_at_40%_40%,#ffffff,hsl(186,35%,86%))]" />
        </div>
        <Container className="relative z-10 py-10 sm:py-14">
          <Breadcrumbs items={[{ label: 'All Categories' }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">All categories</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Search the groups, or open one to see its calculators.
            </p>
          </div>
          <div className="mx-auto mt-8 w-full max-w-2xl">
            <label className="sr-only" htmlFor="category-search">
              Search categories
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" aria-hidden="true" />
              <input
                id="category-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search categories"
                className="h-14 w-full rounded-2xl border border-border bg-white pl-14 pr-12 text-base text-foreground shadow-[0_18px_40px_-24px_rgba(22,60,67,0.55)] placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-muted/30 py-10 sm:py-14">
        <Container>
          {categories.length === 0 ? (
            <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
              <SearchX className="h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-accent sm:text-4xl">
                Categories unavailable
              </h2>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
                The category list could not be loaded. Refresh the page in a moment.
              </p>
            </div>
          ) : visible.length === 0 ? (
            <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
              <SearchX className="h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-accent sm:text-4xl">
                No categories found
              </h2>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
                {`Nothing matches "${query.trim()}". Try another name.`}
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-8 inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary"
              >
                Clear search
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {visible.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex h-full flex-col items-center rounded-2xl border border-border bg-white px-3 py-7 text-center shadow-xs transition-colors hover:border-primary/40 hover:bg-muted/50"
                  >
                    {category.iconUrl ? (
                      <img src={category.iconUrl} alt="" className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="h-8 w-8 rounded-lg bg-muted" aria-hidden="true" />
                    )}
                    <span className="mt-4 line-clamp-2 text-sm font-semibold text-accent">{category.name}</span>
                    <span className="mt-1 text-xs tabular-nums text-muted-foreground">
                      {category.toolCount.toLocaleString()} {category.toolCount === 1 ? 'calculator' : 'calculators'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </div>
  );
}
