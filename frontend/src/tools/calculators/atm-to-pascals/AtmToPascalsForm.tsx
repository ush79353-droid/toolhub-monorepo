'use client';

import type { FormEvent, ReactNode } from 'react';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  type AtmPaSource,
  type AtmToPascalsFieldErrors,
  type AtmToPascalsInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface AtmToPascalsDraft {
  source: AtmPaSource;
  atm: string;
  pascals: string;
  /** Visual order: true = atmospheres field first. */
  atmFirst: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: AtmToPascalsDraft): AtmToPascalsInput {
  return {
    source: draft.source,
    atm: parseOptionalNumber(draft.atm),
    pascals: parseOptionalNumber(draft.pascals),
  };
}

export function emptyDraft(): AtmToPascalsDraft {
  return { source: 'atm', atm: '', pascals: '', atmFirst: true };
}

interface AtmToPascalsFormProps {
  draft: AtmToPascalsDraft;
  errors: AtmToPascalsFieldErrors;
  onDraftChange: (draft: AtmToPascalsDraft) => void;
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

export function AtmToPascalsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onSwap,
  children,
}: AtmToPascalsFormProps) {
  const set = (patch: Partial<AtmToPascalsDraft>) => onDraftChange({ ...draft, ...patch });

  const atmField = (
    <FieldShell
      key="atm"
      label="Pressure in atmospheres"
      htmlFor="atm-pa-atm"
      tip="Standard atmosphere (atm). Pascals update as atm × 101,325."
      error={errors.atm}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="atm-pa-atm"
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

  const pascalsField = (
    <FieldShell
      key="pascals"
      label="Pressure in pascals"
      htmlFor="atm-pa-pascals"
      tip="SI pressure unit (Pa). Atmospheres update as Pa ÷ 101,325."
      error={errors.pascals}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="atm-pa-pascals"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.pascals}
            placeholder="Enter pascals"
            aria-invalid={Boolean(errors.pascals)}
            onChange={(event) => set({ source: 'pascals', pascals: event.target.value })}
          />
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          Pa
        </span>
      </div>
    </FieldShell>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 atm = 101,325 Pa. Edit either field — the other updates instantly. Absolute
        pressure cannot be negative.
      </div>

      {draft.atmFirst ? (
        <>
          {atmField}
          {pascalsField}
        </>
      ) : (
        <>
          {pascalsField}
          {atmField}
        </>
      )}

      <p className="text-xs text-muted-foreground">1 atm = 101,325 Pa</p>

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
