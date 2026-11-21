'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatLength } from './calculation';
import {
  MM_PER_METER,
  type MmMSource,
  type MmToMFieldErrors,
  type MmToMInput,
  type OtherUnitRow,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MmToMDraft {
  source: MmMSource;
  mm: string;
  m: string;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: MmToMDraft): MmToMInput {
  return {
    source: draft.source,
    mm: parseOptionalNumber(draft.mm),
    m: parseOptionalNumber(draft.m),
  };
}

export function emptyDraft(): MmToMDraft {
  return { source: 'mm', mm: '', m: '', otherOpen: false };
}

interface MmToMFormProps {
  draft: MmToMDraft;
  errors: MmToMFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: MmToMDraft) => void;
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

export function MmToMForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MmToMFormProps) {
  const set = (patch: Partial<MmToMDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact: 1 m = {MM_PER_METER.toLocaleString('en-US')} mm. Enter millimeters or meters; both
        update instantly. Signed values are allowed for mathematical differences.
      </div>

      <p className="text-sm font-medium text-accent">Millimeters to meters</p>

      <FieldShell
        label="Millimeters"
        htmlFor="mm-m-mm"
        tip={`m = mm ÷ ${MM_PER_METER}.`}
        error={errors.mm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mm-m-mm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.mm}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.mm)}
              onChange={(event) => set({ source: 'mm', mm: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mm
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Meters"
        htmlFor="mm-m-m"
        tip={`mm = m × ${MM_PER_METER}.`}
        error={errors.m}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mm-m-m"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.m}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.m)}
              onChange={(event) => set({ source: 'm', m: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            m
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => set({ otherOpen: !draft.otherOpen })}
        >
          More length units
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="border-t border-border px-3.5 pb-3.5 pt-2">
            {otherUnits && otherUnits.length > 0 ? (
              <ul className="divide-y divide-border">
                {otherUnits.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium tabular-nums text-accent">
                      {formatLength(row.value)} {row.symbol}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a length to see centimeters, kilometers, inches, feet, yards, and miles.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        1 m = {MM_PER_METER.toLocaleString('en-US')} mm · m = mm ÷ {MM_PER_METER}
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
