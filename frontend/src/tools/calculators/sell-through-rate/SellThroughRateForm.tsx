'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SellThroughRateFieldErrors,
  SellThroughRateInput,
  SellThroughRateResult,
} from './types';

interface SellThroughRateFormProps {
  input: SellThroughRateInput;
  errors: SellThroughRateFieldErrors;
  result: SellThroughRateResult | null;
  onInputChange: (field: keyof SellThroughRateInput, value: string) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function SellThroughRateForm({
  input,
  errors,
  result,
  onInputChange,
  onReset,
}: SellThroughRateFormProps) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="sell-through-units-sold"
          label="Number of units sold"
          tip="Units sold during the period. Zero is allowed; cannot exceed units received."
        />
        <input
          id="sell-through-units-sold"
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={input.unitsSold}
          aria-invalid={Boolean(errors.unitsSold)}
          onChange={(e) => onInputChange('unitsSold', e.target.value)}
        />
        {errors.unitsSold ? (
          <p className="mt-1 text-xs text-rose-600">{errors.unitsSold}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="sell-through-units-received"
          label="Number of units received"
          tip="Units received into inventory. Must be greater than zero."
        />
        <input
          id="sell-through-units-received"
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={input.unitsReceived}
          aria-invalid={Boolean(errors.unitsReceived)}
          onChange={(e) => onInputChange('unitsReceived', e.target.value)}
        />
        {errors.unitsReceived ? (
          <p className="mt-1 text-xs text-rose-600">{errors.unitsReceived}</p>
        ) : null}
      </div>

      {errors.general ? <p className="text-xs text-rose-600">{errors.general}</p> : null}

      <div>
        <FieldLabel
          htmlFor="sell-through-result"
          label="Sell-through rate"
          tip="Calculated as (units sold ÷ units received) × 100."
        />
        <div className="relative">
          <input
            id="sell-through-result"
            type="text"
            readOnly
            className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
            value={result ? result.formattedRate : ''}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
