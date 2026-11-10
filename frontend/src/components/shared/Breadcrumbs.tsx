import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-muted-foreground ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-border" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="max-w-[150px] truncate transition-colors hover:text-primary sm:max-w-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="max-w-[200px] truncate font-semibold text-foreground sm:max-w-none"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
