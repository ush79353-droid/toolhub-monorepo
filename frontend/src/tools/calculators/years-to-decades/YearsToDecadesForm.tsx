'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { YearsDecadesField, YearsToDecadesFieldErrors } from './types';

export interface YearsToDecadesDraft {
  years: string;
  decades: string;
  activeField: YearsDecadesField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): YearsToDecadesDraft {
  return { years: '25', decades: '2.5', activeField: null };
}

export function emptyDraft(): YearsToDecadesDraft {
  return { years: '', decades: '', activeField: null };
}

interface YearsToDecadesFormProps {
  draft: YearsToDecadesDraft;
  errors: YearsToDecadesFieldErrors;
  onDraftChange: (draft: YearsToDecadesDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function YearsToDecadesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: YearsToDecadesFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        One decade is exactly 10 years. Edit either field — the other updates immediately. Named
        calendar decades (the 2020s) are labels, not this duration conversion.
      </div>

      {(
        [
          { key: 'years' as const, label: 'Years' },
          { key: 'decades' as const, label: 'Decades' },
        ] as const
      ).map((field) => {
        const id = `ytd-${field.key}`;
        const error = errors[field.key];
        return (
          <div key={field.key} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {field.label}
            </label>
            <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id={id}
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft[field.key]}
                placeholder="0"
                spellCheck={false}
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
        <Button type="submit" className="h-11 min-w-[120px]">
          Convert
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
