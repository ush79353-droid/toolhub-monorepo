'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { DISCLAIMER } from './calculation';
import type {
  PrescriptionRefillFieldErrors,
  PrescriptionRefillInput,
  PrescriptionRefillResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: PrescriptionRefillInput;
  errors: PrescriptionRefillFieldErrors;
  result: PrescriptionRefillResult | null;
  onChange: (input: PrescriptionRefillInput) => void;
  onLoadExample: () => void;
}

export function PrescriptionRefillForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PrescriptionRefillInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational fixed-schedule date math only. PRN / as-needed prescriptions
        are excluded. Entries stay in your browser — not medical or dispensing
        advice.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (15 Jan 2026 · 30 units · 1/day → next 14 Feb)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="prf-fill">
          <span>Fill / start date</span>
          <InfoTooltip
            label="Fill / start date"
            text="Calendar day the dispensed supply begins (usually the fill or pickup date)."
          />
        </label>
        <FieldShell error={errors.fillDate}>
          <input
            id="prf-fill"
            type="date"
            className={inputClass}
            value={input.fillDate}
            aria-invalid={Boolean(errors.fillDate)}
            onChange={(e) => set({ fillDate: e.target.value })}
          />
        </FieldShell>
        {!input.fillDate ? (
          <p className="mt-1 text-xs text-muted-foreground">MM/DD/YYYY</p>
        ) : null}
        {errors.fillDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.fillDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="prf-qty">
          <span>Quantity dispensed</span>
          <InfoTooltip
            label="Quantity dispensed"
            text="Count of units on the label (tablets, capsules, doses, mL, etc.). Unit type cancels out when divided by units per day."
          />
        </label>
        <FieldShell error={errors.quantityText}>
          <input
            id="prf-qty"
            type="text"
            inputMode="decimal"
            className={inputClass}
            placeholder="e.g. 30"
            value={input.quantityText}
            aria-invalid={Boolean(errors.quantityText)}
            onChange={(e) => set({ quantityText: e.target.value })}
          />
        </FieldShell>
        {errors.quantityText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.quantityText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="prf-upd">
          <span>Units per day</span>
          <InfoTooltip
            label="Units per day"
            text="Fixed prescribed daily amount (e.g. 1 tablet once daily, or 2 if twice daily). Not for PRN / as-needed use."
          />
        </label>
        <FieldShell error={errors.unitsPerDayText}>
          <input
            id="prf-upd"
            type="text"
            inputMode="decimal"
            className={inputClass}
            placeholder="e.g. 1"
            value={input.unitsPerDayText}
            aria-invalid={Boolean(errors.unitsPerDayText)}
            onChange={(e) => set({ unitsPerDayText: e.target.value })}
          />
        </FieldShell>
        {errors.unitsPerDayText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.unitsPerDayText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="prf-days">
          <span>Days supplied</span>
          <InfoTooltip
            label="Days supplied"
            text="Quantity ÷ units per day. Must be a whole number of calendar days for this worksheet."
          />
        </label>
        <FieldShell muted>
          <output
            id="prf-days"
            className="flex w-full items-center gap-2 px-3 text-sm tabular-nums text-accent"
            aria-live="polite"
          >
            <span className="font-medium">
              {result ? result.daysSupplied : ''}
            </span>
            <span className="ml-auto text-sm font-medium text-primary">days</span>
          </output>
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="prf-last">
          <span>Last covered day</span>
          <InfoTooltip
            label="Last covered day"
            text="Fill date + days supplied − 1 — the final calendar day the fixed schedule is expected to cover."
          />
        </label>
        <FieldShell muted>
          <output
            id="prf-last"
            className="flex w-full items-center px-3 text-sm tabular-nums text-accent"
            aria-live="polite"
          >
            <span className="font-medium">
              {result ? result.formattedLastCovered : ''}
            </span>
          </output>
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="prf-next">
          <span>Next supply date</span>
          <InfoTooltip
            label="Next supply date"
            text="Fill date + days supplied — the day after the last covered day on this educational schedule."
          />
        </label>
        <FieldShell muted>
          <output
            id="prf-next"
            className="flex w-full items-center px-3 text-sm tabular-nums text-accent"
            aria-live="polite"
          >
            <span className="font-medium">
              {result ? result.formattedNextSupply : ''}
            </span>
          </output>
        </FieldShell>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ?? DISCLAIMER}
        </p>
      </div>
    </form>
  );
}
