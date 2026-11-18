'use client';

import type { FormEvent, ReactNode } from 'react';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { type BarAtmSource, type BarToAtmFieldErrors, type BarToAtmInput } from './types';
import { parseOptionalNumber } from './validation';

export interface BarToAtmDraft {
  source: BarAtmSource;
  bar: string;
  atm: string;
  /** Visual order: true = bar field first. */
  barFirst: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: BarToAtmDraft): BarToAtmInput {
  return {
    source: draft.source,
    bar: parseOptionalNumber(draft.bar),
    atm: parseOptionalNumber(draft.atm),
  };
}

export function emptyDraft(): BarToAtmDraft {
  return { source: 'bar', bar: '', atm: '', barFirst: true };
}

interface BarToAtmFormProps {
  draft: BarToAtmDraft;
  errors: BarToAtmFieldErrors;
  onDraftChange: (draft: BarToAtmDraft) => void;
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

export function BarToAtmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onSwap,
  children,
}: BarToAtmFormProps) {
  const set = (patch: Partial<BarToAtmDraft>) => onDraftChange({ ...draft, ...patch });

  const barField = (
    <FieldShell
      key="bar"
      label="Pressure in bar"
      htmlFor="bar-atm-bar"
      tip="Metric pressure unit: 1 bar = 100,000 Pa. Atmospheres update as bar × (100000 / 101325)."
      error={errors.bar}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="bar-atm-bar"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.bar}
            placeholder="Enter bar"
            aria-invalid={Boolean(errors.bar)}
            onChange={(event) => set({ source: 'bar', bar: event.target.value })}
          />
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          bar
        </span>
      </div>
    </FieldShell>
  );

  const atmField = (
    <FieldShell
      key="atm"
      label="Pressure in atmospheres"
      htmlFor="bar-atm-atm"
      tip="Standard atmosphere: 1 atm = 101,325 Pa = 1.01325 bar."
      error={errors.atm}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="bar-atm-atm"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.atm}
            placeholder="Enter atmospheres"
            aria-invalid={Boolean(errors.atm)}
            onChange={(event) => set({ source: 'atm', atm: event.target.value })}
          />
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          atm
        </span>
      </div>
    </FieldShell>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 bar = 100,000 Pa and 1 atm = 101,325 Pa. Edit either field — the other updates
        instantly. Absolute pressure cannot be negative.
      </div>

      {draft.barFirst ? (
        <>
          {barField}
          {atmField}
        </>
      ) : (
        <>
          {atmField}
          {barField}
        </>
      )}

      <p className="text-xs text-muted-foreground">1 bar ≈ 0.986923 atm · 1 atm = 1.01325 bar</p>

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
