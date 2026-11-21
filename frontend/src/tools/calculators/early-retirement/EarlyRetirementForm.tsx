'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DurationDisplayUnit,
  EarlyRetirementFieldErrors,
  EarlyRetirementInput,
  EarlyRetirementResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface EarlyRetirementFormProps {
  input: EarlyRetirementInput;
  errors: EarlyRetirementFieldErrors;
  result: EarlyRetirementResult | null;
  onChange: (input: EarlyRetirementInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EarlyRetirementForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: EarlyRetirementFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Monthly deposit = max(net income − expenses, 0) ÷ 12. Required balance =
        annual expenses ÷ withdrawal rate. Timeline uses end-of-month deposits
        and monthly compounding from the annual return. Currency labels amounts
        only (no FX conversion).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="er-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination for early retirement amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Money fields share one currency (denomination only; no FX).
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Monthly deposit
        </legend>

        <div>
          <label htmlFor="er-net-income" className={labelClass}>
            Net income
            <InfoTooltip
              label="Net income"
              text="Annual take-home income after taxes. Used with expenses to derive monthly savings capacity."
            />
          </label>
          <FieldShell error={errors.netIncome}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="er-net-income"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.netIncome}
              onChange={(e) =>
                onChange({ ...input, netIncome: e.target.value })
              }
              placeholder="60,000"
              aria-invalid={Boolean(errors.netIncome)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              / yr
            </span>
          </FieldShell>
          {errors.netIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="er-expenses" className={labelClass}>
            Expenses
            <InfoTooltip
              label="Expenses"
              text="Annual living expenses you expect in retirement. Also used with the withdrawal rate to size the required nest egg."
            />
          </label>
          <FieldShell error={errors.expenses}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="er-expenses"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.expenses}
              onChange={(e) =>
                onChange({ ...input, expenses: e.target.value })
              }
              placeholder="30,000"
              aria-invalid={Boolean(errors.expenses)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              / yr
            </span>
          </FieldShell>
          {errors.expenses ? (
            <p className="mt-1 text-xs text-rose-600">{errors.expenses}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="er-initial" className={labelClass}>
            Initial balance
            <InfoTooltip
              label="Initial balance"
              text="Current investable savings that will grow toward the required retirement balance."
            />
          </label>
          <FieldShell error={errors.initialBalance}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="er-initial"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.initialBalance}
              onChange={(e) =>
                onChange({ ...input, initialBalance: e.target.value })
              }
              placeholder="0.00"
              aria-invalid={Boolean(errors.initialBalance)}
            />
          </FieldShell>
          {errors.initialBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialBalance}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="er-monthly-deposit" className={labelClass}>
            Monthly deposit
            <InfoTooltip
              label="Monthly deposit"
              text="Calculated as max(net income − expenses, 0) ÷ 12. This is the monthly amount invested until financial independence."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="er-monthly-deposit"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} cursor-default`}
              value={
                result
                  ? result.monthlyDeposit.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : ''
              }
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Independence plan
        </legend>

        <div>
          <label htmlFor="er-roi" className={labelClass}>
            Return on investment
            <InfoTooltip
              label="Return on investment"
              text="Expected average annual investment return used to compound the portfolio while you save."
            />
          </label>
          <FieldShell error={errors.returnOnInvestment}>
            <input
              id="er-roi"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.returnOnInvestment}
              onChange={(e) =>
                onChange({ ...input, returnOnInvestment: e.target.value })
              }
              placeholder="5"
              aria-invalid={Boolean(errors.returnOnInvestment)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              % / yr
            </span>
          </FieldShell>
          {errors.returnOnInvestment ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.returnOnInvestment}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="er-wr" className={labelClass}>
            Withdrawal rate
            <InfoTooltip
              label="Withdrawal rate"
              text="Planning withdrawal rate (for example 4%). Required balance = annual expenses ÷ (rate ÷ 100)."
            />
          </label>
          <FieldShell error={errors.withdrawalRate}>
            <input
              id="er-wr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.withdrawalRate}
              onChange={(e) =>
                onChange({ ...input, withdrawalRate: e.target.value })
              }
              placeholder="4"
              aria-invalid={Boolean(errors.withdrawalRate)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.withdrawalRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.withdrawalRate}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="er-required" className={labelClass}>
            Required balance
            <InfoTooltip
              label="Required balance"
              text="Nest egg needed so annual expenses ÷ balance equals your withdrawal rate."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="er-required"
              type="text"
              readOnly
              className={`${inputClass} cursor-default`}
              value={
                result && Number.isFinite(result.requiredBalance)
                  ? result.requiredBalance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : ''
              }
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="er-total-contrib" className={labelClass}>
            Total contribution
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="er-total-contrib"
              type="text"
              readOnly
              className={`${inputClass} cursor-default`}
              value={
                result && !result.unreachable
                  ? result.totalContribution.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : ''
              }
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="er-total-interest" className={labelClass}>
            Total interest
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="er-total-interest"
              type="text"
              readOnly
              className={`${inputClass} cursor-default`}
              value={
                result && !result.unreachable
                  ? result.totalInterest.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : ''
              }
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="er-duration" className={labelClass}>
            Duration
            <InfoTooltip
              label="Duration"
              text="Time until the portfolio reaches the required balance with end-of-month deposits. Toggle years or total months."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <input
                id="er-duration"
                type="text"
                readOnly
                className={`${inputClass} cursor-default`}
                value={
                  result && !result.unreachable
                    ? input.durationUnit === 'months'
                      ? String(result.monthsWhole)
                      : result.durationYears.toFixed(2)
                    : ''
                }
                aria-readonly="true"
              />
              <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
                {input.durationUnit === 'months' ? 'mos' : 'yrs'}
              </span>
            </FieldShell>
            <label className="sr-only" htmlFor="er-duration-unit">
              Duration unit
            </label>
            <select
              id="er-duration-unit"
              className="h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.durationUnit}
              onChange={(e) =>
                onChange({
                  ...input,
                  durationUnit: e.target.value as DurationDisplayUnit,
                })
              }
            >
              <option value="months">mos</option>
              <option value="years">yrs</option>
            </select>
          </div>
          {result && !result.unreachable ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {result.yearsPart} yr {result.monthsPart} mo
              {result.alreadyIndependent ? ' (already independent)' : ''}
            </p>
          ) : null}
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
