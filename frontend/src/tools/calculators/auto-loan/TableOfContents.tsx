import * as React from 'react';
import { ListOrdered } from 'lucide-react';

export interface TableOfContentsItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: readonly TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-2xl border border-border bg-white p-5 shadow-xs sm:p-6"
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-accent">Table of Contents</h2>
      </div>

      <ol className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="group flex items-baseline gap-2.5 rounded-lg px-2 py-1.5 text-sm font-normal text-foreground/90 transition-colors hover:bg-muted/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="font-mono text-xs font-normal text-muted-foreground group-hover:text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="leading-snug">{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
