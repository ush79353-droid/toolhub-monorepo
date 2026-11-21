'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { PensionFieldErrors, PensionInput } from './types';

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

interface PensionFormProps {
  input: PensionInput;
  errors: PensionFieldErrors;
  onChange: (input: PensionInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function PensionForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: PensionFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Compare taking a lump sum and investing it versus receiving a
        COLA-adjusted monthly pension. Currency labels amounts only (no FX).
        Informational — not financial advice.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="pension-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination for pension amounts"
        />
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Lump sum payout or monthly pension income?
        </legend>

        <div>
          <label htmlFor="pension-age" className={labelClass}>
            Your retirement age
            <InfoTooltip
              label="Retirement age"
              text="Age when lump-sum investing or pension payments begin in this comparison."
            />
          </label>
          <FieldShell error={errors.retirementAge}>
            <input
              id="pension-age"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.retirementAge}
              onChange={(e) =>
                onChange({ ...input, retirementAge: e.target.value })
              }
              placeholder="65"
              aria-invalid={Boolean(errors.retirementAge)}
            />
          </FieldShell>
          {errors.retirementAge ? (
            <p className="mt-1 text-xs text-rose-600">{errors.retirementAge}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Option 1: lump sum payment
        </legend>

        <div>
          <label htmlFor="pension-lump" className={labelClass}>
            Lump sum payment amount
            <InfoTooltip
              label="Lump sum"
              text="One-time payout assumed to be invested and drawn down to match the pension."
            />
          </label>
          <FieldShell error={errors.lumpSum}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pension-lump"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.lumpSum}
              onChange={(e) => onChange({ ...input, lumpSum: e.target.value })}
              placeholder="800,000"
              aria-invalid={Boolean(errors.lumpSum)}
            />
          </FieldShell>
          {errors.lumpSum ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lumpSum}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pension-return" className={labelClass}>
            Your investment return
            <InfoTooltip
              label="Investment return"
              text="Expected average annual return on the invested lump sum before matching pension withdrawals."
            />
          </label>
          <FieldShell error={errors.investmentReturn}>
            <input
              id="pension-return"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.investmentReturn}
              onChange={(e) =>
                onChange({ ...input, investmentReturn: e.target.value })
              }
              placeholder="5"
              aria-invalid={Boolean(errors.investmentReturn)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              % per year
            </span>
          </FieldShell>
          {errors.investmentReturn ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.investmentReturn}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Option 2: monthly pension payment
        </legend>

        <div>
          <label htmlFor="pension-monthly" className={labelClass}>
            Monthly pension income
            <InfoTooltip
              label="Monthly pension"
              text="Starting monthly pension payment before cost-of-living adjustments."
            />
          </label>
          <FieldShell error={errors.monthlyPension}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pension-monthly"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.monthlyPension}
              onChange={(e) =>
                onChange({ ...input, monthlyPension: e.target.value })
              }
              placeholder="5,000"
              aria-invalid={Boolean(errors.monthlyPension)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              per month
            </span>
          </FieldShell>
          {errors.monthlyPension ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyPension}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pension-cola" className={labelClass}>
            Cost-of-living adjustment
            <InfoTooltip
              label="COLA"
              text="Annual percent increase applied to the monthly pension after each 12 months of payments."
            />
          </label>
          <FieldShell error={errors.cola}>
            <input
              id="pension-cola"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.cola}
              onChange={(e) => onChange({ ...input, cola: e.target.value })}
              placeholder="3.5"
              aria-invalid={Boolean(errors.cola)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              % per year
            </span>
          </FieldShell>
          {errors.cola ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cola}</p>
          ) : null}
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            ¹ Cost-of-living adjustment raises the monthly pension once per year
            after every 12 payments in this model.
          </p>
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
