'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PPM_FIELD_LABELS,
  PPM_UNITS,
  PPM_UNIT_SYMBOLS,
  type PpmFieldErrors,
  type PpmUnit,
} from './types';

export interface PpmDraft {
  texts: Record<PpmUnit, string>;
  activeField: PpmUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(): PpmDraft {
  return {
    texts: {
      number: '',
      percent: '',
      permille: '',
      ppm: '',
      ppb: '',
      ppt: '',
    },
    activeField: null,
  };
}

interface PpmFormProps {
  draft: PpmDraft;
  errors: PpmFieldErrors;
  exceedsHundredPercent: boolean;
  onDraftChange: (draft: PpmDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function PpmForm({
  draft,
  errors,
  exceedsHundredPercent,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PpmFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Enter a value in any field: the others update from the same dimensionless ratio. 1% =
        10,000 ppm; 1 ppm = 1,000 ppb = 1,000,000 ppt. Negative values are not accepted.
      </div>

      {PPM_UNITS.map((unit) => {
        const id = `ppm-${unit}`;
        const error = errors[unit];
        const symbol = PPM_UNIT_SYMBOLS[unit];
        return (
          <div key={unit} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {PPM_FIELD_LABELS[unit]}
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
              {symbol ? (
                <span className="flex h-11 min-w-[3.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
                  {symbol}
                </span>
              ) : null}
            </div>
            {error ? (
              <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      {exceedsHundredPercent ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          This value exceeds a 100% part-to-whole concentration. The numeric conversion is still
          shown, but it may not represent a conventional fraction of a whole.
        </p>
      ) : null}

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
