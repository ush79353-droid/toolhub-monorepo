'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RevenuePerEmployeeFieldErrors,
  RevenuePerEmployeeInput,
  RevenuePerEmployeeResult,
} from './types';

interface RevenuePerEmployeeFormProps {
  input: RevenuePerEmployeeInput;
  errors: RevenuePerEmployeeFieldErrors;
  result: RevenuePerEmployeeResult | null;
  onChange: (input: RevenuePerEmployeeInput) => void;
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

export function RevenuePerEmployeeForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: RevenuePerEmployeeFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<RevenuePerEmployeeInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="rpe-revenue"
          label="Revenue"
          tip="Total revenue for the period. Currency labels amounts only; it does not convert."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="rpe-revenue"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.revenue}
              aria-invalid={Boolean(errors.revenue)}
              onChange={(event) => set({ revenue: event.target.value })}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="rpe-revenue-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
            />
          </div>
        </div>
        {errors.revenue ? <p className="mt-1 text-xs text-rose-600">{errors.revenue}</p> : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="rpe-employees"
          label="Number of employee"
          tip="Whole number of employees. Must be greater than zero."
        />
        <input
          id="rpe-employees"
          className={inputClass}
          inputMode="numeric"
          value={input.employeeCount}
          aria-invalid={Boolean(errors.employeeCount)}
          onChange={(event) => set({ employeeCount: event.target.value })}
        />
        {errors.employeeCount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.employeeCount}</p>
        ) : null}
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div>
        <FieldLabel
          htmlFor="rpe-result"
          label="Revenue per employee"
          tip="Total revenue ÷ number of employees."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="rpe-result"
              className={`${inputClass} bg-muted/10 pl-8 font-semibold text-accent`}
              readOnly
              value={result ? result.formattedRevenuePerEmployee : ''}
              aria-live="polite"
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="rpe-result-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="Revenue per employee currency"
            />
          </div>
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
