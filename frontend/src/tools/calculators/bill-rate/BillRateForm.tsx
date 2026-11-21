'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BillRateFieldErrors,
  BillRateInput,
  BillRateResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const unitClass =
  'shrink-0 pr-3 text-xs font-medium text-muted-foreground whitespace-nowrap';

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

interface BillRateFormProps {
  input: BillRateInput;
  errors: BillRateFieldErrors;
  result: BillRateResult | null;
  onChange: (input: BillRateInput) => void;
  onAnnualSalaryCurrencyChange: (next: SupportedCurrency) => void;
  onBillRateCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function BillRateForm({
  input,
  errors,
  result,
  onChange,
  onAnnualSalaryCurrencyChange,
  onBillRateCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: BillRateFormProps) {
  const salarySymbol = getCurrencySymbol(input.annualSalaryCurrency);
  const billSymbol = getCurrencySymbol(input.billRateCurrency);

  const set = (patch: Partial<BillRateInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="br-annual-salary">
            <span>Annual salary</span>
            <InfoTooltip
              label="Annual salary"
              text="Employee or contractor annual salary cost. Changing currency converts this amount with stored FX rates. Distinct from the client bill rate."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.annualSalary}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {salarySymbol}
              </span>
              <input
                id="br-annual-salary"
                className={inputClass}
                inputMode="decimal"
                value={input.annualSalary}
                aria-invalid={Boolean(errors.annualSalary)}
                onChange={(e) => set({ annualSalary: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="br-annual-salary-currency"
                value={input.annualSalaryCurrency}
                onChange={onAnnualSalaryCurrencyChange}
                aria-label="Annual salary currency"
              />
            </div>
          </div>
          {errors.annualSalary ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualSalary}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="br-capacity">
            <span>Capacity</span>
            <InfoTooltip
              label="Capacity"
              text="Annual billable hours under your assumption. Default 2,080 equals 40 hours/week × 52 weeks. Never FX-converted. Must be greater than zero."
            />
          </label>
          <FieldShell error={errors.capacity}>
            <input
              id="br-capacity"
              className={inputClass}
              inputMode="decimal"
              value={input.capacity}
              aria-invalid={Boolean(errors.capacity)}
              onChange={(e) => set({ capacity: e.target.value })}
            />
            <span className={unitClass}>hrs / yr</span>
          </FieldShell>
          {errors.capacity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.capacity}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="br-multiplier">
            <span>Multiplier</span>
            <InfoTooltip
              label="Multiplier"
              text="User-defined pricing uplift for overhead, indirect costs, and margin. Default 4 is a common consulting rule of thumb — not a tax rate. Never FX-converted."
            />
          </label>
          <FieldShell error={errors.multiplier}>
            <input
              id="br-multiplier"
              className={inputClass}
              inputMode="decimal"
              value={input.multiplier}
              aria-invalid={Boolean(errors.multiplier)}
              onChange={(e) => set({ multiplier: e.target.value })}
            />
          </FieldShell>
          {errors.multiplier ? (
            <p className="mt-1 text-xs text-rose-600">{errors.multiplier}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="br-bill-rate">
            <span>Bill rate</span>
            <InfoTooltip
              label="Bill rate"
              text="Client-facing hourly charge: (annual salary × multiplier) ÷ capacity, shown in the currency you select."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {billSymbol}
              </span>
              <input
                id="br-bill-rate"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedBillRate ?? ''}
                aria-live="polite"
              />
              <span className={unitClass}>/ hr</span>
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="br-bill-rate-currency"
                value={input.billRateCurrency}
                onChange={onBillRateCurrencyChange}
                aria-label="Bill rate currency"
              />
            </div>
          </div>
        </div>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {ratesWarning}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
