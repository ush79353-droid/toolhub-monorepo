'use client';

import type { FormEvent, ReactNode } from 'react';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  type LiterCcSource,
  type LiterToCcFieldErrors,
  type LiterToCcInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface LiterToCcDraft {
  source: LiterCcSource;
  liters: string;
  cc: string;
  /** Visual order: true = liters field first. */
  litersFirst: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: LiterToCcDraft): LiterToCcInput {
  return {
    source: draft.source,
    liters: parseOptionalNumber(draft.liters),
    cc: parseOptionalNumber(draft.cc),
  };
}

export function emptyDraft(): LiterToCcDraft {
  return { source: 'liters', liters: '', cc: '', litersFirst: true };
}

interface LiterToCcFormProps {
  draft: LiterToCcDraft;
  errors: LiterToCcFieldErrors;
  onDraftChange: (draft: LiterToCcDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onSwap: () => void;
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

export function LiterToCcForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onSwap,
  children,
}: LiterToCcFormProps) {
  const set = (patch: Partial<LiterToCcDraft>) => onDraftChange({ ...draft, ...patch });

  const litersField = (
    <FieldShell
      key="liters"
      label="Liters (L)"
      htmlFor="l-cc-liters"
      tip="Enter a volume in liters. Cubic centimeters update as liters × 1000."
      error={errors.liters}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="l-cc-liters"
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
  );

  const ccField = (
    <FieldShell
      key="cc"
      label="Cubic centimeters (cc)"
      htmlFor="l-cc-cc"
      tip="Enter a volume in cubic centimeters (cc = cm³). Liters update as cc ÷ 1000."
      error={errors.cc}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="l-cc-cc"
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
          cm³
        </span>
      </div>
    </FieldShell>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 L = 1000 cc = 1000 cm³. Edit either field — the other updates instantly. Volume
        cannot be negative. cc and cm³ are the same unit.
      </div>

      {draft.litersFirst ? (
        <>
          {litersField}
          {ccField}
        </>
      ) : (
        <>
          {ccField}
          {litersField}
        </>
      )}

      <p className="text-xs text-muted-foreground">1 L = 1000 cc = 1000 cm³ = 1 dm³</p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onSwap}>
          <ArrowUpDown className="mr-1.5 h-4 w-4" />
          Swap units
        </Button>
      </div>

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
