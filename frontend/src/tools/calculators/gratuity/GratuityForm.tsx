'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  GratuityFieldErrors,
  GratuityInput,
  GratuityResult,
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

interface GratuityFormProps {
  input: GratuityInput;
  errors: GratuityFieldErrors;
  result: GratuityResult | null;
  onChange: (input: GratuityInput) => void;
  onSalaryCurrencyChange: (next: SupportedCurrency) => void;
  onGratuityCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function GratuityForm({
  input,
  errors,
  result,
  onChange,
  onSalaryCurrencyChange,
  onGratuityCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: GratuityFormProps) {
  const salarySymbol = getCurrencySymbol(input.salaryCurrency);
  const gratuitySymbol = getCurrencySymbol(input.gratuityCurrency);

  const set = (patch: Partial<GratuityInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="gratuity-salary">
          <span>Final month&apos;s salary + D.A.</span>
          <InfoTooltip
            label="Final month's salary + D.A."
            text="Last drawn basic pay plus dearness allowance for the Indian Act 15/26 estimate. Changing currency converts this amount with stored FX rates."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.salary}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {salarySymbol}
            </span>
            <input
              id="gratuity-salary"
              className={inputClass}
              inputMode="decimal"
              value={input.salary}
              aria-invalid={Boolean(errors.salary)}
              onChange={(e) => set({ salary: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="gratuity-salary-currency"
              value={input.salaryCurrency}
              onChange={onSalaryCurrencyChange}
              aria-label="Salary currency"
            />
          </div>
        </div>
        {errors.salary ? (
          <p className="mt-1 text-xs text-rose-600">{errors.salary}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="gratuity-years">
          <span>How long did you work?</span>
          <InfoTooltip
            label="How long did you work?"
            text="Enter whole years and months. Leftover months over six count as one more eligible year for the 15/26 formula. Ordinary payout needs at least 5 years (60 months). Never FX-converted."
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <FieldShell error={errors.years ?? errors.service}>
            <input
              id="gratuity-years"
              className={inputClass}
              inputMode="numeric"
              value={input.years}
              aria-invalid={Boolean(errors.years)}
              onChange={(e) => set({ years: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              yrs
            </span>
          </FieldShell>
          <FieldShell error={errors.months ?? errors.service}>
            <input
              id="gratuity-months"
              className={inputClass}
              inputMode="numeric"
              value={input.months}
              aria-invalid={Boolean(errors.months)}
              onChange={(e) => set({ months: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              mos
            </span>
          </FieldShell>
        </div>
        {errors.years ? (
          <p className="mt-1 text-xs text-rose-600">{errors.years}</p>
        ) : null}
        {errors.months ? (
          <p className="mt-1 text-xs text-rose-600">{errors.months}</p>
        ) : null}
        {errors.service ? (
          <p className="mt-1 text-xs text-rose-600">{errors.service}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="gratuity-total">
          <span>Total gratuity</span>
          <InfoTooltip
            label="Total gratuity"
            text="Formula estimate: (Salary + D.A.) × 15 / 26 × eligible years. Indian Act-style convention; not a Pakistan or global statutory guarantee. Change currency to display in another denomination."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {gratuitySymbol}
            </span>
            <input
              id="gratuity-total"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedGratuity ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="gratuity-result-currency"
              value={input.gratuityCurrency}
              onChange={onGratuityCurrencyChange}
              aria-label="Gratuity currency"
            />
          </div>
        </div>
        {result && !result.qualifies ? (
          <p className="mt-1 text-xs text-muted-foreground">
 Service under 5 years (60 months); ordinary entitlement estimate is
            0. Death/disablement exceptions are not modeled.
          </p>
        ) : null}
      </div>

      {ratesWarning ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
      {conversionError ? (
        <p className="text-xs text-rose-600">{conversionError}</p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Indian Payment of Gratuity Act, 1972 style 15/26 estimate for educational
        use. Not a Pakistan or multi-jurisdiction statutory calculator. Covered
        Indian employers may also face an Act monetary ceiling that this tool
        does not auto-apply across currencies.
      </p>
    </form>
  );
}
