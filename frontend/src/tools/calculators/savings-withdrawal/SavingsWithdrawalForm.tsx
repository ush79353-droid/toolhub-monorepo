'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  isCurrencyRateUsable,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  SAVINGS_WITHDRAWAL_MODE_OPTIONS,
  type SavingsWithdrawalFieldErrors,
  type SavingsWithdrawalInput,
  type SavingsWithdrawalMode,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface SavingsWithdrawalFormProps {
  input: SavingsWithdrawalInput;
  errors: SavingsWithdrawalFieldErrors;
  onChange: (input: SavingsWithdrawalInput) => void;
}

export function SavingsWithdrawalForm({
  input,
  errors,
  onChange,
}: SavingsWithdrawalFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [mainOpen, setMainOpen] = React.useState(true);
  const balanceSymbol = getCurrencySymbol(input.balanceCurrency);
  const withdrawalSymbol = getCurrencySymbol(input.withdrawalCurrency);

  const set = (patch: Partial<SavingsWithdrawalInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const convertFieldAmount = (
    amountRaw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(amountRaw);
    if (!Number.isFinite(amount)) return amountRaw;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return null;
    return moneyAmountToInputString(converted.amount);
  };

  const handleBalanceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.balanceCurrency) return;
    const nextAmount = convertFieldAmount(
      input.balance,
      input.balanceCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      balanceCurrency: next,
      balance: nextAmount,
    });
  };

  const handleWithdrawalCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.withdrawalCurrency) return;
    const nextAmount = convertFieldAmount(
      input.withdrawalAmount,
      input.withdrawalCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      withdrawalCurrency: next,
      withdrawalAmount: nextAmount,
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="sw-mode">
          I&apos;d like to know…
        </label>
        <select
          id="sw-mode"
          className={selectClass}
          value={input.mode}
          aria-invalid={Boolean(errors.mode)}
          onChange={(e) => set({ mode: e.target.value as SavingsWithdrawalMode })}
        >
          {SAVINGS_WITHDRAWAL_MODE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.mode ? <p className="mt-1 text-xs text-rose-600">{errors.mode}</p> : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={mainOpen}
          onClick={() => setMainOpen((open) => !open)}
        >
          Main Specifications
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${mainOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {mainOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5">
            <div>
              <label className={labelClass} htmlFor="sw-balance">
                <span>Balance of your savings</span>
                <InfoTooltip
                  label="Balance of your savings"
                  text="Opening savings balance. Changing currency converts this amount using live rates."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.balance}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {balanceSymbol}
                  </span>
                  <input
                    id="sw-balance"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.balance}
                    aria-invalid={Boolean(errors.balance)}
                    onChange={(e) => set({ balance: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="sw-balance-currency"
                    value={input.balanceCurrency}
                    onChange={handleBalanceCurrencyChange}
                    aria-label="Savings balance currency"
                  />
                </div>
              </div>
              {errors.balance ? (
                <p className="mt-1 text-xs text-rose-600">{errors.balance}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="sw-first-date">
                <span>First withdrawal on</span>
                <InfoTooltip
                  label="First withdrawal on"
                  text="Calendar date of the first withdrawal. Later withdrawal dates advance by whole months from this date."
                />
              </label>
              <FieldShell error={errors.firstWithdrawalDate}>
                <input
                  id="sw-first-date"
                  type="date"
                  className={inputClass}
                  value={input.firstWithdrawalDate}
                  aria-invalid={Boolean(errors.firstWithdrawalDate)}
                  onChange={(e) => set({ firstWithdrawalDate: e.target.value })}
                />
              </FieldShell>
              {errors.firstWithdrawalDate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.firstWithdrawalDate}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="sw-withdrawal">
                <span>Withdrawal amount</span>
                <InfoTooltip
                  label="Withdrawal amount"
                  text="Recurring monthly withdrawal. Mixed currencies are converted into the balance currency before simulation."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.withdrawalAmount}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {withdrawalSymbol}
                  </span>
                  <input
                    id="sw-withdrawal"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.withdrawalAmount}
                    aria-invalid={Boolean(errors.withdrawalAmount)}
                    onChange={(e) => set({ withdrawalAmount: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="sw-withdrawal-currency"
                    value={input.withdrawalCurrency}
                    onChange={handleWithdrawalCurrencyChange}
                    aria-label="Withdrawal amount currency"
                  />
                </div>
              </div>
              {errors.withdrawalAmount ? (
                <p className="mt-1 text-xs text-rose-600">{errors.withdrawalAmount}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="sw-rate">
                <span>Annual interest rate</span>
                <InfoTooltip
                  label="Annual interest rate"
                  text="Nominal annual interest rate. Monthly rate is annual ÷ 12. Percentages are never currency-converted."
                />
              </label>
              <div className="relative">
                <FieldShell error={errors.annualInterestRatePercent}>
                  <input
                    id="sw-rate"
                    className={`${inputClass} pr-10`}
                    inputMode="decimal"
                    value={input.annualInterestRatePercent}
                    aria-invalid={Boolean(errors.annualInterestRatePercent)}
                    onChange={(e) =>
                      set({ annualInterestRatePercent: e.target.value })
                    }
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </FieldShell>
              </div>
              {errors.annualInterestRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.annualInterestRatePercent}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={input.advancedOpen}
          onClick={() => set({ advancedOpen: !input.advancedOpen })}
        >
          Advanced settings
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${
              input.advancedOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.advancedOpen ? (
          <div className="border-t border-border px-3.5 py-3.5 text-xs leading-relaxed text-muted-foreground">
            No additional verified settings are defined for this calculator. The simulation uses
            monthly compounding with monthly withdrawals.
          </div>
        ) : null}
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600">{conversionError}</p>
      ) : null}
      {ratesStatus.stale ? (
        <p className="text-xs text-amber-700">
          Exchange rates are older than 48 hours. Conversion still uses the stored rates.
        </p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
