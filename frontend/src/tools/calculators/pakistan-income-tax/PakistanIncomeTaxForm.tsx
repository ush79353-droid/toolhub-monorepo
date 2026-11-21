'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PakistanIncomeTaxFieldErrors,
  PakistanIncomeTaxInput,
  PakistanIncomeTaxResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

const RESULT_ROWS: ReadonlyArray<{
  key: keyof Pick<
    PakistanIncomeTaxResult,
    | 'formattedMonthlyTax'
    | 'formattedMonthlyIncomeAfterTax'
    | 'formattedYearlyIncome'
    | 'formattedYearlyTax'
  >;
  label: string;
}> = [
  { key: 'formattedMonthlyTax', label: 'Monthly tax' },
  { key: 'formattedMonthlyIncomeAfterTax', label: 'Monthly income after tax' },
  { key: 'formattedYearlyIncome', label: 'Yearly income' },
  { key: 'formattedYearlyTax', label: 'Yearly tax' },
];

interface PakistanIncomeTaxFormProps {
  input: PakistanIncomeTaxInput;
  errors: PakistanIncomeTaxFieldErrors;
  result: PakistanIncomeTaxResult | null;
  onChange: (input: PakistanIncomeTaxInput) => void;
}

export function PakistanIncomeTaxForm({
  input,
  errors,
  result,
  onChange,
}: PakistanIncomeTaxFormProps) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div>
          <label className={labelClass} htmlFor="pk-tax-monthly-income">
            <span>Monthly income</span>
            <InfoTooltip
              label="Monthly income"
              text="Gross taxable employment salary for the month in Pakistani Rupees. Annualized as monthly × 12 before FBR progressive slabs. Fixed PKR; no currency conversion."
            />
          </label>
          <FieldShell error={errors.monthlyIncome}>
            <input
              id="pk-tax-monthly-income"
              className={`${inputClass} pr-12`}
              inputMode="decimal"
              value={input.monthlyIncome}
              aria-invalid={Boolean(errors.monthlyIncome)}
              onChange={(e) =>
                onChange({ ...input, monthlyIncome: e.target.value })
              }
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              Rs.
            </span>
          </FieldShell>
          {errors.monthlyIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyIncome}</p>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <dl>
          {RESULT_ROWS.map((row, index) => {
            const tinted = index % 2 === 1;
            const value = result ? result[row.key] : '0';
            return (
              <div
                key={row.key}
                className={`flex items-center justify-between gap-3 px-3.5 py-3 text-sm sm:px-4 ${
                  tinted ? 'bg-muted/25' : 'bg-white'
                }`}
              >
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="tabular-nums font-semibold text-accent">
                  Rs. {value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Estimate for Tax Year 2027 FBR salaried slabs (Finance Act, 2026). Excludes
        deductions, credits, exemptions, and withholding adjustments.
      </p>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>
    </form>
  );
}
