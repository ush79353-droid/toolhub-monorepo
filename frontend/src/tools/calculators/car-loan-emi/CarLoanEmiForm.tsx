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
import type {
  CarLoanEmiFieldErrors,
  CarLoanEmiInput,
  CarLoanEmiResult,
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

interface CarLoanEmiFormProps {
  input: CarLoanEmiInput;
  errors: CarLoanEmiFieldErrors;
  result: CarLoanEmiResult | null;
  onChange: (input: CarLoanEmiInput) => void;
}

export function CarLoanEmiForm({
  input,
  errors,
  result,
  onChange,
}: CarLoanEmiFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const set = (patch: Partial<CarLoanEmiInput>) => {
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
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return raw;
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

  const ensureCalcPaths = (nextCalc: SupportedCurrency): boolean => {
    const pairs: Array<[SupportedCurrency, SupportedCurrency]> = [
      [input.carPriceCurrency, nextCalc],
      [input.moneyYouHaveCurrency, nextCalc],
      [input.tradeInCurrency, nextCalc],
      [nextCalc, input.monthlyPaymentCurrency],
      [nextCalc, input.totalInterestCurrency],
    ];
    return pairs.every(([from, to]) => canConvertPair(from, to));
  };

  const handleInputCurrencyChange = (
    field: 'carPrice' | 'moneyYouHave' | 'tradeInValue',
    currencyField:
      | 'carPriceCurrency'
      | 'moneyYouHaveCurrency'
      | 'tradeInCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[currencyField]) return;
    const nextAmount = convertFieldAmount(input[field], input[currencyField], next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (!canConvertPair(next, input.loanAmountCurrency)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      [currencyField]: next,
      [field]: nextAmount,
    });
  };

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanAmountCurrency) return;
    if (!ensureCalcPaths(next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, loanAmountCurrency: next });
  };

  const handleDisplayCurrencyChange = (
    field: 'monthlyPaymentCurrency' | 'totalInterestCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.loanAmountCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-muted-foreground">
        Fill in the value of your new and old car, the down payment (and taxes if needed),
        and find out the amount of the loan to buy your new car. We can also tell you the
        interest and monthly payment!
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Car Loan EMI Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="clemi-car-price">
            <span>Price of the car</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.carPrice}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.carPriceCurrency)}
              </span>
              <input
                id="clemi-car-price"
                className={inputClass}
                inputMode="decimal"
                value={input.carPrice}
                aria-invalid={Boolean(errors.carPrice)}
                onChange={(e) => set({ carPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="clemi-car-price-currency"
                value={input.carPriceCurrency}
                onChange={(next) =>
                  handleInputCurrencyChange('carPrice', 'carPriceCurrency', next)
                }
                aria-label="Car price currency"
              />
            </div>
          </div>
          {errors.carPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.carPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="clemi-money">
            <span>Money you have</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.moneyYouHave}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.moneyYouHaveCurrency)}
              </span>
              <input
                id="clemi-money"
                className={inputClass}
                inputMode="decimal"
                value={input.moneyYouHave}
                aria-invalid={Boolean(errors.moneyYouHave)}
                onChange={(e) => set({ moneyYouHave: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="clemi-money-currency"
                value={input.moneyYouHaveCurrency}
                onChange={(next) =>
                  handleInputCurrencyChange(
                    'moneyYouHave',
                    'moneyYouHaveCurrency',
                    next
                  )
                }
                aria-label="Money you have currency"
              />
            </div>
          </div>
          {errors.moneyYouHave ? (
            <p className="mt-1 text-xs text-rose-600">{errors.moneyYouHave}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="clemi-trade-in">
            <span>Trade-in value</span>
            <InfoTooltip
              label="Trade-in value"
              text="Estimated credit for the vehicle you trade in. Changing currency converts this amount using stored exchange rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.tradeInValue}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.tradeInCurrency)}
              </span>
              <input
                id="clemi-trade-in"
                className={inputClass}
                inputMode="decimal"
                value={input.tradeInValue}
                aria-invalid={Boolean(errors.tradeInValue)}
                onChange={(e) => set({ tradeInValue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="clemi-trade-in-currency"
                value={input.tradeInCurrency}
                onChange={(next) =>
                  handleInputCurrencyChange(
                    'tradeInValue',
                    'tradeInCurrency',
                    next
                  )
                }
                aria-label="Trade-in currency"
              />
            </div>
          </div>
          {errors.tradeInValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.tradeInValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="clemi-sales-tax">
            <span>Sales tax</span>
            <InfoTooltip
              label="Sales tax"
              text="Sales tax as a percent of the car price. Never currency-converted."
            />
          </label>
          <FieldShell error={errors.salesTaxPercent}>
            <input
              id="clemi-sales-tax"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.salesTaxPercent}
              aria-invalid={Boolean(errors.salesTaxPercent)}
              onChange={(e) => set({ salesTaxPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.salesTaxPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.salesTaxPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="clemi-loan-amount">
            <span>Loan amount</span>
            <InfoTooltip
              label="Loan amount"
              text="Financed principal = car price + sales tax − money you have − trade-in. Mixed currencies normalize into this field’s currency before EMI math."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.loanAmountCurrency)}
              </span>
              <input
                id="clemi-loan-amount"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedLoanAmount : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="clemi-loan-currency"
                value={input.loanAmountCurrency}
                onChange={handleLoanCurrencyChange}
                aria-label="Loan amount currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="clemi-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Nominal annual percentage rate. Monthly rate r = APR / 1200. Never currency-converted."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="clemi-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(e) => set({ interestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="clemi-term-years">
            <span>Loan term</span>
            <InfoTooltip
              label="Loan term"
              text="Loan duration in years and months (0–11). Monthly payments n = years × 12 + months."
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FieldShell error={errors.termYears}>
              <input
                id="clemi-term-years"
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
                id="clemi-term-months"
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
          <label className={labelClass} htmlFor="clemi-monthly-payment">
            <span>Monthly payment</span>
            <InfoTooltip
              label="Monthly payment"
              text="Fixed amortizing EMI. Changing currency only re-expresses the payment for display."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.monthlyPaymentCurrency)}
              </span>
              <input
                id="clemi-monthly-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="clemi-monthly-payment-currency"
                value={input.monthlyPaymentCurrency}
                onChange={(next) =>
                  handleDisplayCurrencyChange('monthlyPaymentCurrency', next)
                }
                aria-label="Monthly payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="clemi-total-interest">
            <span>Total interest paid</span>
            <InfoTooltip
              label="Total interest paid"
              text="Total Interest = Monthly Payment × n − Loan Amount. Changing currency only re-expresses this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.totalInterestCurrency)}
              </span>
              <input
                id="clemi-total-interest"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalInterest : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="clemi-total-interest-currency"
                value={input.totalInterestCurrency}
                onChange={(next) =>
                  handleDisplayCurrencyChange('totalInterestCurrency', next)
                }
                aria-label="Total interest currency"
              />
            </div>
          </div>
        </div>

        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
