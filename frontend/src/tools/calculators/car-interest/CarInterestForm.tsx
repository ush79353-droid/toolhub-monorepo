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
import type {
  CarInterestFieldErrors,
  CarInterestInput,
  CarInterestResult,
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

interface CarInterestFormProps {
  input: CarInterestInput;
  errors: CarInterestFieldErrors;
  result: CarInterestResult | null;
  onChange: (input: CarInterestInput) => void;
}

export function CarInterestForm({
  input,
  errors,
  result,
  onChange,
}: CarInterestFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [loanAmountOpen, setLoanAmountOpen] = React.useState(true);
  const [interestOpen, setInterestOpen] = React.useState(true);

  const set = (patch: Partial<CarInterestInput>) => {
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
      [input.downPaymentCurrency, nextCalc],
      [input.tradeInCurrency, nextCalc],
      [nextCalc, input.monthlyPaymentCurrency],
      [nextCalc, input.totalInterestCurrency],
    ];
    return pairs.every(([from, to]) => canConvertPair(from, to));
  };

  const handleInputCurrencyChange = (
    field: 'carPrice' | 'downPayment' | 'tradeInValue',
    currencyField:
      | 'carPriceCurrency'
      | 'downPaymentCurrency'
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
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Calculate the loan amount</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          aria-expanded={loanAmountOpen}
          onClick={() => setLoanAmountOpen((open) => !open)}
        >
          <span className="text-[13px] font-semibold text-accent">
            Calculate the loan amount
          </span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform ${
              loanAmountOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {loanAmountOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="ci-car-price">
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
                    id="ci-car-price"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.carPrice}
                    aria-invalid={Boolean(errors.carPrice)}
                    onChange={(e) => set({ carPrice: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ci-car-price-currency"
                    value={input.carPriceCurrency}
                    onChange={(next) =>
                      handleInputCurrencyChange(
                        'carPrice',
                        'carPriceCurrency',
                        next
                      )
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
              <label className={labelClass} htmlFor="ci-down">
                <span>Down payment</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.downPayment}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {getCurrencySymbol(input.downPaymentCurrency)}
                  </span>
                  <input
                    id="ci-down"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.downPayment}
                    aria-invalid={Boolean(errors.downPayment)}
                    onChange={(e) => set({ downPayment: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ci-down-currency"
                    value={input.downPaymentCurrency}
                    onChange={(next) =>
                      handleInputCurrencyChange(
                        'downPayment',
                        'downPaymentCurrency',
                        next
                      )
                    }
                    aria-label="Down payment currency"
                  />
                </div>
              </div>
              {errors.downPayment ? (
                <p className="mt-1 text-xs text-rose-600">{errors.downPayment}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ci-trade-in">
                <span>Trade-in value</span>
                <InfoTooltip
                  label="Trade-in value"
                  text="Credit applied from trading in another vehicle. Subtracted with the down payment from the car price."
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
                    id="ci-trade-in"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.tradeInValue}
                    aria-invalid={Boolean(errors.tradeInValue)}
                    onChange={(e) => set({ tradeInValue: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ci-trade-in-currency"
                    value={input.tradeInCurrency}
                    onChange={(next) =>
                      handleInputCurrencyChange(
                        'tradeInValue',
                        'tradeInCurrency',
                        next
                      )
                    }
                    aria-label="Trade-in value currency"
                  />
                </div>
              </div>
              {errors.tradeInValue ? (
                <p className="mt-1 text-xs text-rose-600">{errors.tradeInValue}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Car interest</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          aria-expanded={interestOpen}
          onClick={() => setInterestOpen((open) => !open)}
        >
          <span className="text-[13px] font-semibold text-accent">Car interest</span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform ${
              interestOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {interestOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="ci-loan-amount">
                <span>Loan amount</span>
                <InfoTooltip
                  label="Loan amount"
                  text="Car price − down payment − trade-in, after converting those amounts into this currency."
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
                    id="ci-loan-amount"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result ? result.formattedLoanAmount : ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ci-loan-currency"
                    value={input.loanAmountCurrency}
                    onChange={handleLoanCurrencyChange}
                    aria-label="Loan amount currency"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="ci-rate">
                <span>Interest rate</span>
                <InfoTooltip
                  label="Interest rate"
                  text="Nominal annual percentage rate. Monthly rate r = APR / 1200. Never currency-converted."
                />
              </label>
              <FieldShell error={errors.interestRatePercent}>
                <input
                  id="ci-rate"
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
                <p className="mt-1 text-xs text-rose-600">
                  {errors.interestRatePercent}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ci-term-years">
                <span>Loan term</span>
                <InfoTooltip
                  label="Loan term"
                  text="Years and months. Payment count n = years × 12 + months. Not FX-converted."
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <FieldShell error={errors.termYears}>
                  <input
                    id="ci-term-years"
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
                    id="ci-term-months"
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
              {errors.termYears || errors.termMonths ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.termYears || errors.termMonths}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ci-monthly">
                <span>Monthly payment</span>
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
                    id="ci-monthly"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result ? result.formattedMonthlyPayment : ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ci-monthly-currency"
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
              <label className={labelClass} htmlFor="ci-interest">
                <span>Total interest</span>
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
                    id="ci-interest"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result ? result.formattedTotalInterest : ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ci-interest-currency"
                    value={input.totalInterestCurrency}
                    onChange={(next) =>
                      handleDisplayCurrencyChange('totalInterestCurrency', next)
                    }
                    aria-label="Total interest currency"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </fieldset>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesStatus.warning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
