'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_POMIS_SCHEME,
  accountLimit,
  type PomisAccountType,
  type PomisFieldErrors,
  type PomisInput,
  type PomisResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface PomisFormProps {
  input: PomisInput;
  errors: PomisFieldErrors;
  result: PomisResult | null;
  onChange: (next: PomisInput) => void;
  onLoadExample: () => void;
}

export function PomisForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: PomisFormProps) {
  const set = (patch: Partial<PomisInput>) => onChange({ ...input, ...patch });
  const limit = accountLimit(input.accountType);
  const scheme = DEFAULT_POMIS_SCHEME;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational POMIS estimator in <strong className="text-accent">INR</strong>{' '}
        only. Default rate {scheme.annualInterestRate}% is an editable example —
        not a verified current India Post rate. Limits shown:{' '}
        Individual ₹{scheme.individualInvestmentLimit.toLocaleString('en-IN')} / Joint
        ₹{scheme.jointInvestmentLimit.toLocaleString('en-IN')} ({scheme.rulesSource.split('.')[0]}
        ).
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (₹4,50,000 · {scheme.annualInterestRate}% · Individual)
      </button>

      <fieldset>
        <legend className={`${labelClass} mb-2`}>
          Investment Account
          <InfoTooltip
            label="Investment Account"
            text="Individual accounts use the individual investment ceiling. Joint accounts use the higher joint ceiling — not a per-holder full duplicate of the joint limit."
          />
        </legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['individual', 'Individual'],
              ['joint', 'Joint'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-3.5 text-sm ${
                input.accountType === value
                  ? 'border-primary bg-primary/5 font-medium text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="pomis-account"
                className="accent-primary"
                checked={input.accountType === value}
                onChange={() =>
                  set({ accountType: value as PomisAccountType })
                }
              />
              {label}
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Active limit: ₹{limit.toLocaleString('en-IN')} · Min ₹
          {scheme.minimumInvestment.toLocaleString('en-IN')} · Multiples of ₹
          {scheme.investmentIncrement.toLocaleString('en-IN')}
        </p>
      </fieldset>

      <div>
        <label htmlFor="pomis-amount" className={labelClass}>
          Amount Invested
          <InfoTooltip
            label="Amount Invested"
            text="Principal deposited in the POMIS account (INR). Must stay within the selected account limit."
          />
        </label>
        <FieldShell error={errors.investmentAmount}>
          <span className="pointer-events-none pl-3 text-sm font-medium text-muted-foreground">
            ₹
          </span>
          <input
            id="pomis-amount"
            className={inputClass}
            inputMode="decimal"
            value={input.investmentAmount}
            aria-invalid={Boolean(errors.investmentAmount)}
            onChange={(e) => set({ investmentAmount: e.target.value })}
          />
        </FieldShell>
        {errors.investmentAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.investmentAmount}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="pomis-rate" className={labelClass}>
          Interest Rate
          <InfoTooltip
            label="Interest Rate"
            text="Nominal annual interest rate (%). Official POMIS rates are notified periodically; the rate at account opening usually governs that deposit. Edit to match the applicable notification."
          />
        </label>
        <FieldShell error={errors.annualInterestRate}>
          <input
            id="pomis-rate"
            className={`${inputClass} pr-14`}
            inputMode="decimal"
            value={input.annualInterestRate}
            aria-invalid={Boolean(errors.annualInterestRate)}
            onChange={(e) => set({ annualInterestRate: e.target.value })}
          />
          <span className="pointer-events-none absolute right-3 text-sm font-medium text-muted-foreground">
            %/yr
          </span>
        </FieldShell>
        {errors.annualInterestRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRate}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="pomis-monthly" className={labelClass}>
          Monthly Income
          <InfoTooltip
            label="Monthly Income"
            text="Estimated monthly interest = P × R ÷ (12 × 100). Read-only."
          />
        </label>
        <div className="flex h-11 items-center rounded-lg border border-border bg-muted/30 px-3 text-sm font-semibold tabular-nums text-accent">
          {result
            ? `${result.formattedMonthlyIncome} per month`
            : '—'}
        </div>
      </div>

      <details className="rounded-xl border border-border bg-muted/10">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Investment Maturity Details
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="pomis-start" className={labelClass}>
              Investment Start Date
              <InfoTooltip
                label="Investment Start Date"
                text={`Optional. Maturity ≈ start + ${scheme.investmentTermYears} years (calendar-aware). Actual credit dates follow scheme rules.`}
              />
            </label>
            <FieldShell error={errors.investmentStartDate}>
              <input
                id="pomis-start"
                type="date"
                className={inputClass}
                value={input.investmentStartDate}
                aria-invalid={Boolean(errors.investmentStartDate)}
                onChange={(e) => set({ investmentStartDate: e.target.value })}
              />
            </FieldShell>
            {errors.investmentStartDate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.investmentStartDate}
              </p>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            Configured tenure: {scheme.investmentTermYears} years (
            {scheme.investmentTermYears * 12} monthly interest payments).
          </p>
        </div>
      </details>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
