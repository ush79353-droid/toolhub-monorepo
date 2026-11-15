'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  OptimalHedgeRatioFieldErrors,
  OptimalHedgeRatioInput,
  OptimalHedgeRatioResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent focus:outline-none focus:ring-2 focus:ring-ring';

interface OptimalHedgeRatioFormProps {
  input: OptimalHedgeRatioInput;
  errors: OptimalHedgeRatioFieldErrors;
  result: OptimalHedgeRatioResult | null;
  onChange: (input: OptimalHedgeRatioInput) => void;
  onReset: () => void;
}

export function OptimalHedgeRatioForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: OptimalHedgeRatioFormProps) {
  const set = (patch: Partial<OptimalHedgeRatioInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Optimal Hedge Ratio Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="ohr-spot">
            <span>Standard deviation of changes in spot price</span>
            <InfoTooltip
              label="Spot standard deviation"
              text="Volatility of spot price changes (σs). Must be non-negative and use the same units as the futures standard deviation."
            />
          </label>
          <input
            id="ohr-spot"
            className={inputClass}
            inputMode="decimal"
            value={input.spotStdDev}
            aria-invalid={Boolean(errors.spotStdDev)}
            onChange={(e) => set({ spotStdDev: e.target.value })}
          />
          {errors.spotStdDev ? (
            <p className="mt-1 text-xs text-rose-600">{errors.spotStdDev}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ohr-futures">
            <span>Standard deviation of changes in future price</span>
            <InfoTooltip
              label="Futures standard deviation"
              text="Volatility of futures price changes (σf). Must be greater than zero."
            />
          </label>
          <input
            id="ohr-futures"
            className={inputClass}
            inputMode="decimal"
            value={input.futuresStdDev}
            aria-invalid={Boolean(errors.futuresStdDev)}
            onChange={(e) => set({ futuresStdDev: e.target.value })}
          />
          {errors.futuresStdDev ? (
            <p className="mt-1 text-xs text-rose-600">{errors.futuresStdDev}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ohr-corr">
            <span>Correlation coefficient</span>
            <InfoTooltip
              label="Correlation coefficient"
              text="Correlation ρ between spot and futures price changes. Must be between −1 and +1."
            />
          </label>
          <input
            id="ohr-corr"
            className={inputClass}
            inputMode="decimal"
            value={input.correlation}
            aria-invalid={Boolean(errors.correlation)}
            onChange={(e) => set({ correlation: e.target.value })}
          />
          {errors.correlation ? (
            <p className="mt-1 text-xs text-rose-600">{errors.correlation}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ohr-result">
            <span>Optimal hedge ratio</span>
            <InfoTooltip
              label="Optimal hedge ratio"
              text="h* = ρ × (σs / σf). Not clamped to 0–1; negative values reverse the hedge."
            />
          </label>
          <input
            id="ohr-result"
            className={`${inputClass} bg-muted/10 font-semibold`}
            readOnly
            value={result ? result.formattedHedgeRatio : ''}
            aria-live="polite"
          />
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
