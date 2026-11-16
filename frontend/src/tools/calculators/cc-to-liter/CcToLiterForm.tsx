'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CC_DISPLAY_OPTIONS,
  type CcDisplayUnit,
  type CcLiterSource,
  type CcToLiterFieldErrors,
  type CcToLiterInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CcToLiterDraft {
  source: CcLiterSource;
  cc: string;
  liters: string;
  ccUnit: CcDisplayUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitSelectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: CcToLiterDraft): CcToLiterInput {
  return {
    source: draft.source,
    cc: parseOptionalNumber(draft.cc),
    liters: parseOptionalNumber(draft.liters),
  };
}

export function emptyDraft(): CcToLiterDraft {
  return { source: 'cc', cc: '', liters: '', ccUnit: 'cm3' };
}

interface CcToLiterFormProps {
  draft: CcToLiterDraft;
  errors: CcToLiterFieldErrors;
  onDraftChange: (draft: CcToLiterDraft) => void;
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

export function CcToLiterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CcToLiterFormProps) {
  const set = (patch: Partial<CcToLiterDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 L = 1000 cc = 1000 cm³. Edit either field — the other updates instantly. Volume
        cannot be negative. cm³, cc, and mL label the same cubic-centimeter volume.
      </div>

      <FieldShell
        label="Volume in cubic centimeters"
        htmlFor="cc-l-cc"
        tip="Enter cubic centimeters. Liters = cc ÷ 1000. The unit menu only changes the label (cm³ = cc = mL)."
        error={errors.cc}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cc-l-cc"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cc}
              placeholder="Enter cubic centimeters"
              aria-invalid={Boolean(errors.cc)}
              onChange={(event) => set({ source: 'cc', cc: event.target.value })}
            />
          </div>
          <select
            className={unitSelectClass}
            value={draft.ccUnit}
            aria-label="Cubic centimeter unit label"
            onChange={(event) => set({ ccUnit: event.target.value as CcDisplayUnit })}
          >
            {CC_DISPLAY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in liters"
        htmlFor="cc-l-liters"
        tip="Enter liters. Cubic centimeters = L × 1000."
        error={errors.liters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cc-l-liters"
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

      <p className="text-xs text-muted-foreground">1 L = 1000 cc = 1000 cm³ = 1000 mL</p>

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
