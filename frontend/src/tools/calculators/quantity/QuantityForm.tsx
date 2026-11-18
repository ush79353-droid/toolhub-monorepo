'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  QUANTITY_FIELD_LABELS,
  QUANTITY_UNITS,
  QUANTITY_UNIT_SYMBOLS,
  type QuantityFieldErrors,
  type QuantityUnit,
} from './types';

export interface QuantityDraft {
  texts: Record<QuantityUnit, string>;
  activeField: QuantityUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<QuantityUnit, string> {
  const texts = {} as Record<QuantityUnit, string>;
  for (const unit of QUANTITY_UNITS) texts[unit] = '';
  return texts;
}

export function emptyDraft(): QuantityDraft {
  return { texts: emptyTexts(), activeField: null };
}

interface QuantityFormProps {
  draft: QuantityDraft;
  errors: QuantityFieldErrors;
  onDraftChange: (draft: QuantityDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function QuantityForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: QuantityFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Enter a value in any field — the others update from individual units. 1 dozen = 12, 1
        baker&apos;s dozen = 13, 1 gross = 144, 1 great gross = 1,728. Negative counts are not
        accepted.
      </div>

      {QUANTITY_UNITS.map((unit) => {
        const id = `qty-${unit}`;
        const error = errors[unit];
        return (
          <div key={unit} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {QUANTITY_FIELD_LABELS[unit]}
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
                  placeholder=""
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
              <span className="flex h-11 min-w-[5.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-center text-sm font-medium text-accent">
                {QUANTITY_UNIT_SYMBOLS[unit]}
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
