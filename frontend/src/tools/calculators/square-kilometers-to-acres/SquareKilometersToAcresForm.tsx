'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatArea } from './calculation';
import {
  type Km2AcresSource,
  type OtherUnitRow,
  type SquareKilometersToAcresFieldErrors,
  type SquareKilometersToAcresInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface SquareKilometersToAcresDraft {
  source: Km2AcresSource;
  squareKilometers: string;
  acres: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(
  input: SquareKilometersToAcresInput,
  moreOpen = false
): SquareKilometersToAcresDraft {
  return {
    source: input.source,
    squareKilometers:
      input.squareKilometers === null ? '' : formatArea(input.squareKilometers),
    acres: input.acres === null ? '' : formatArea(input.acres),
    moreOpen,
  };
}

export function draftToInput(
  draft: SquareKilometersToAcresDraft
): SquareKilometersToAcresInput {
  return {
    source: draft.source,
    squareKilometers: parseOptionalNumber(draft.squareKilometers),
    acres: parseOptionalNumber(draft.acres),
  };
}

interface SquareKilometersToAcresFormProps {
  draft: SquareKilometersToAcresDraft;
  errors: SquareKilometersToAcresFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: SquareKilometersToAcresDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
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

export function SquareKilometersToAcresForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: SquareKilometersToAcresFormProps) {
  const set = (patch: Partial<SquareKilometersToAcresDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Square kilometers"
        htmlFor="km2-ac-km2"
        tip="Enter an area in square kilometers. Acres update from the exact international acre (4,046.8564224 m²)."
        error={errors.squareKilometers}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="km2-ac-km2"
              inputMode="decimal"
              className={inputClass}
              value={draft.squareKilometers}
              placeholder="Enter area"
              aria-invalid={Boolean(errors.squareKilometers)}
              onChange={(event) =>
                set({ source: 'squareKilometers', squareKilometers: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            km²
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Acres"
        htmlFor="km2-ac-acres"
        tip="Enter an area in international acres. Square kilometers update from acres × 0.0040468564224."
        error={errors.acres}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="km2-ac-acres"
              inputMode="decimal"
              className={inputClass}
              value={draft.acres}
              placeholder="Enter area"
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
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>More conversion options</span>
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
                    <span className="tabular-nums font-medium text-accent">
                      {formatArea(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid area to see square meters, square feet, square yards, hectares,
                ares, and square miles.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
