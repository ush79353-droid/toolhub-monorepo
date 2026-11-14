'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  PERIOD_OPTIONS,
  type AnnualizedRateOfReturnFieldErrors,
  type AnnualizedRateOfReturnInput,
  type AnnualizedRateOfReturnResult,
  type PeriodFrequency,
} from './types';

interface AnnualizedRateOfReturnFormProps {
  input: AnnualizedRateOfReturnInput;
  errors: AnnualizedRateOfReturnFieldErrors;
  result: AnnualizedRateOfReturnResult | null;
  onChange: (input: AnnualizedRateOfReturnInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor?: string;
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

export function AnnualizedRateOfReturnForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: AnnualizedRateOfReturnFormProps) {
  const setPeriod = (period: PeriodFrequency) => onChange({ ...input, period });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          label="Period"
          tip="How often the period rate compounds within a year."
        />
        <div role="radiogroup" aria-label="Period" className="space-y-2">
          {PERIOD_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="arr-period"
                className="h-4 w-4 border-border"
                checked={input.period === option.value}
                onChange={() => setPeriod(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel
          htmlFor="arr-period-rate"
          label="Period rate"
          tip="Return for one period as a percent. Zero and negatives down to -100% are allowed."
        />
        <div className="relative">
          <input
            id="arr-period-rate"
            type="text"
            inputMode="decimal"
            className={`${inputClass} pr-8`}
            value={input.periodRate}
            aria-invalid={Boolean(errors.periodRate)}
            onChange={(e) => onChange({ ...input, periodRate: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
        {errors.periodRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.periodRate}</p>
        ) : null}
      </div>

      {errors.general ? <p className="text-xs text-rose-600">{errors.general}</p> : null}

      <div>
        <FieldLabel
          htmlFor="arr-result"
          label="Annualized rate of return"
          tip="((1 + period rate ÷ 100)^N − 1) × 100, where N is periods per year."
        />
        <div className="relative">
          <input
            id="arr-result"
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
