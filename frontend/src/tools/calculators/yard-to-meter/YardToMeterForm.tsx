'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatLength } from './calculation';
import {
  METERS_PER_YARD,
  type OtherUnitRow,
  type YardMeterSource,
  type YardToMeterFieldErrors,
  type YardToMeterInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface YardToMeterDraft {
  source: YardMeterSource;
  yards: string;
  meters: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: YardToMeterDraft): YardToMeterInput {
  return {
    source: draft.source,
    yards: parseOptionalNumber(draft.yards),
    meters: parseOptionalNumber(draft.meters),
  };
}

export function emptyDraft(): YardToMeterDraft {
  return { source: 'yards', yards: '', meters: '', moreOpen: false };
}

interface YardToMeterFormProps {
  draft: YardToMeterDraft;
  errors: YardToMeterFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: YardToMeterDraft) => void;
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

export function YardToMeterForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: YardToMeterFormProps) {
  const set = (patch: Partial<YardToMeterDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact relationship: 1 yard = {METERS_PER_YARD} meters. Edit either field — the other updates
        instantly. Expand Other length units for mm, cm, in, ft, km, and mi.
      </div>

      <FieldShell
        label="Length in yards"
        htmlFor="yd-m-conv-yards"
        tip={`Enter a length in yards. Meters = yards × ${METERS_PER_YARD}.`}
        error={errors.yards}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="yd-m-conv-yards"
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
        label="Length in meters"
        htmlFor="yd-m-conv-meters"
        tip={`Enter a length in meters. Yards = meters ÷ ${METERS_PER_YARD}.`}
        error={errors.meters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="yd-m-conv-meters"
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

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>Other length units</span>
          {draft.moreOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.moreOpen ? (
          <div className="border-t border-border px-3.5 pb-3.5 pt-2">
            {otherUnits && otherUnits.length > 0 ? (
              <ul className="divide-y divide-border">
                {otherUnits.map((row) => (
                  <li
                    key={row.unit}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium tabular-nums text-accent">
                      {formatLength(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid length to see millimeters, centimeters, inches, feet, kilometers, and
                miles.
              </p>
            )}
          </div>
        ) : null}
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
