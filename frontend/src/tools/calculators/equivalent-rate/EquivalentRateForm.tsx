'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EquivalentRateFieldErrors,
  EquivalentRateInput,
  EquivalentRateResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent focus:outline-none focus:ring-2 focus:ring-ring';

interface EquivalentRateFormProps {
  input: EquivalentRateInput;
  errors: EquivalentRateFieldErrors;
  result: EquivalentRateResult | null;
  onChange: (input: EquivalentRateInput) => void;
  onReset: () => void;
}

export function EquivalentRateForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: EquivalentRateFormProps) {
  const set = (patch: Partial<EquivalentRateInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Inputs</legend>

        <div>
          <label className={labelClass} htmlFor="aer-nominal">
            <span>Nominal interest rate</span>
          </label>
          <div className="relative">
            <input
              id="aer-nominal"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.nominalInterestRatePercent}
              aria-invalid={Boolean(errors.nominalInterestRatePercent)}
              onChange={(e) => set({ nominalInterestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {errors.nominalInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.nominalInterestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="aer-m">
            <span>Compounding frequency</span>
            <InfoTooltip
              label="Compounding frequency"
              text="Number of compounding periods per year for the stated nominal rate (m)."
            />
          </label>
          <div className="relative">
            <input
              id="aer-m"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.compoundingFrequency}
              aria-invalid={Boolean(errors.compoundingFrequency)}
              onChange={(e) => set({ compoundingFrequency: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              /yr
            </span>
          </div>
          {errors.compoundingFrequency ? (
            <p className="mt-1 text-xs text-rose-600">{errors.compoundingFrequency}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="aer-n">
            <span>New compounding frequency</span>
          </label>
          <div className="relative">
            <input
              id="aer-n"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.newCompoundingFrequency}
              aria-invalid={Boolean(errors.newCompoundingFrequency)}
              onChange={(e) => set({ newCompoundingFrequency: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              /yr
            </span>
          </div>
          {errors.newCompoundingFrequency ? (
            <p className="mt-1 text-xs text-rose-600">{errors.newCompoundingFrequency}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        <div>
          <label className={labelClass} htmlFor="aer-eq">
            <span>Equivalent interest rate</span>
            <InfoTooltip
              label="Equivalent interest rate"
              text="Nominal annual rate at the new compounding frequency that matches the same AER."
            />
          </label>
          <div className="relative">
            <input
              id="aer-eq"
              className={`${inputClass} bg-muted/10 pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedEquivalentRate : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="aer-aer">
            <span>Effective annual interest rate (AER)</span>
          </label>
          <div className="relative">
            <input
              id="aer-aer"
              className={`${inputClass} bg-muted/10 pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedAer : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
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
