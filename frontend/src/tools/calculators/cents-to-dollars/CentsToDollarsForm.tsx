'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CentsDollarsField, CentsToDollarsFieldErrors } from './types';

export interface CentsToDollarsDraft {
  cents: string;
  dollars: string;
  activeField: CentsDollarsField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): CentsToDollarsDraft {
  return { cents: '250', dollars: '2.50', activeField: null };
}

export function emptyDraft(): CentsToDollarsDraft {
  return { cents: '', dollars: '', activeField: null };
}

interface CentsToDollarsFormProps {
  draft: CentsToDollarsDraft;
  errors: CentsToDollarsFieldErrors;
  onDraftChange: (draft: CentsToDollarsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function CentsToDollarsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CentsToDollarsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        100 US cents = 1 US dollar. Edit either field — the other updates immediately. This converts
        denominations of the same currency, not foreign exchange rates.
      </div>

      {(
        [
          { key: 'cents' as const, label: 'Cents', unit: '¢' },
          { key: 'dollars' as const, label: 'Dollars', unit: '$' },
        ] as const
      ).map((field) => {
        const id = `ctd-${field.key}`;
        const error = errors[field.key];
        return (
          <div key={field.key} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {field.label}
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  className={inputClass}
                  value={draft[field.key]}
                  placeholder="0"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-error` : undefined}
                  onChange={(event) =>
                    onDraftChange({
                      ...draft,
                      [field.key]: event.target.value,
                      activeField: field.key,
                    })
                  }
                />
              </div>
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
                {field.unit}
              </span>
            </div>
            {error ? (
              <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Convert
        </button>
      </div>
    </form>
  );
}
