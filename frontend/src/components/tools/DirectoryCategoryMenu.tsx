'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export function DirectoryCategoryMenu({
  categories,
  value,
}: {
  categories: CategoryOption[];
  value: string;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(value);
  const selected = categories.find((item) => item.slug === current) ?? null;

  React.useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  function choose(slug: string) {
    setCurrent(slug);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative border-t border-border sm:w-60 sm:shrink-0 sm:border-l sm:border-t-0">
      <input type="hidden" name="category" value={current} />
      <button
        type="button"
        id="tool-category"
        aria-label="Category"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="tool-category-list"
        onClick={() => setOpen((next) => !next)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false);
        }}
        className="flex h-12 w-full items-center justify-between gap-3 px-4 text-left text-sm text-foreground sm:h-14"
      >
        <span className="truncate">{selected ? selected.name : 'All categories'}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <ul
          id="tool-category-list"
          role="listbox"
          aria-label="Category"
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 max-h-72 overflow-y-auto rounded-xl border border-border bg-white py-1 shadow-lg sm:left-auto sm:w-64"
        >
          <li role="option" aria-selected={current === ''}>
            <button
              type="button"
              onClick={() => choose('')}
              className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm ${
                current === '' ? 'bg-secondary text-accent' : 'text-foreground hover:bg-muted'
              }`}
            >
              <span>All categories</span>
              {current === '' ? <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" /> : null}
            </button>
          </li>
          {categories.map((item) => {
            const active = item.slug === current;
            return (
              <li key={item.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => choose(item.slug)}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm ${
                    active ? 'bg-secondary text-accent' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  {active ? <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
