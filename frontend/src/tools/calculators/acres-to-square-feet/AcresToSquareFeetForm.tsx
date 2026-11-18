'use client';

import type { FormEvent, ReactNode } from 'react';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  type AcresSqFtSource,
  type AcresToSquareFeetFieldErrors,
  type AcresToSquareFeetInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface AcresToSquareFeetDraft {
  source: AcresSqFtSource;
  acres: string;
  squareFeet: string;
  /** Visual order: true = acres field first. */
  acresFirst: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: AcresToSquareFeetDraft): AcresToSquareFeetInput {
  return {
    source: draft.source,
    acres: parseOptionalNumber(draft.acres),
    squareFeet: parseOptionalNumber(draft.squareFeet),
  };
}

export function emptyDraft(): AcresToSquareFeetDraft {
  return { source: 'acres', acres: '', squareFeet: '', acresFirst: true };
}

interface AcresToSquareFeetFormProps {
  draft: AcresToSquareFeetDraft;
  errors: AcresToSquareFeetFieldErrors;
  onDraftChange: (draft: AcresToSquareFeetDraft) => void;
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

export function AcresToSquareFeetForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onSwap,
  children,
}: AcresToSquareFeetFormProps) {
  const set = (patch: Partial<AcresToSquareFeetDraft>) => onDraftChange({ ...draft, ...patch });

  const acresField = (
    <FieldShell
      key="acres"
      label="Area in acres"
      htmlFor="ac-sqft-acres"
      tip="Enter an area in acres. Square feet update as acres × 43,560."
      error={errors.acres}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="ac-sqft-acres"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.acres}
            placeholder="Enter acres"
            aria-invalid={Boolean(errors.acres)}
            onChange={(event) => set({ source: 'acres', acres: event.target.value })}
          />
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          ac
        </span>
      </div>
    </FieldShell>
  );

  const squareFeetField = (
    <FieldShell
      key="squareFeet"
      label="Area in square feet"
      htmlFor="ac-sqft-square-feet"
      tip="Enter an area in square feet. Acres update as square feet ÷ 43,560."
      error={errors.squareFeet}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="ac-sqft-square-feet"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.squareFeet}
            placeholder="Enter square feet"
            aria-invalid={Boolean(errors.squareFeet)}
            onChange={(event) => set({ source: 'squareFeet', squareFeet: event.target.value })}
          />
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          ft²
        </span>
      </div>
    </FieldShell>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        1 acre = 43,560 square feet (exact international acre). Edit either field — the other
        updates instantly. Area cannot be negative.
      </div>

      {draft.acresFirst ? (
        <>
          {acresField}
          {squareFeetField}
        </>
      ) : (
        <>
          {squareFeetField}
          {acresField}
        </>
      )}

      <p className="text-xs text-muted-foreground">1 acre = 43,560 ft²</p>

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
