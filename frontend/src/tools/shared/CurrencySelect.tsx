'use client';

import * as React from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CURRENCY_DENOMINATION_NOTE,
  CURRENCY_DEFINITIONS,
  filterCurrencies,
  getCurrencyShortLabel,
  isSupportedCurrency,
  type SupportedCurrency,
} from './currency';

export interface CurrencySelectProps {
  id: string;
  value: SupportedCurrency;
  onChange: (currency: SupportedCurrency) => void;
  className?: string;
  'aria-label'?: string;
}

export function CurrencySelect({
  id,
  value,
  onChange,
  className,
  'aria-label': ariaLabel = 'Display currency',
}: CurrencySelectProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);

  const options = React.useMemo(() => filterCurrencies(query), [query]);
  const listboxId = `${id}-listbox`;
  const activeOptionId =
    options.length > 0 ? `${id}-option-${options[Math.min(activeIndex, options.length - 1)]!.code}` : undefined;

  React.useEffect(() => {
    if (!open) return;
    setQuery('');
    const selectedIndex = CURRENCY_DEFINITIONS.findIndex((opt) => opt.code === value);
    setActiveIndex(Math.max(0, selectedIndex));
    const frame = window.requestAnimationFrame(() => searchRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open, value]);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  React.useEffect(() => {
    setActiveIndex((current) => {
      if (options.length === 0) return 0;
      return Math.min(current, options.length - 1);
    });
  }, [options]);

  React.useEffect(() => {
    if (!open || !listRef.current || options.length === 0) return;
    const safeIndex = Math.min(activeIndex, options.length - 1);
    const node = listRef.current.querySelector<HTMLElement>(`#${id}-option-${options[safeIndex]!.code}`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, id, open, options]);

  const selectCurrency = (code: SupportedCurrency) => {
    onChange(code);
    setOpen(false);
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (options.length === 0) return;
      setActiveIndex((index) => (index + 1) % options.length);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (options.length === 0) return;
      setActiveIndex((index) => (index - 1 + options.length) % options.length);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const choice = options[activeIndex];
      if (choice && isSupportedCurrency(choice.code)) {
        selectCurrency(choice.code);
      }
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      if (options.length > 0) setActiveIndex(options.length - 1);
    }
  };

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        title={CURRENCY_DENOMINATION_NOTE}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
        className="flex h-9 w-full items-center justify-between gap-1.5 rounded-lg border border-border bg-white px-2.5 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <span className="truncate">{getCurrencyShortLabel(value)}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-1 w-[min(100vw-2rem,18rem)] overflow-hidden rounded-xl border border-border bg-white shadow-md sm:w-72">
          <div className="border-b border-border p-2">
            <label htmlFor={`${id}-search`} className="sr-only">
              Search currencies
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                id={`${id}-search`}
                type="search"
                autoComplete="off"
                spellCheck={false}
                placeholder="Search code or name"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onSearchKeyDown}
                aria-controls={listboxId}
                aria-activedescendant={activeOptionId}
                className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <p className="mt-1.5 px-0.5 text-[11px] leading-snug text-muted-foreground">
              {CURRENCY_DENOMINATION_NOTE}
            </p>
          </div>

          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label="Currencies"
            className="max-h-56 overflow-y-auto py-1"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No matching currency</li>
            ) : (
              options.map((option, index) => {
                const selected = option.code === value;
                const active = index === activeIndex;
                return (
                  <li
                    key={option.code}
                    id={`${id}-option-${option.code}`}
                    role="option"
                    aria-selected={selected}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm',
                      active && 'bg-secondary text-accent',
                      !active && 'hover:bg-muted/60'
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      if (isSupportedCurrency(option.code)) selectCurrency(option.code);
                    }}
                  >
                    <span className="min-w-0">
                      <span className="font-medium text-foreground">{option.code}</span>
                      <span className="ml-1.5 text-muted-foreground">{option.name}</span>
                    </span>
                    {selected ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                    ) : (
                      <span className="shrink-0 text-xs text-muted-foreground">{option.symbol}</span>
                    )}
                  </li>
                );
              })
            )}
          </ul>

          {options.length === CURRENCY_DEFINITIONS.length ? null : (
            <p className="border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground">
              {options.length} match{options.length === 1 ? '' : 'es'}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
