'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { MeterMileSource, MeterToMileFieldErrors, MeterToMileInput } from './types';
import { parseOptionalNumber } from './validation';

export interface MeterToMileDraft {
  source: MeterMileSource;
  meters: string;
  miles: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function draftToInput(draft: MeterToMileDraft): MeterToMileInput {
  return {
    source: draft.source,
    meters: parseOptionalNumber(draft.meters),
    miles: parseOptionalNumber(draft.miles),
  };
}

export function emptyDraft(): MeterToMileDraft {
  return { source: 'meters', meters: '', miles: '' };
}

interface MeterToMileFormProps {
  draft: MeterToMileDraft;
  errors: MeterToMileFieldErrors;
  onDraftChange: (draft: MeterToMileDraft) => void;
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

export function MeterToMileForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MeterToMileFormProps) {
  const set = (patch: Partial<MeterToMileDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact international statute mile: 1 mi = 1609.344 m. Edit either field — the other updates
        instantly. Distance cannot be negative. Not a nautical mile (1852 m).
      </div>

      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Metric</p>
        <FieldShell
          label="Length in meters"
          htmlFor="m-mi-meters"
          tip="Enter a distance in meters. Miles = meters ÷ 1609.344."
          error={errors.meters}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="m-mi-meters"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.meters}
                placeholder="Enter meters"
                aria-invalid={Boolean(errors.meters)}
                onChange={(event) => set({ source: 'meters', meters: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              m
            </span>
          </div>
        </FieldShell>
      </div>

      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Imperial / US</p>
        <FieldShell
          label="Length in miles"
          htmlFor="m-mi-miles"
          tip="Enter a distance in international statute miles. Meters = miles × 1609.344."
          error={errors.miles}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="m-mi-miles"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.miles}
                placeholder="Enter miles"
                aria-invalid={Boolean(errors.miles)}
                onChange={(event) => set({ source: 'miles', miles: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              mi
            </span>
          </div>
        </FieldShell>
      </div>

      <p className="text-xs text-muted-foreground">1 mi = 1609.344 m · 1 mi = 1.609344 km</p>

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
