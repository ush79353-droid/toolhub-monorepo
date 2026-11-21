'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { METERS_PER_YARD, type YardsMetersSource, type YardsToMetersFieldErrors, type YardsToMetersInput } from './types';
import { parseOptionalNumber } from './validation';

export interface YardsToMetersDraft {
  source: YardsMetersSource;
  yards: string;
  meters: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: YardsToMetersDraft): YardsToMetersInput {
  return {
    source: draft.source,
    yards: parseOptionalNumber(draft.yards),
    meters: parseOptionalNumber(draft.meters),
  };
}

export function emptyDraft(): YardsToMetersDraft {
  return { source: 'yards', yards: '', meters: '' };
}

interface YardsToMetersFormProps {
  draft: YardsToMetersDraft;
  errors: YardsToMetersFieldErrors;
  onDraftChange: (draft: YardsToMetersDraft) => void;
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

export function YardsToMetersForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: YardsToMetersFormProps) {
  const set = (patch: Partial<YardsToMetersDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact relationship: 1 yard = {METERS_PER_YARD} meters. Edit either field: the other updates
        instantly. Negative lengths are not accepted.
      </div>

      <FieldShell
        label="Yards (imperial)"
        htmlFor="yd-m-yards"
        tip={`Enter a length in yards. Meters = yards × ${METERS_PER_YARD}.`}
        error={errors.yards}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="yd-m-yards"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.yards}
              placeholder="Enter yards"
              aria-invalid={Boolean(errors.yards)}
              onChange={(event) => set({ source: 'yards', yards: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            yd
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Meters (metric)"
        htmlFor="yd-m-meters"
        tip={`Enter a length in meters. Yards = meters ÷ ${METERS_PER_YARD}.`}
        error={errors.meters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="yd-m-meters"
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

      <p className="text-xs text-muted-foreground">
        1 yd = {METERS_PER_YARD} m · Meters = Yards × {METERS_PER_YARD}
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
