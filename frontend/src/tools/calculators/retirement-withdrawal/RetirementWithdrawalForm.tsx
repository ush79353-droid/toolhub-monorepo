'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  TIMING_OPTIONS,
  type CompoundingMethod,
  type PaymentFrequency,
  type RetirementWithdrawalFieldErrors,
  type RetirementWithdrawalInput,
  type RetirementWithdrawalResult,
  type SolveMode,
  type WithdrawalTiming,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface RetirementWithdrawalFormProps {
  input: RetirementWithdrawalInput;
  errors: RetirementWithdrawalFieldErrors;
  result: RetirementWithdrawalResult | null;
  basicOpen: boolean;
  advancedOpen: boolean;
  onBasicOpenChange: (open: boolean) => void;
  onAdvancedOpenChange: (open: boolean) => void;
  onChange: (input: RetirementWithdrawalInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function RetirementWithdrawalForm({
  input,
  errors,
  result,
  basicOpen,
  advancedOpen,
  onBasicOpenChange,
  onAdvancedOpenChange,
  onChange,
  onCurrencyChange,
}: RetirementWithdrawalFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<RetirementWithdrawalInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          I&apos;d like to know…
        </legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="radio"
            name="rw-mode"
            checked={input.mode === 'withdrawal'}
            onChange={() => set({ mode: 'withdrawal' satisfies SolveMode })}
          />
          how much can I withdraw?
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="radio"
            name="rw-mode"
            checked={input.mode === 'duration'}
            onChange={() => set({ mode: 'duration' satisfies SolveMode })}
          />
          how long will my money last?
        </label>
      </fieldset>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={basicOpen}
          onClick={() => onBasicOpenChange(!basicOpen)}
        >
          Basic settings
          <span className="text-muted-foreground" aria-hidden>
            {basicOpen ? '−' : '+'}
          </span>
        </button>
        {basicOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 sm:px-4 sm:pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13px] font-medium text-accent">Currency</span>
              <CurrencySelect
                id="rw-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Currency denomination for retirement amounts"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Money fields share one currency (formatting only; no FX).
            </p>

            <div>
              <label htmlFor="rw-balance" className={labelClass}>
                Balance at the beginning of retirement
                <InfoTooltip
                  label="Balance at retirement"
                  text="Nest egg available when retirement starts. Pre-retirement inflation grows today’s figure forward to that date."
                />
              </label>
              <FieldShell error={errors.balanceAtRetirement}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="rw-balance"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.balanceAtRetirement}
                  onChange={(e) => set({ balanceAtRetirement: e.target.value })}
                  aria-invalid={Boolean(errors.balanceAtRetirement)}
                />
              </FieldShell>
              {errors.balanceAtRetirement ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.balanceAtRetirement}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="rw-age-now" className={labelClass}>
                  Your age now
                </label>
                <FieldShell error={errors.ageNow}>
                  <input
                    id="rw-age-now"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.ageNow}
                    onChange={(e) => set({ ageNow: e.target.value })}
                    aria-invalid={Boolean(errors.ageNow)}
                  />
                  <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                    yrs
                  </span>
                </FieldShell>
                {errors.ageNow ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.ageNow}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="rw-retire-age" className={labelClass}>
                  Planned age to retire
                </label>
                <FieldShell error={errors.retireAge}>
                  <input
                    id="rw-retire-age"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.retireAge}
                    onChange={(e) => set({ retireAge: e.target.value })}
                    aria-invalid={Boolean(errors.retireAge)}
                  />
                  <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                    yrs
                  </span>
                </FieldShell>
                {errors.retireAge ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.retireAge}</p>
                ) : null}
              </div>
            </div>

            {input.mode === 'withdrawal' ? (
              <div>
                <label htmlFor="rw-years" className={labelClass}>
                  Planned years in retirement
                </label>
                <FieldShell error={errors.yearsInRetirement}>
                  <input
                    id="rw-years"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.yearsInRetirement}
                    onChange={(e) => set({ yearsInRetirement: e.target.value })}
                    aria-invalid={Boolean(errors.yearsInRetirement)}
                  />
                  <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                    yrs
                  </span>
                </FieldShell>
                {errors.yearsInRetirement ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.yearsInRetirement}
                  </p>
                ) : null}
              </div>
            ) : (
              <div>
                <label htmlFor="rw-withdrawal-in" className={labelClass}>
                  Withdrawal amount (per period)
                </label>
                <FieldShell error={errors.withdrawalAmount}>
                  <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                    {symbol}
                  </span>
                  <input
                    id="rw-withdrawal-in"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.withdrawalAmount}
                    onChange={(e) => set({ withdrawalAmount: e.target.value })}
                    aria-invalid={Boolean(errors.withdrawalAmount)}
                  />
                </FieldShell>
                {errors.withdrawalAmount ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.withdrawalAmount}
                  </p>
                ) : null}
              </div>
            )}

            <div>
              <label htmlFor="rw-rate" className={labelClass}>
                Annual interest rate
                <InfoTooltip
                  label="Annual interest rate"
                  text="Nominal annual portfolio return before converting to a per-period rate with your compounding method."
                />
              </label>
              <FieldShell error={errors.annualInterestRate}>
                <input
                  id="rw-rate"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.annualInterestRate}
                  onChange={(e) => set({ annualInterestRate: e.target.value })}
                  aria-invalid={Boolean(errors.annualInterestRate)}
                />
                <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.annualInterestRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.annualInterestRate}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="rw-infl-b" className={labelClass}>
                  Inflation rate before you retire
                  <InfoTooltip
                    label="Inflation before retirement"
                    text="Grows the entered nest egg from today to retirement-start dollars."
                  />
                </label>
                <FieldShell error={errors.inflationBefore}>
                  <input
                    id="rw-infl-b"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.inflationBefore}
                    onChange={(e) => set({ inflationBefore: e.target.value })}
                    aria-invalid={Boolean(errors.inflationBefore)}
                  />
                  <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                    %
                  </span>
                </FieldShell>
                {errors.inflationBefore ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.inflationBefore}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="rw-infl-a" className={labelClass}>
                  Inflation rate after you retire
                  <InfoTooltip
                    label="Inflation after retirement"
                    text="Withdrawals grow with this rate each year (period-converted)."
                  />
                </label>
                <FieldShell error={errors.inflationAfter}>
                  <input
                    id="rw-infl-a"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.inflationAfter}
                    onChange={(e) => set({ inflationAfter: e.target.value })}
                    aria-invalid={Boolean(errors.inflationAfter)}
                  />
                  <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                    %
                  </span>
                </FieldShell>
                {errors.inflationAfter ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.inflationAfter}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={advancedOpen}
          onClick={() => onAdvancedOpenChange(!advancedOpen)}
        >
          Advanced settings
          <span className="text-muted-foreground" aria-hidden>
            {advancedOpen ? '−' : '+'}
          </span>
        </button>
        {advancedOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 sm:px-4 sm:pb-4">
            <div>
              <label htmlFor="rw-freq" className={labelClass}>
                Payment frequency
                <InfoTooltip
                  label="Payment frequency"
                  text="How often you withdraw (monthly, annually, etc.)."
                />
              </label>
              <select
                id="rw-freq"
                className={selectClass}
                value={input.paymentFrequency}
                onChange={(e) =>
                  set({
                    paymentFrequency: e.target.value as PaymentFrequency,
                  })
                }
              >
                {PAYMENT_FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rw-compound" className={labelClass}>
                Compounding method
                <InfoTooltip
                  label="Compounding method"
                  text="How often interest compounds when converting the annual rate to a per-withdrawal-period rate."
                />
              </label>
              <select
                id="rw-compound"
                className={selectClass}
                value={input.compounding}
                onChange={(e) =>
                  set({ compounding: e.target.value as CompoundingMethod })
                }
              >
                {COMPOUNDING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rw-timing" className={labelClass}>
                Timing of withdrawals
              </label>
              <select
                id="rw-timing"
                className={selectClass}
                value={input.timing}
                onChange={(e) =>
                  set({ timing: e.target.value as WithdrawalTiming })
                }
              >
                {TIMING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rw-end-bal" className={labelClass}>
                Balance at the end of retirement
                <InfoTooltip
                  label="Ending balance"
                  text="Target nest egg left after the last modeled withdrawal (often zero)."
                />
              </label>
              <FieldShell error={errors.endBalance}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="rw-end-bal"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.endBalance}
                  onChange={(e) => set({ endBalance: e.target.value })}
                  aria-invalid={Boolean(errors.endBalance)}
                />
              </FieldShell>
              {errors.endBalance ? (
                <p className="mt-1 text-xs text-rose-600">{errors.endBalance}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {result ? (
        <p className="text-xs text-muted-foreground">
          Starting balance used:{' '}
          <span className="font-medium text-accent">
            {result.formattedStartingBalance}
          </span>
          {result.inflationBeforePercent !== 0
            ? ' (after pre-retirement inflation).'
            : '.'}
        </p>
      ) : null}
    </form>
  );
}
