'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { FeetMilesSource, FeetToMilesFieldErrors, FeetToMilesInput } from './types';
import { parseOptionalNumber } from './validation';

export interface FeetToMilesDraft {
  source: FeetMilesSource;
  feet: string;
  miles: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: FeetToMilesDraft): FeetToMilesInput {
  return {
    source: draft.source,
    feet: parseOptionalNumber(draft.feet),
    miles: parseOptionalNumber(draft.miles),
  };
}

export function emptyDraft(): FeetToMilesDraft {
  return { source: 'feet', feet: '', miles: '' };
}

interface FeetToMilesFormProps {
  draft: FeetToMilesDraft;
  errors: FeetToMilesFieldErrors;
  onDraftChange: (draft: FeetToMilesDraft) => void;
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

export function FeetToMilesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: FeetToMilesFormProps) {
  const set = (patch: Partial<FeetToMilesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact international mile: 1 mi = 5,280 ft. Edit either field: the other updates instantly.
        Signed values are supported for mathematical differences.
      </div>

      <FieldShell
        label="Distance in feet"
        htmlFor="ft-mi-feet"
        tip="Enter a distance in feet. Miles = feet ÷ 5,280."
        error={errors.feet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ft-mi-feet"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.feet}
              placeholder="Enter feet"
              aria-invalid={Boolean(errors.feet)}
              onChange={(event) => set({ source: 'feet', feet: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Distance in miles"
        htmlFor="ft-mi-miles"
        tip="Enter a distance in miles. Feet = miles × 5,280."
        error={errors.miles}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ft-mi-miles"
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

      <p className="text-xs text-muted-foreground">1 mi = 5,280 ft · Miles = Feet ÷ 5,280</p>

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
