'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Select } from '@/components/ui/select';

interface FilterOption {
  label: string;
  value: string;
}

interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  categoryFilter?: string;
  onCategoryChange?: (category: string) => void;
  categoryOptions?: FilterOption[];
  statusFilter?: string;
  onStatusChange?: (status: string) => void;
  statusOptions?: FilterOption[];
  extraFilters?: React.ReactNode;
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

export function TableFilters({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  categoryFilter,
  onCategoryChange,
  categoryOptions,
  statusFilter,
  onStatusChange,
  statusOptions,
  extraFilters,
  onReset,
  hasActiveFilters,
}: TableFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 pb-4">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-9 w-full rounded-lg border border-border bg-white pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Category Dropdown */}
      {categoryOptions && onCategoryChange && (
        <div className="w-full sm:w-44">
          <Select
            value={categoryFilter ?? ''}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Status Dropdown */}
      {statusOptions && onStatusChange && (
        <div className="w-full sm:w-36">
          <Select
            value={statusFilter ?? ''}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Extra Filters (e.g. execution types) */}
      {extraFilters}

      {/* Reset Filter Button */}
      {hasActiveFilters && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-muted/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-3 w-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}

