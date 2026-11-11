'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function pageItems(current: number, total: number): Array<number | 'gap'> {
  const pages = new Set([1, total]);
  for (let page = current - 1; page <= current + 1; page += 1) {
    if (page >= 1 && page <= total) pages.add(page);
  }
  const sorted = [...pages].sort((left, right) => left - right);
  const items: Array<number | 'gap'> = [];
  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) {
      items.push(page - previous === 2 ? previous + 1 : 'gap');
    }
    items.push(page);
  });
  return items;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}: TablePaginationProps) {
  const start = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalRecords);

  if (totalPages <= 1 && totalRecords <= pageSize) {
    return (
      <div className="flex items-center justify-between px-2 py-3 text-xs text-muted-foreground">
        <span>
          Showing <span className="font-semibold text-accent">{totalRecords}</span> records
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3 text-xs text-muted-foreground">
      <div>
        Showing <span className="font-semibold text-accent">{start}</span> to{' '}
        <span className="font-semibold text-accent">{end}</span> of{' '}
        <span className="font-semibold text-accent">{totalRecords}</span> entries
      </div>

      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2.5 text-xs inline-flex items-center gap-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          {pageItems(currentPage, totalPages).map((item, index) =>
            item === 'gap' ? (
              <span key={`gap-${index}`} className="px-1 text-sm text-muted-foreground" aria-hidden>
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition-colors ${
                  item === currentPage
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                aria-current={item === currentPage ? 'page' : undefined}
              >
                {item}
              </button>
            )
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2.5 text-xs inline-flex items-center gap-1"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
