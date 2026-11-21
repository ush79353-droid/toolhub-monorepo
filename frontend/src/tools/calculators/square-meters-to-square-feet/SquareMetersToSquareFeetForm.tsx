'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_OTHER_UNIT,
  OTHER_AREA_OPTIONS,
  OTHER_UNIT_SYMBOL,
  type M2Ft2Source,
  type OtherAreaUnit,
  type SquareMetersToSquareFeetFieldErrors,
  type SquareMetersToSquareFeetInput,
} from './types';
import { isOtherAreaUnit, parseOptionalNumber } from './validation';

export interface SquareMetersToSquareFeetDraft {
  source: M2Ft2Source;
  squareMeters: string;
  squareFeet: string;
  other: string;
  otherUnit: OtherAreaUnit;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const unitSelectClass =
  'h-11 min-w-[5.5rem] shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[6.5rem]';

export function emptyDraft(): SquareMetersToSquareFeetDraft {
  return {
    source: 'squareMeters',
    squareMeters: '',
    squareFeet: '',
    other: '',
    otherUnit: DEFAULT_OTHER_UNIT,
    otherOpen: false,
  };
}

export function draftToInput(
  draft: SquareMetersToSquareFeetDraft,
): SquareMetersToSquareFeetInput {
  if (draft.source === 'squareMeters') {
    return {
      source: 'squareMeters',
      value: parseOptionalNumber(draft.squareMeters),
      otherUnit: draft.otherUnit,
    };
  }
  if (draft.source === 'squareFeet') {
    return {
      source: 'squareFeet',
      value: parseOptionalNumber(draft.squareFeet),
      otherUnit: draft.otherUnit,
    };
  }
  return {
    source: 'other',
    value: parseOptionalNumber(draft.other),
    otherUnit: draft.otherUnit,
  };
}

interface SquareMetersToSquareFeetFormProps {
  draft: SquareMetersToSquareFeetDraft;
  errors: SquareMetersToSquareFeetFieldErrors;
  onDraftChange: (draft: SquareMetersToSquareFeetDraft) => void;
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

export function SquareMetersToSquareFeetForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SquareMetersToSquareFeetFormProps) {
  const set = (patch: Partial<SquareMetersToSquareFeetDraft>) =>
    onDraftChange({ ...draft, ...patch });
  const otherSymbol = OTHER_UNIT_SYMBOL[draft.otherUnit];

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact international foot: 1 ft² = 0.09290304 m², so 1 m² ≈ 10.7639104167 ft². Enter either
 field: the other updates instantly. Expand Other Conversion Options for more units. Area
        cannot be negative.
      </div>

      <FieldShell
        label="Square meters"
        htmlFor="m2-ft2-m2"
        tip="ft² = m² ÷ 0.09290304 ≈ m² × 10.7639104167."
        error={errors.squareMeters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="m2-ft2-m2"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.squareMeters}
              placeholder="Enter area"
              aria-invalid={Boolean(errors.squareMeters)}
              onChange={(event) =>
                set({ source: 'squareMeters', squareMeters: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            m²
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Square feet"
        htmlFor="m2-ft2-ft2"
        tip="m² = ft² × 0.09290304."
        error={errors.squareFeet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="m2-ft2-ft2"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.squareFeet}
              placeholder="Converted area"
              aria-invalid={Boolean(errors.squareFeet)}
              onChange={(event) =>
                set({ source: 'squareFeet', squareFeet: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft²
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => set({ otherOpen: !draft.otherOpen })}
        >
          <span>Other Conversion Options</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            <FieldShell
              label="Equivalence in other area units"
              htmlFor="m2-ft2-other"
              tip={`Same area in ${otherSymbol}. Changing the unit keeps the square-meters value and recalculates.`}
              error={errors.other ?? errors.otherUnit}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="m2-ft2-other"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.other}
                    placeholder="Equivalent area"
                    aria-invalid={Boolean(errors.other)}
                    onChange={(event) =>
                      set({ source: 'other', other: event.target.value })
                    }
                  />
                </div>
                <select
                  aria-label="Other area unit"
                  className={unitSelectClass}
                  value={draft.otherUnit}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (!isOtherAreaUnit(next)) return;
                    set({ otherUnit: next });
                  }}
                >
                  {OTHER_AREA_OPTIONS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </FieldShell>
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
