'use client';

import * as React from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { CategoryCard } from '@/components/shared/CategoryCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Search, X } from 'lucide-react';
import { getAllCategories } from '@/lib/sample-data';

export function CategoriesClient() {
  const [query, setQuery] = React.useState('');
  const allCategories = getAllCategories();

  const filteredCategories = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allCategories;
    return allCategories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q)
    );
  }, [query, allCategories]);

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'Categories' }]} className="mb-6" />

        {/* Heading */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Tool Categories
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
            Browse Tools by Category
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base leading-relaxed">
            Find exactly what you need by exploring our specialized utility groups. Each category
            houses tailored tools designed for accuracy, speed, and privacy.
          </p>
        </div>

        {/* Filter Input */}
        <div className="mt-8 max-w-md">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter categories (e.g., PDF, Calculator, Developer)..."
              className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear filter query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mt-8">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCategories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No categories match your search"
              description="Try typing a broader term like 'calc', 'converter', or 'image'."
              actionLabel="Show All Categories"
              onAction={() => setQuery('')}
            />
          )}
        </div>
      </Container>
    </div>
  );
}
