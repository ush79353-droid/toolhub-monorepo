'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  SWP_FREQUENCY_OPTIONS,
  SWP_MODE_OPTIONS,
  type DurationUnit,
  type SwpFieldErrors,
  type SwpFrequency,
  type SwpInput,
  type SwpSolveMode,
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

interface SwpFormProps {
  input: SwpInput;
  errors: SwpFieldErrors;
  specOpen: boolean;
  onSpecOpenChange: (open: boolean) => void;
  onChange: (input: SwpInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function SwpForm({
  input,
  errors,
  specOpen,
  onSpecOpenChange,
  onChange,
  onCurrencyChange,
}: SwpFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<SwpInput>) => onChange({ ...input, ...patch });
  const showWithdrawal = input.mode !== 'withdrawal';
  const showInitial =
    input.mode === 'withdrawal' ||
    input.mode === 'duration' ||
    input.mode === 'final' ||
    input.mode === 'rate';
  const showDuration = input.mode !== 'duration';
  const showReturn = input.mode !== 'rate';

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
        {SWP_MODE_OPTIONS.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-accent"
          >
            <input
              type="radio"
              name="swp-mode"
              checked={input.mode === o.value}
              onChange={() => set({ mode: o.value as SwpSolveMode })}
            />
            {o.label}
          </label>
        ))}
      </fieldset>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={specOpen}
          onClick={() => onSpecOpenChange(!specOpen)}
        >
          Systematic withdrawal specification
          <span className="text-muted-foreground" aria-hidden>
            {specOpen ? '−' : '+'}
          </span>
        </button>
        {specOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 sm:px-4 sm:pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13px] font-medium text-accent">Currency</span>
              <CurrencySelect
                id="swp-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Currency denomination for SWP amounts"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Money fields share one currency (formatting only; no FX).
            </p>

            {showInitial ? (
              <div>
                <label htmlFor="swp-initial" className={labelClass}>
                  Initial investment
                </label>
                <FieldShell error={errors.initialInvestment}>
                  <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                    {symbol}
                  </span>
                  <input
                    id="swp-initial"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.initialInvestment}
                    onChange={(e) => set({ initialInvestment: e.target.value })}
                  />
                </FieldShell>
                {errors.initialInvestment ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.initialInvestment}
                  </p>
                ) : null}
              </div>
            ) : null}

            {showWithdrawal ? (
              <div>
                <label htmlFor="swp-how-much" className={labelClass}>
                  How much?
                  <InfoTooltip
                    label="Withdrawal amount"
                    text="Amount withdrawn each period (first period amount when inflation grows later withdrawals)."
                  />
                </label>
                <FieldShell error={errors.withdrawalAmount}>
                  <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                    {symbol}
                  </span>
                  <input
                    id="swp-how-much"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.withdrawalAmount}
                    onChange={(e) => set({ withdrawalAmount: e.target.value })}
                  />
                </FieldShell>
                {errors.withdrawalAmount ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.withdrawalAmount}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label htmlFor="swp-freq" className={labelClass}>
                How often?
              </label>
              <select
                id="swp-freq"
                className={selectClass}
                value={input.frequency}
                onChange={(e) =>
                  set({ frequency: e.target.value as SwpFrequency })
                }
              >
                {SWP_FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {showDuration ? (
              <div>
                <label htmlFor="swp-duration" className={labelClass}>
                  How long?
                </label>
                <FieldShell error={errors.durationValue}>
                  <input
                    id="swp-duration"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.durationValue}
                    onChange={(e) => set({ durationValue: e.target.value })}
                  />
                  <select
                    className="h-11 shrink-0 border-l border-border bg-transparent px-2 text-xs text-muted-foreground outline-none"
                    value={input.durationUnit}
                    onChange={(e) =>
                      set({ durationUnit: e.target.value as DurationUnit })
                    }
                    aria-label="Duration unit"
                  >
                    <option value="yrs">yrs</option>
                    <option value="mos">mos</option>
                  </select>
                </FieldShell>
                {errors.durationValue ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.durationValue}
                  </p>
                ) : null}
              </div>
            ) : null}

            {showReturn ? (
              <div>
                <label htmlFor="swp-return" className={labelClass}>
                  What rate of return do you expect?
                  <InfoTooltip
                    label="Expected return"
                    text="Nominal annual portfolio return. Period rate = annual ÷ withdrawals per year."
                  />
                </label>
                <FieldShell error={errors.annualReturn}>
                  <input
                    id="swp-return"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.annualReturn}
                    onChange={(e) => set({ annualReturn: e.target.value })}
                  />
                  <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                    %
                  </span>
                </FieldShell>
                {errors.annualReturn ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.annualReturn}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label htmlFor="swp-infl" className={labelClass}>
                Inflation rate
                <InfoTooltip
                  label="Inflation"
                  text="Grows each successive withdrawal. Uses a growing-annuity model (not a simple real-rate shortcut)."
                />
              </label>
              <FieldShell error={errors.inflationRate}>
                <input
                  id="swp-infl"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.inflationRate}
                  onChange={(e) => set({ inflationRate: e.target.value })}
                />
                <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.inflationRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.inflationRate}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="swp-first" className={labelClass}>
                First withdrawal on…
              </label>
              <FieldShell error={errors.firstWithdrawalDate}>
                <input
                  id="swp-first"
                  type="date"
                  className={inputClass}
                  value={input.firstWithdrawalDate}
                  onChange={(e) => set({ firstWithdrawalDate: e.target.value })}
                />
              </FieldShell>
              {errors.firstWithdrawalDate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.firstWithdrawalDate}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
