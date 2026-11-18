'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_OTHER_UNIT,
  OTHER_AREA_OPTIONS,
  OTHER_UNIT_SYMBOL,
  type OtherAreaUnit,
  type SqFtAcresSource,
  type SquareFeetToAcresFieldErrors,
  type SquareFeetToAcresInput,
} from './types';
import { isOtherAreaUnit, parseOptionalNumber } from './validation';

export interface SquareFeetToAcresDraft {
  source: SqFtAcresSource;
  squareFeet: string;
  acres: string;
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

export function emptyDraft(): SquareFeetToAcresDraft {
  return {
    source: 'squareFeet',
    squareFeet: '',
    acres: '',
    other: '',
    otherUnit: DEFAULT_OTHER_UNIT,
    otherOpen: false,
  };
}

export function draftToInput(draft: SquareFeetToAcresDraft): SquareFeetToAcresInput {
  if (draft.source === 'squareFeet') {
    return {
      source: 'squareFeet',
      value: parseOptionalNumber(draft.squareFeet),
      otherUnit: draft.otherUnit,
    };
  }
  if (draft.source === 'acres') {
    return {
      source: 'acres',
      value: parseOptionalNumber(draft.acres),
      otherUnit: draft.otherUnit,
    };
  }
  return {
    source: 'other',
    value: parseOptionalNumber(draft.other),
    otherUnit: draft.otherUnit,
  };
}

interface SquareFeetToAcresFormProps {
  draft: SquareFeetToAcresDraft;
  errors: SquareFeetToAcresFieldErrors;
  onDraftChange: (draft: SquareFeetToAcresDraft) => void;
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

export function SquareFeetToAcresForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SquareFeetToAcresFormProps) {
  const set = (patch: Partial<SquareFeetToAcresDraft>) => onDraftChange({ ...draft, ...patch });
  const otherSymbol = OTHER_UNIT_SYMBOL[draft.otherUnit];

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 acre = 43,560 ft². Enter square feet or acres — the other updates instantly. Expand
        Other area units for m², yd², ha, and more. Area cannot be negative.
      </div>

      <FieldShell
        label="Square feet"
        htmlFor="sqft-ac-ft2"
        tip="Acres = square feet ÷ 43,560."
        error={errors.squareFeet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="sqft-ac-ft2"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.squareFeet}
              placeholder="Enter area"
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

      <FieldShell
        label="Acres"
        htmlFor="sqft-ac-acres"
        tip="Square feet = acres × 43,560."
        error={errors.acres}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="sqft-ac-acres"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.acres}
              placeholder="Converted area"
              aria-invalid={Boolean(errors.acres)}
              onChange={(event) => set({ source: 'acres', acres: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ac
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
          <span>Other area units</span>
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
              htmlFor="sqft-ac-other"
              tip={`Same land area in ${otherSymbol}. Changing the unit keeps the square-feet value and recalculates.`}
              error={errors.other ?? errors.otherUnit}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="sqft-ac-other"
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
