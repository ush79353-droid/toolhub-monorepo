'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_BASE_PX,
  SIZE_FIELD_LABELS,
  SIZE_UNITS,
  SIZE_UNIT_SYMBOLS,
  type ActiveField,
  type PxToEmFieldErrors,
  type SizeUnit,
} from './types';

export interface PxToEmDraft {
  baseText: string;
  texts: Record<SizeUnit, string>;
  activeField: ActiveField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): PxToEmDraft {
  return {
    baseText: String(DEFAULT_BASE_PX),
    texts: { px: '', em: '', pt: '', percent: '' },
    activeField: null,
  };
}

export function emptyDraft(): PxToEmDraft {
  return defaultDraft();
}

interface PxToEmFormProps {
  draft: PxToEmDraft;
  errors: PxToEmFieldErrors;
  onDraftChange: (draft: PxToEmDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function PxToEmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PxToEmFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Set a base font size (1em = base px). Edit any size field; px, em, pt, and % stay in sync.
        Points use the CSS reference 1px = 0.75pt.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="pte-base" className={labelClass}>
          Base size
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="pte-base"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.baseText}
              placeholder="16"
              aria-invalid={Boolean(errors.base)}
              aria-describedby={errors.base ? 'pte-base-error' : undefined}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  baseText: event.target.value,
                  activeField: 'base',
                })
              }
            />
          </div>
          <span className="flex h-11 min-w-[3.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
            px
          </span>
        </div>
        {errors.base ? (
          <p id="pte-base-error" className="text-xs text-red-600" role="alert">
            {errors.base}
          </p>
        ) : null}
      </div>

      {SIZE_UNITS.map((unit) => {
        const id = `pte-${unit}`;
        const error = errors[unit];
        return (
          <div key={unit} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {SIZE_FIELD_LABELS[unit]}
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
                      ...draft,
                      texts: { ...draft.texts, [unit]: event.target.value },
                      activeField: unit,
                    })
                  }
                />
              </div>
              <span className="flex h-11 min-w-[3.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
                {SIZE_UNIT_SYMBOLS[unit]}
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
