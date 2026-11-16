'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CcMlSource, CcToMlFieldErrors, CcToMlInput } from './types';
import { parseOptionalNumber } from './validation';

export interface CcToMlDraft {
  source: CcMlSource;
  cc: string;
  ml: string;
  liters: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: CcToMlDraft): CcToMlInput {
  return {
    source: draft.source,
    cc: parseOptionalNumber(draft.cc),
    ml: parseOptionalNumber(draft.ml),
    liters: parseOptionalNumber(draft.liters),
  };
}

export function emptyDraft(): CcToMlDraft {
  return { source: 'cc', cc: '', ml: '', liters: '' };
}

interface CcToMlFormProps {
  draft: CcToMlDraft;
  errors: CcToMlFieldErrors;
  onDraftChange: (draft: CcToMlDraft) => void;
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

export function CcToMlForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CcToMlFormProps) {
  const set = (patch: Partial<CcToMlDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 cc = 1 cm³ = 1 mL, and 1 L = 1000 mL. Edit any field — the other two update
        instantly. Volume cannot be negative.
      </div>

      <FieldShell
        label="Volume in cubic centimeters"
        htmlFor="cc-ml-cc"
        tip="Enter cubic centimeters (cc = cm³). Milliliters match one-to-one; liters = cc ÷ 1000."
        error={errors.cc}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cc-ml-cc"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cc}
              placeholder="Enter cubic centimeters"
              aria-invalid={Boolean(errors.cc)}
              onChange={(event) => set({ source: 'cc', cc: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cm³ (cc)
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in milliliters"
        htmlFor="cc-ml-ml"
        tip="Enter milliliters. Cubic centimeters match one-to-one; liters = mL ÷ 1000."
        error={errors.ml}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cc-ml-ml"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.ml}
              placeholder="Enter milliliters"
              aria-invalid={Boolean(errors.ml)}
              onChange={(event) => set({ source: 'ml', ml: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mL
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in liters"
        htmlFor="cc-ml-liters"
        tip="Enter liters. Cubic centimeters and milliliters = L × 1000."
        error={errors.liters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cc-ml-liters"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.liters}
              placeholder="Enter liters"
              aria-invalid={Boolean(errors.liters)}
              onChange={(event) => set({ source: 'liters', liters: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            L
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">1 cc = 1 cm³ = 1 mL · 1000 cc = 1 L</p>

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
