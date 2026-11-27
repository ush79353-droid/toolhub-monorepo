'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startNavigationProgress } from './NavigationProgress';
import { Loader2, Search } from 'lucide-react';

interface ToolSuggestion {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  categoryName: string;
}

const DEBOUNCE_MS = 300;

function highlight(name: string, query: string): React.ReactNode {
  const index = name.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return name;
  return (
    <>
      {name.slice(0, index)}
      <span className="font-semibold text-primary">{name.slice(index, index + query.length)}</span>
      {name.slice(index + query.length)}
    </>
  );
}

export function HeaderSearch({
  className = '',
  inputId = 'header-tool-search',
  size = 'default',
}: {
  className?: string;
  inputId?: string;
  size?: 'default' | 'large';
}) {
  const router = useRouter();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<ToolSuggestion[]>([]);
  const [active, setActive] = React.useState(0);
  const [searched, setSearched] = React.useState('');

  React.useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setItems([]);
      setLoading(false);
      setSearched('');
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/catalog/tools/suggest?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as { data?: { items?: ToolSuggestion[] } };
        if (controller.signal.aborted) return;
        setItems((payload.data?.items ?? []).slice(0, 10));
        setSearched(trimmed);
        setActive(0);
        setOpen(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          setItems([]);
          setSearched(trimmed);
          setOpen(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  React.useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  function goToDirectory() {
    const trimmed = query.trim();
    setOpen(false);
    startNavigationProgress();
    router.push(trimmed ? `/tools?q=${encodeURIComponent(trimmed)}` : '/tools');
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActive((current) => (items.length === 0 ? 0 : (current + 1) % items.length));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActive((current) => (items.length === 0 ? 0 : (current - 1 + items.length) % items.length));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const chosen = open ? items[active] : undefined;
      if (chosen) {
        setOpen(false);
        startNavigationProgress();
        router.push(`/tools/${chosen.slug}`);
        return;
      }
      goToDirectory();
    }
  }

  const showPanel = open && query.trim().length > 0;
  const large = size === 'large';

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label htmlFor={inputId} className="sr-only">
        Search tools
      </label>
      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
          large ? 'left-5 h-5 w-5 text-primary' : 'left-3 h-4 w-4 text-muted-foreground'
        }`}
      />
      <input
        id={inputId}
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={`${inputId}-list`}
        aria-autocomplete="list"
        autoComplete="off"
        value={query}
        placeholder={large ? 'Search calculators, converters, and tools' : 'Search tools'}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim()) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className={`w-full border border-border bg-white text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          large
            ? 'h-14 rounded-2xl pl-14 pr-12 text-base shadow-[0_18px_40px_-24px_rgba(22,60,67,0.55)]'
            : 'h-10 rounded-xl pl-9 pr-9 text-sm shadow-xs'
        }`}
      />
      {loading ? (
        <Loader2
          className={`absolute top-1/2 -translate-y-1/2 animate-spin text-muted-foreground ${
            large ? 'right-5 h-5 w-5' : 'right-3 h-4 w-4'
          }`}
        />
      ) : null}

      {showPanel ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
          <ul id={`${inputId}-list`} role="listbox" className="max-h-80 overflow-y-auto py-1">
            {items.map((item, index) => (
              <li key={item.id} role="option" aria-selected={index === active}>
                <Link
                  href={`/tools/${item.slug}`}
                  onMouseEnter={() => setActive(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setOpen(false)}
                  className={`flex flex-col gap-0.5 px-3 py-2 ${index === active ? 'bg-secondary' : 'hover:bg-muted'}`}
                >
                  <span className="truncate text-sm text-foreground">{highlight(item.name, searched)}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {item.categoryName || item.shortDescription || 'Calculator'}
                  </span>
                </Link>
              </li>
            ))}
            {loading && items.length === 0 ? (
              <li className="px-3 py-3 text-sm text-muted-foreground">Searching…</li>
            ) : null}
            {!loading && searched === query.trim() && items.length === 0 ? (
              <li className="px-3 py-3 text-sm text-muted-foreground">No matching tools.</li>
            ) : null}
          </ul>
          <button
            type="button"
            onClick={goToDirectory}
            className="flex w-full items-center justify-between border-t border-border px-3 py-2 text-left text-xs font-medium text-primary hover:bg-muted"
          >
            <span>See all results</span>
            <span className="text-muted-foreground">Enter</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
