import * as React from 'react';

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
      <h2 className="mb-3 text-base font-semibold text-accent">Table of Contents</h2>

      <ul className="grid list-disc grid-cols-1 gap-x-4 gap-y-1 pl-5 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="marker:text-muted-foreground">
            <a
              href={`#${item.id}`}
              className="rounded-lg px-1 py-1.5 text-sm font-normal leading-snug text-foreground/90 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
