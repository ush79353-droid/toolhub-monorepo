'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PAPER_FIELD_LABELS,
  PAPER_UNITS,
  PAPER_UNIT_LABELS,
  type PaperQuantityFieldErrors,
  type PaperUnit,
} from './types';

export interface PaperQuantityDraft {
  texts: Record<PaperUnit, string>;
  activeField: PaperUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(): PaperQuantityDraft {
  return {
    texts: { sheets: '', quires: '', reams: '', bundles: '', bales: '' },
    activeField: null,
  };
}

interface PaperQuantityFormProps {
  draft: PaperQuantityDraft;
  errors: PaperQuantityFieldErrors;
  onDraftChange: (draft: PaperQuantityDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function PaperQuantityForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PaperQuantityFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Modern paper-count standard: 1 quire = 25 sheets, 1 ream = 500 sheets, 1 bundle = 1,000
 sheets, 1 bale = 5,000 sheets. Enter any field: the others update immediately.
      </div>

      {PAPER_UNITS.map((unit) => {
        const id = `pq-${unit}`;
        const error = errors[unit];
        return (
          <div key={unit} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {PAPER_FIELD_LABELS[unit]}
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  className={inputClass}
                  value={draft.texts[unit]}
                  placeholder="0"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-error` : undefined}
                  onChange={(event) =>
                    onDraftChange({
                      texts: { ...draft.texts, [unit]: event.target.value },
                      activeField: unit,
                    })
                  }
                />
              </div>
              <span className="flex h-11 w-[5.75rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
                {PAPER_UNIT_LABELS[unit]}
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
