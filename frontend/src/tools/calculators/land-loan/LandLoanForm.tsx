'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
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
  PAYMENT_FREQUENCY_OPTIONS,
  type LandLoanFieldErrors,
  type LandLoanInput,
  type LandLoanResult,
  type PaymentFrequency,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface LandLoanFormProps {
  input: LandLoanInput;
  errors: LandLoanFieldErrors;
  result: LandLoanResult | null;
  onChange: (input: LandLoanInput) => void;
  onReset: () => void;
}

export function LandLoanForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: LandLoanFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const set = (patch: Partial<LandLoanInput>) => {
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

  const convertAmount = (
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): number | null => {
    if (from === to) return amount;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    return converted.ok ? converted.amount : null;
  };

  const syncDownFromPercent = (
    landValue: string,
    landCurrency: SupportedCurrency,
    percentRaw: string,
    downCurrency: SupportedCurrency
  ): string => {
    const land = parseMoneyInput(landValue);
    const pct = Number(String(percentRaw).trim().replace(/,/g, ''));
    if (!Number.isFinite(land) || !Number.isFinite(pct) || land <= 0) return '';
    const downInLand = land * (pct / 100);
    const converted = convertAmount(downInLand, landCurrency, downCurrency);
    return converted === null ? '' : moneyAmountToInputString(converted);
  };

  const handleLandCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.landValueCurrency) return;
    const amount = parseMoneyInput(input.landValue);
    if (!Number.isFinite(amount)) {
      if (!canConvertPair(next, input.downPaymentCurrency) && input.downPaymentCurrency !== next) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, landValueCurrency: next });
      return;
    }
    const converted = convertAmount(amount, input.landValueCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const nextLand = moneyAmountToInputString(converted);
    const nextDown =
      input.downPaymentSource === 'percent'
        ? syncDownFromPercent(
            nextLand,
            next,
            input.downPaymentPercent,
            input.downPaymentCurrency
          )
        : input.downPayment;
    setConversionError(null);
    onChange({
      ...input,
      landValueCurrency: next,
      landValue: nextLand,
      downPayment: nextDown,
    });
  };

  const handleDownCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.downPaymentCurrency) return;
    const amount = parseMoneyInput(input.downPayment);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, downPaymentCurrency: next });
      return;
    }
    const converted = convertAmount(amount, input.downPaymentCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      downPaymentCurrency: next,
      downPayment: moneyAmountToInputString(converted),
    });
  };

  const handleDisplayCurrencyChange = (
    field: 'loanValueCurrency' | 'periodicPaymentCurrency' | 'totalPaymentCurrency' | 'totalInterestCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.landValueCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next });
  };

  const handleLandValueChange = (raw: string) => {
    const nextDown =
      input.downPaymentSource === 'percent'
        ? syncDownFromPercent(
            raw,
            input.landValueCurrency,
            input.downPaymentPercent,
            input.downPaymentCurrency
          )
        : input.downPayment;
    set({
      landValue: raw,
      downPayment: nextDown,
      downPaymentSource: input.downPaymentSource,
    });
  };

  const handlePercentChange = (raw: string) => {
    const nextDown = syncDownFromPercent(
      input.landValue,
      input.landValueCurrency,
      raw,
      input.downPaymentCurrency
    );
    set({
      downPaymentPercent: raw,
      downPayment: nextDown,
      downPaymentSource: 'percent',
    });
  };

  const handleDownAmountChange = (raw: string) => {
    const land = parseMoneyInput(input.landValue);
    const downRaw = parseMoneyInput(raw);
    let percent = input.downPaymentPercent;
    if (Number.isFinite(land) && land > 0 && Number.isFinite(downRaw)) {
      const downInLand = convertAmount(
        downRaw,
        input.downPaymentCurrency,
        input.landValueCurrency
      );
      if (downInLand !== null) {
        percent = moneyAmountToInputString((downInLand / land) * 100);
      }
    }
    set({
      downPayment: raw,
      downPaymentPercent: percent,
      downPaymentSource: 'amount',
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Loan details</legend>

        <div>
          <label className={labelClass} htmlFor="ll-land-value">
            <span>Land value</span>
            <InfoTooltip
              label="Land value"
              text="Purchase price of the land. Must be greater than zero. Changing currency converts this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.landValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.landValueCurrency)}
              </span>
              <input
                id="ll-land-value"
                className={inputClass}
                inputMode="decimal"
                value={input.landValue}
                aria-invalid={Boolean(errors.landValue)}
                onChange={(e) => handleLandValueChange(e.target.value)}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ll-land-currency"
                value={input.landValueCurrency}
                onChange={handleLandCurrencyChange}
                aria-label="Land value currency"
              />
            </div>
          </div>
          {errors.landValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.landValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ll-down-percent">
            <span>Down payment percentage</span>
            <InfoTooltip
              label="Down payment percentage"
              text="Share of land value paid upfront (0–100%). Never currency-converted."
            />
          </label>
          <FieldShell error={errors.downPaymentPercent}>
            <input
              id="ll-down-percent"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.downPaymentPercent}
              aria-invalid={Boolean(errors.downPaymentPercent)}
              onChange={(e) => handlePercentChange(e.target.value)}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.downPaymentPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.downPaymentPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ll-down-payment">
            <span>Down payment</span>
            <InfoTooltip
              label="Down payment"
              text="Cash paid upfront. Editing percentage updates this amount; editing this amount updates the percentage (Auto Loan bidirectional pattern)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.downPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.downPaymentCurrency)}
              </span>
              <input
                id="ll-down-payment"
                className={inputClass}
                inputMode="decimal"
                value={input.downPayment}
                aria-invalid={Boolean(errors.downPayment)}
                onChange={(e) => handleDownAmountChange(e.target.value)}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ll-down-currency"
                value={input.downPaymentCurrency}
                onChange={handleDownCurrencyChange}
                aria-label="Down payment currency"
              />
            </div>
          </div>
          {errors.downPayment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.downPayment}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ll-loan-value">
            <span>Loan value</span>
            <InfoTooltip
              label="Loan value"
              text="Financed principal = land value − down payment. Display currency only re-expresses this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.loanValueCurrency)}
              </span>
              <input
                id="ll-loan-value"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedLoanValue : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ll-loan-currency"
                value={input.loanValueCurrency}
                onChange={(next) => handleDisplayCurrencyChange('loanValueCurrency', next)}
                aria-label="Loan value currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ll-rate">
            <span>Annual interest rate</span>
            <InfoTooltip
              label="Annual interest rate"
              text="Nominal annual percentage rate used for standard amortizing payments."
            />
          </label>
          <FieldShell error={errors.annualInterestRatePercent}>
            <input
              id="ll-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualInterestRatePercent}
              aria-invalid={Boolean(errors.annualInterestRatePercent)}
              onChange={(e) => set({ annualInterestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.annualInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ll-term-years">
            <span>Loan term</span>
            <InfoTooltip
              label="Loan term"
              text="Loan duration in years and months (0–11). Combined with payment frequency to get the installment count."
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FieldShell error={errors.termYears}>
              <input
                id="ll-term-years"
                className={`${inputClass} pr-10`}
                inputMode="numeric"
                value={input.termYears}
                aria-invalid={Boolean(errors.termYears)}
                onChange={(e) => set({ termYears: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                yrs
              </span>
            </FieldShell>
            <div className="relative">
              <select
                id="ll-term-months"
                className={selectClass}
                value={input.termMonths}
                aria-invalid={Boolean(errors.termMonths)}
                onChange={(e) => set({ termMonths: e.target.value })}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={String(i)}>
                    {i} mos
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.termYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
          ) : errors.termMonths ? (
            <p className="mt-1 text-xs text-rose-600">{errors.termMonths}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ll-frequency">
            <span>Payment frequency</span>
            <InfoTooltip
              label="Payment frequency"
              text="How often payments are due. Changes payment count and the periodic interest rate."
            />
          </label>
          <select
            id="ll-frequency"
            className={selectClass}
            value={input.paymentFrequency}
            onChange={(e) =>
              set({ paymentFrequency: e.target.value as PaymentFrequency })
            }
          >
            {PAYMENT_FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="ll-payments">
            <span>Number of payments</span>
            <InfoTooltip
              label="Number of payments"
              text="Whole installments from loan term and payment frequency (monthly: 12×years + months)."
            />
          </label>
          <FieldShell muted>
            <input
              id="ll-payments"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedNumberOfPayments : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        <div>
          <label className={labelClass} htmlFor="ll-periodic-payment">
            <span>Periodic loan payment</span>
            <InfoTooltip
              label="Periodic loan payment"
              text="Scheduled payment for the selected frequency from standard amortization."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.periodicPaymentCurrency)}
              </span>
              <input
                id="ll-periodic-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedPeriodicPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ll-periodic-payment-currency"
                value={input.periodicPaymentCurrency}
                onChange={(next) =>
                  handleDisplayCurrencyChange('periodicPaymentCurrency', next)
                }
                aria-label="Periodic loan payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ll-total-payment">
            <span>Total loan payment</span>
            <InfoTooltip
              label="Total loan payment"
              text="Periodic payment × number of payments over the full term."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.totalPaymentCurrency)}
              </span>
              <input
                id="ll-total-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ll-total-payment-currency"
                value={input.totalPaymentCurrency}
                onChange={(next) =>
                  handleDisplayCurrencyChange('totalPaymentCurrency', next)
                }
                aria-label="Total loan payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ll-total-interest">
            <span>Total interest paid</span>
            <InfoTooltip
              label="Total interest paid"
              text="Total loan payment minus financed loan value (not land value)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.totalInterestCurrency)}
              </span>
              <input
                id="ll-total-interest"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalInterest : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ll-total-interest-currency"
                value={input.totalInterestCurrency}
                onChange={(next) =>
                  handleDisplayCurrencyChange('totalInterestCurrency', next)
                }
                aria-label="Total interest paid currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ll-periodic-rate">
            <span>Periodic interest rate</span>
            <InfoTooltip
              label="Periodic interest rate"
              text="Nominal periodic rate (%) = annual rate ÷ payments per year."
            />
          </label>
          <FieldShell muted>
            <input
              id="ll-periodic-rate"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedPeriodicRate : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          onClick={() => {
            setConversionError(null);
            onReset();
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
