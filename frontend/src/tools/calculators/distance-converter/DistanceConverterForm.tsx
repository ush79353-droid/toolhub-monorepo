'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  IMPERIAL_PRIMARY,
  METRIC_PRIMARY,
  OTHER_DISTANCE_UNITS,
  UNIT_TITLE,
  unitSymbol,
  type DistanceFieldErrors,
  type DistanceSource,
} from './types';
import { parseOptionalNumber } from './validation';

export type DistanceDraft = {
  source: DistanceSource;
} & Record<DistanceSource, string>;

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const suffixClass =
  'flex h-11 shrink-0 items-center rounded-r-lg border-l border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): DistanceDraft {
  const draft = { source: 'm' as DistanceSource } as DistanceDraft;
  for (const unit of [...METRIC_PRIMARY, ...IMPERIAL_PRIMARY, ...OTHER_DISTANCE_UNITS]) {
    draft[unit] = '';
  }
  return draft;
}

export function draftToInput(draft: DistanceDraft) {
  return {
    source: draft.source,
    value: parseOptionalNumber(draft[draft.source]),
  };
}

interface DistanceConverterFormProps {
  draft: DistanceDraft;
  errors: DistanceFieldErrors;
  onDraftChange: (draft: DistanceDraft) => void;
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

function UnitField({
  unit,
  value,
  error,
  onChange,
}: {
  unit: DistanceSource;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const id = `dist-${unit}`;
  return (
    <FieldShell
      label={UNIT_TITLE[unit]}
      htmlFor={id}
      tip="Enter a non-negative distance. All other fields update from meters."
      error={error}
    >
      <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          className={inputClass}
          value={value}
          placeholder="Enter distance"
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className={suffixClass} aria-hidden="true">
          {unitSymbol(unit)}
        </span>
      </div>
    </FieldShell>
  );
}

export function DistanceConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: DistanceConverterFormProps) {
  const setUnit = (unit: DistanceSource, text: string) =>
    onDraftChange({ ...draft, source: unit, [unit]: text });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Converts metric, imperial/US, and specialized length units through meters. Distances are
        non-negative. Exact international factors (for example 1 in = 0.0254 m).
      </div>

      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <span>Metric</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </summary>
        <div className="space-y-3 border-t border-border px-4 py-3">
          {METRIC_PRIMARY.map((unit) => (
            <UnitField
              key={unit}
              unit={unit}
              value={draft[unit]}
              error={errors[unit]}
              onChange={(text) => setUnit(unit, text)}
            />
          ))}
        </div>
      </details>

      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <span>Imperial/US</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </summary>
        <div className="space-y-3 border-t border-border px-4 py-3">
          {IMPERIAL_PRIMARY.map((unit) => (
            <UnitField
              key={unit}
              unit={unit}
              value={draft[unit]}
              error={errors[unit]}
              onChange={(text) => setUnit(unit, text)}
            />
          ))}
        </div>
      </details>

      <details className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <span>Other distance units</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </summary>
        <div className="space-y-3 border-t border-border px-4 py-3">
          {OTHER_DISTANCE_UNITS.map((unit) => (
            <UnitField
              key={unit}
              unit={unit}
              value={draft[unit]}
              error={errors[unit]}
              onChange={(text) => setUnit(unit, text)}
            />
          ))}
        </div>
      </details>

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
