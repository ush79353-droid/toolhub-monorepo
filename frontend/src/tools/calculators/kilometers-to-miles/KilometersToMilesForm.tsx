'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  KM_PER_MILE,
  type KmMiSource,
  type KilometersToMilesFieldErrors,
  type KilometersToMilesInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface KilometersToMilesDraft {
  source: KmMiSource;
  km: string;
  mi: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: KilometersToMilesDraft): KilometersToMilesInput {
  return {
    source: draft.source,
    km: parseOptionalNumber(draft.km),
    mi: parseOptionalNumber(draft.mi),
  };
}

export function emptyDraft(): KilometersToMilesDraft {
  return { source: 'km', km: '', mi: '' };
}

interface KilometersToMilesFormProps {
  draft: KilometersToMilesDraft;
  errors: KilometersToMilesFieldErrors;
  onDraftChange: (draft: KilometersToMilesDraft) => void;
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

export function KilometersToMilesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KilometersToMilesFormProps) {
  const set = (patch: Partial<KilometersToMilesDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact: 1 international mile = {KM_PER_MILE} km. Edit either field: the other updates
        instantly. Distances cannot be negative.
      </div>

      <FieldShell
        label="Distance in kilometers"
        htmlFor="km-mi-km"
        tip={`Enter a nonnegative distance in kilometers. 1 km ≈ ${1 / KM_PER_MILE} mi.`}
        error={errors.km}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="km-mi-km"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.km}
              placeholder="Enter distance"
              aria-invalid={Boolean(errors.km)}
              onChange={(event) => set({ source: 'km', km: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            km
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Distance in miles"
        htmlFor="km-mi-mi"
        tip={`Enter a nonnegative distance in international miles. 1 mi = ${KM_PER_MILE} km.`}
        error={errors.mi}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="km-mi-mi"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.mi}
              placeholder="Enter distance"
              aria-invalid={Boolean(errors.mi)}
              onChange={(event) => set({ source: 'mi', mi: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mi
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        mi = km ÷ {KM_PER_MILE} · km = mi × {KM_PER_MILE}
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
