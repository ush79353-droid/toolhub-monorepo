'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RealRateOfReturnFieldErrors,
  RealRateOfReturnInput,
  RealRateOfReturnResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface RealRateOfReturnFormProps {
  input: RealRateOfReturnInput;
  errors: RealRateOfReturnFieldErrors;
  result: RealRateOfReturnResult | null;
  onChange: (input: RealRateOfReturnInput) => void;
  onReset: () => void;
}

export function RealRateOfReturnForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: RealRateOfReturnFormProps) {
  const set = (patch: Partial<RealRateOfReturnInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Real Rate of Return
        </legend>

        <div>
          <label className={labelClass} htmlFor="rrr-nominal">
            <span>Nominal rate of return</span>
            <InfoTooltip
              label="Nominal rate of return"
              text="Stated return before adjusting for inflation. May be negative; must be at least −100%."
            />
          </label>
          <FieldShell error={errors.nominalRatePercent}>
            <input
              id="rrr-nominal"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.nominalRatePercent}
              aria-invalid={Boolean(errors.nominalRatePercent)}
              onChange={(e) => set({ nominalRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.nominalRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.nominalRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rrr-inflation">
            <span>Inflation rate</span>
            <InfoTooltip
              label="Inflation rate"
              text="Change in price level over the same period. Negative values mean deflation. Must be greater than −100%."
            />
          </label>
          <FieldShell error={errors.inflationRatePercent}>
            <input
              id="rrr-inflation"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.inflationRatePercent}
              aria-invalid={Boolean(errors.inflationRatePercent)}
              onChange={(e) => set({ inflationRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.inflationRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.inflationRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rrr-real">
            <span>Real rate of return</span>
            <InfoTooltip
              label="Real rate of return"
              text="Fisher equation: ((1 + nominal/100) / (1 + inflation/100) − 1) × 100."
            />
          </label>
          <FieldShell muted>
            <input
              id="rrr-real"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedRealRate : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
