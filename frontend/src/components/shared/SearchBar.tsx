'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';

export interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  size?: 'default' | 'large';
  autoNavigate?: boolean;
}

export function SearchBar({
  initialQuery = '',
  placeholder = 'Search among calculators, converters, PDF tools...',
  onSearch,
  className = '',
  size = 'default',
  autoNavigate = false,
}: SearchBarProps) {
  const [query, setQuery] = React.useState(initialQuery);
  const router = useRouter();

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (onSearch) {
      onSearch(trimmed);
    }
    if (autoNavigate) {
      router.push(`/tools?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const isLarge = size === 'large';

  return (
    <form onSubmit={handleSubmit} className={`relative flex w-full items-center ${className}`}>
      <div className="relative flex w-full items-center shadow-xs">
        <div className="pointer-events-none absolute left-3.5 flex items-center text-muted-foreground sm:left-4">
          <Search className={isLarge ? 'h-5 w-5 text-primary' : 'h-4 w-4'} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            if (onSearch && !autoNavigate) {
              onSearch(val);
            }
          }}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
            isLarge ? 'h-14 pl-12 pr-28 text-base shadow-sm' : 'h-11 pl-10 pr-20 text-sm'
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Clear search input"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="submit"
          className={`absolute right-1.5 inline-flex items-center justify-center rounded-lg bg-primary font-semibold text-white shadow-xs hover:bg-[hsl(var(--primary-hover))] transition-colors ${
            isLarge ? 'h-11 px-4 text-sm' : 'h-8 px-3 text-xs'
          }`}
        >
          <span>Search</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}
