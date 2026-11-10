'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ToolCard } from '@/components/shared/ToolCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { getAllTools, getAllCategories, searchTools } from '@/lib/sample-data';
import type { ToolCategory } from '@/types/tool';

export function ToolsDirectoryClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);

  const categories = getAllCategories();
  const allTools = getAllTools();

  // Filter tools based on query and selected category
  const filteredTools = React.useMemo(() => {
    return searchTools(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'All Tools' }]} className="mb-6" />

        {/* Page Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Complete Directory
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
            Explore All Online Tools
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base leading-relaxed">
            Browse our complete collection of calculators, unit converters, PDF editors, image
            processors, and developer utilities. Filter by category or search by keywords.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 shadow-xs sm:p-6">
          {/* Search Input */}
          <div className="relative flex w-full items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tool name, purpose, or keywords (e.g. Percentage, JSON, BMI)..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
              <span>Filter by Category:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white shadow-xs'
                    : 'border border-border bg-background text-foreground hover:bg-muted'
                }`}
              >
                All Tools ({allTools.length})
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug as ToolCategory)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs'
                        : 'border border-border bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    {cat.name} ({cat.toolCount ?? 0})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filters Display */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-foreground">{filteredTools.length}</strong> of{' '}
            <strong>{allTools.length}</strong> available tools
            {selectedCategory !== 'all' && (
              <span>
                {' '}
                in <span className="font-semibold text-primary capitalize">{selectedCategory}</span>
              </span>
            )}
            {searchQuery && (
              <span>
                {' '}
                matching &quot;<span className="font-semibold text-foreground">{searchQuery}</span>
                &quot;
              </span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={handleReset}
              className="font-semibold text-primary hover:underline focus:outline-none"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Tools Grid / Empty State */}
        <div className="mt-6">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching tools found"
              description={`We couldn't find any utilities matching your search criteria. Try a different term or clear the filter.`}
              actionLabel="Reset Directory Filters"
              onAction={handleReset}
            />
          )}
        </div>
      </Container>
    </div>
  );
}
