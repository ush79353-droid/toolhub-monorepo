'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
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
  INTEREST_METHOD_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  TERM_UNIT_OPTIONS,
  type InterestMethod,
  type MortgageWithExtraPaymentsFieldErrors,
  type MortgageWithExtraPaymentsInput,
  type PaymentFrequency,
  type TermUnit,
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

interface MortgageWithExtraPaymentsFormProps {
  input: MortgageWithExtraPaymentsInput;
  errors: MortgageWithExtraPaymentsFieldErrors;
  onChange: (input: MortgageWithExtraPaymentsInput) => void;
}

export function MortgageWithExtraPaymentsForm({
  input,
  errors,
  onChange,
}: MortgageWithExtraPaymentsFormProps) {
  const rates = useCurrencyRates();
  useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(
    null
  );
  const mortgageSymbol = getCurrencySymbol(input.mortgageCurrency);
  const periodicSymbol = getCurrencySymbol(input.periodicCurrency);
  const lumpSymbol = getCurrencySymbol(input.lumpSumCurrency);

  const set = (patch: Partial<MortgageWithExtraPaymentsInput>) => {
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

  const handleMortgageCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.mortgageCurrency) return;
    const nextAmount = convertFieldAmount(
      input.mortgageAmount,
      input.mortgageCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({ mortgageCurrency: next, mortgageAmount: nextAmount });
  };

  const handlePeriodicCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.periodicCurrency) return;
    const nextAmount = convertFieldAmount(
      input.periodicExtra,
      input.periodicCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({ periodicCurrency: next, periodicExtra: nextAmount });
  };

  const handleLumpCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.lumpSumCurrency) return;
    const nextAmount = convertFieldAmount(
      input.lumpSum,
      input.lumpSumCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({ lumpSumCurrency: next, lumpSum: nextAmount });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3"
      noValidate
      autoComplete="off"
    >
      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4">
          Original schedule
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          <div>
            <label htmlFor="mwep-amount" className={labelClass}>
              Mortgage amount
              <InfoTooltip
                label="Mortgage amount"
                text="Starting principal. Changing currency converts this amount using stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.mortgageAmount}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {mortgageSymbol}
                </span>
                <input
                  id="mwep-amount"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.mortgageAmount}
                  aria-invalid={Boolean(errors.mortgageAmount)}
                  onChange={(e) => set({ mortgageAmount: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="mwep-amount-currency"
                  value={input.mortgageCurrency}
                  onChange={handleMortgageCurrencyChange}
                  aria-label="Mortgage amount currency"
                />
              </div>
            </div>
            {errors.mortgageAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.mortgageAmount}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="mwep-rate" className={labelClass}>
              Interest rate
              <InfoTooltip
                label="Interest rate"
                text="Annual nominal interest rate (%). Not converted by currency."
              />
            </label>
            <FieldShell error={errors.interestRatePercent}>
              <input
                id="mwep-rate"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.interestRatePercent}
                aria-invalid={Boolean(errors.interestRatePercent)}
                onChange={(e) => set({ interestRatePercent: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                %
              </span>
            </FieldShell>
            {errors.interestRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.interestRatePercent}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="mwep-term" className={labelClass}>
              Loan term
              <InfoTooltip
                label="Loan term"
                text="Scheduled amortization length in years or months."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.loanTerm}>
                <input
                  id="mwep-term"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.loanTerm}
                  aria-invalid={Boolean(errors.loanTerm)}
                  onChange={(e) => set({ loanTerm: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <select
                  className={selectClass}
                  value={input.termUnit}
                  aria-label="Loan term unit"
                  onChange={(e) =>
                    set({ termUnit: e.target.value as TermUnit })
                  }
                >
                  {TERM_UNIT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.loanTerm ? (
              <p className="mt-1 text-xs text-rose-600">{errors.loanTerm}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="mwep-method" className={labelClass}>
              Interest calculation method
              <InfoTooltip
                label="Interest calculation method"
                text="Monthly (US & UK) uses APR÷12. Semi-annually (Canada) compounds twice per year."
              />
            </label>
            <select
              id="mwep-method"
              className={selectClass}
              value={input.interestMethod}
              onChange={(e) =>
                set({ interestMethod: e.target.value as InterestMethod })
              }
            >
              {INTEREST_METHOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mwep-due" className={labelClass}>
              Due date
              <InfoTooltip
                label="Due date"
                text="First scheduled payment date. Payoff dates are measured from this date."
              />
            </label>
            <FieldShell error={errors.dueDate}>
              <input
                id="mwep-due"
                type="date"
                className={inputClass}
                value={input.dueDate}
                aria-invalid={Boolean(errors.dueDate)}
                onChange={(e) => set({ dueDate: e.target.value })}
              />
            </FieldShell>
            {errors.dueDate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4">
          Extra payment specification
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          <div>
            <label htmlFor="mwep-freq" className={labelClass}>
              Payment frequency
              <InfoTooltip
                label="Payment frequency"
                text="How often the revised schedule pays. Accelerated bi-weekly pays half the monthly installment every two weeks."
              />
            </label>
            <select
              id="mwep-freq"
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
            <label htmlFor="mwep-periodic" className={labelClass}>
              Periodic extra payment
              <InfoTooltip
                label="Periodic extra payment"
                text="Extra principal with each revised payment from the start date. Converted into the mortgage currency before amortization."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.periodicExtra}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {periodicSymbol}
                </span>
                <input
                  id="mwep-periodic"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.periodicExtra}
                  aria-invalid={Boolean(errors.periodicExtra)}
                  onChange={(e) => set({ periodicExtra: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="mwep-periodic-currency"
                  value={input.periodicCurrency}
                  onChange={handlePeriodicCurrencyChange}
                  aria-label="Periodic extra payment currency"
                />
              </div>
            </div>
            {errors.periodicExtra ? (
              <p className="mt-1 text-xs text-rose-600">{errors.periodicExtra}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="mwep-periodic-start" className={labelClass}>
              Starting from
              <InfoTooltip
                label="Starting from"
                text="First payment date on or after which the periodic extra applies."
              />
            </label>
            <FieldShell error={errors.periodicStartDate}>
              <input
                id="mwep-periodic-start"
                type="date"
                className={inputClass}
                value={input.periodicStartDate}
                aria-invalid={Boolean(errors.periodicStartDate)}
                onChange={(e) => set({ periodicStartDate: e.target.value })}
              />
            </FieldShell>
            {errors.periodicStartDate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.periodicStartDate}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="mwep-lump" className={labelClass}>
              Lump-sum prepayment
              <InfoTooltip
                label="Lump-sum prepayment"
                text="One-time principal reduction on or after the paid-on date. Converted into the mortgage currency before amortization."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.lumpSum}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {lumpSymbol}
                </span>
                <input
                  id="mwep-lump"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.lumpSum}
                  aria-invalid={Boolean(errors.lumpSum)}
                  onChange={(e) => set({ lumpSum: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="mwep-lump-currency"
                  value={input.lumpSumCurrency}
                  onChange={handleLumpCurrencyChange}
                  aria-label="Lump-sum prepayment currency"
                />
              </div>
            </div>
            {errors.lumpSum ? (
              <p className="mt-1 text-xs text-rose-600">{errors.lumpSum}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="mwep-lump-date" className={labelClass}>
              Paid on
              <InfoTooltip
                label="Paid on"
                text="Date of the lump-sum prepayment. Applied on the first payment date on or after this day."
              />
            </label>
            <FieldShell error={errors.lumpSumDate}>
              <input
                id="mwep-lump-date"
                type="date"
                className={inputClass}
                value={input.lumpSumDate}
                aria-invalid={Boolean(errors.lumpSumDate)}
                onChange={(e) => set({ lumpSumDate: e.target.value })}
              />
            </FieldShell>
            {errors.lumpSumDate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.lumpSumDate}</p>
            ) : null}
          </div>
        </div>
      </details>

      {conversionError ? (
        <p className="text-xs text-rose-600">{conversionError}</p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
