'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  GRAMS_PER_OUNCE,
  type OzGSource,
  type OuncesToGramsFieldErrors,
  type OuncesToGramsInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface OuncesToGramsDraft {
  source: OzGSource;
  oz: string;
  g: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: OuncesToGramsDraft): OuncesToGramsInput {
  return {
    source: draft.source,
    oz: parseOptionalNumber(draft.oz),
    g: parseOptionalNumber(draft.g),
  };
}

export function emptyDraft(): OuncesToGramsDraft {
  return { source: 'oz', oz: '', g: '' };
}

interface OuncesToGramsFormProps {
  draft: OuncesToGramsDraft;
  errors: OuncesToGramsFieldErrors;
  onDraftChange: (draft: OuncesToGramsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function OuncesToGramsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: OuncesToGramsFormProps) {
  const set = (patch: Partial<OuncesToGramsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact: 1 avoirdupois ounce = {GRAMS_PER_OUNCE} g. Edit either field: the other updates
 instantly. Mass only; not fluid ounces.
      </div>

      <FieldShell
        label="Ounces"
        htmlFor="oz-g-oz"
        tip={`g = oz × ${GRAMS_PER_OUNCE}. Avoirdupois mass ounces, not fluid ounces.`}
        error={errors.oz}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="oz-g-oz"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.oz}
              placeholder="Enter ounces"
              aria-invalid={Boolean(errors.oz)}
              onChange={(event) => set({ source: 'oz', oz: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            oz
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Grams"
        htmlFor="oz-g-g"
        tip={`oz = g ÷ ${GRAMS_PER_OUNCE}.`}
        error={errors.g}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="oz-g-g"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.g}
              placeholder="Enter grams"
              aria-invalid={Boolean(errors.g)}
              onChange={(event) => set({ source: 'g', g: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            g
          </span>
        </div>
      </FieldShell>

      <div
        className="rounded-xl border border-amber-200/80 bg-amber-50/70 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90"
        role="note"
      >
        <strong className="font-semibold">Note:</strong> This calculator uses the standard
        avoirdupois ounce for mass. Precious metals such as gold and silver are commonly measured
        in troy ounces, which use a different conversion factor.
      </div>

      <p className="text-xs text-muted-foreground">
        1 oz = {GRAMS_PER_OUNCE} g · g = oz × {GRAMS_PER_OUNCE}
      </p>

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
