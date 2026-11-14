'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatDecimal } from './calculation';
import {
  DEFAULT_PRECISION,
  PRECISION_OPTIONS,
  type FractionPrecision,
  type InchesToFractionFieldErrors,
  type OtherUnitRow,
} from './types';

export interface InchesToFractionDraft {
  distance: string;
  precision: FractionPrecision;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function defaultDraft(distance = '1.375'): InchesToFractionDraft {
  return {
    distance,
    precision: DEFAULT_PRECISION,
    otherOpen: false,
  };
}

interface InchesToFractionFormProps {
  draft: InchesToFractionDraft;
  errors: InchesToFractionFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: InchesToFractionDraft) => void;
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

export function InchesToFractionForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: InchesToFractionFormProps) {
  const set = (patch: Partial<InchesToFractionDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <p className="text-sm text-muted-foreground">
        Enter distance (decimal or fraction)
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <FieldShell
          label="Distance"
          htmlFor="inches-frac-distance"
          tip="Enter decimal inches (1.375), a fraction (3/8), or a mixed number (1 3/8)."
          error={errors.inches}
        >
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="inches-frac-distance"
              inputMode="decimal"
              className={inputClass}
              value={draft.distance}
              placeholder="e.g. 1.375 or 1 3/8"
              aria-invalid={Boolean(errors.inches)}
              onChange={(event) => set({ distance: event.target.value })}
            />
          </div>
        </FieldShell>

        <FieldShell
          label="Precision"
          htmlFor="inches-frac-precision"
          tip="Smallest fractional increment used to display the measurement. Coarser steps may round."
        >
          <select
            id="inches-frac-precision"
            className={selectClass}
            value={draft.precision}
            onChange={(event) =>
              set({ precision: Number(event.target.value) as FractionPrecision })
            }
          >
            {PRECISION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => set({ otherOpen: !draft.otherOpen })}
        >
          <span>Convert to other units</span>
          {draft.otherOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.otherOpen ? (
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
                      {formatDecimal(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid measurement to see other units.
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
