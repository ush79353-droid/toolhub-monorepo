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
  JumboLoanFieldErrors,
  JumboLoanInput,
  JumboLoanResult,
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

interface JumboLoanFormProps {
  input: JumboLoanInput;
  errors: JumboLoanFieldErrors;
  result: JumboLoanResult | null;
  onChange: (input: JumboLoanInput) => void;
}

export function JumboLoanForm({
  input,
  errors,
  result,
  onChange,
}: JumboLoanFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const set = (patch: Partial<JumboLoanInput>) => {
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
    propertyPrice: string,
    propertyCurrency: SupportedCurrency,
    percentRaw: string,
    downCurrency: SupportedCurrency
  ): string => {
    const price = parseMoneyInput(propertyPrice);
    const pct = Number(String(percentRaw).trim().replace(/,/g, ''));
    if (!Number.isFinite(price) || !Number.isFinite(pct) || price <= 0) return '';
    const downInProperty = price * (pct / 100);
    const converted = convertAmount(downInProperty, propertyCurrency, downCurrency);
    return converted === null ? '' : moneyAmountToInputString(converted);
  };

  const handlePropertyCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.propertyPriceCurrency) return;
    const amount = parseMoneyInput(input.propertyPrice);
    if (!Number.isFinite(amount)) {
      if (
        input.downPaymentCurrency !== next &&
        !canConvertPair(next, input.downPaymentCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, propertyPriceCurrency: next });
      return;
    }
    const converted = convertAmount(amount, input.propertyPriceCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const nextPrice = moneyAmountToInputString(converted);
    const nextDown =
      input.downPaymentSource === 'percent'
        ? syncDownFromPercent(
            nextPrice,
            next,
            input.downPaymentPercent,
            input.downPaymentCurrency
          )
        : input.downPayment;
    setConversionError(null);
    onChange({
      ...input,
      propertyPriceCurrency: next,
      propertyPrice: nextPrice,
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
    field: 'jumboLoanAmountCurrency' | 'monthlyPaymentCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.propertyPriceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next });
  };

  const handlePropertyPriceChange = (raw: string) => {
    const nextDown =
      input.downPaymentSource === 'percent'
        ? syncDownFromPercent(
            raw,
            input.propertyPriceCurrency,
            input.downPaymentPercent,
            input.downPaymentCurrency
          )
        : input.downPayment;
    set({
      propertyPrice: raw,
      downPayment: nextDown,
      downPaymentSource: input.downPaymentSource,
    });
  };

  const handlePercentChange = (raw: string) => {
    const nextDown = syncDownFromPercent(
      input.propertyPrice,
      input.propertyPriceCurrency,
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
    const price = parseMoneyInput(input.propertyPrice);
    const downRaw = parseMoneyInput(raw);
    let percent = input.downPaymentPercent;
    if (Number.isFinite(price) && price > 0 && Number.isFinite(downRaw)) {
      const downInProperty = convertAmount(
        downRaw,
        input.downPaymentCurrency,
        input.propertyPriceCurrency
      );
      if (downInProperty !== null) {
        percent = moneyAmountToInputString((downInProperty / price) * 100);
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
          <label className={labelClass} htmlFor="jl-property-price">
            <span>Property price</span>
            <InfoTooltip
              label="Property price"
              text="Purchase price of the property. Must be greater than zero. Changing currency converts this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.propertyPrice}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.propertyPriceCurrency)}
              </span>
              <input
                id="jl-property-price"
                className={inputClass}
                inputMode="decimal"
                value={input.propertyPrice}
                aria-invalid={Boolean(errors.propertyPrice)}
                onChange={(e) => handlePropertyPriceChange(e.target.value)}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="jl-property-currency"
                value={input.propertyPriceCurrency}
                onChange={handlePropertyCurrencyChange}
                aria-label="Property price currency"
              />
            </div>
          </div>
          {errors.propertyPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.propertyPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="jl-down-payment">
            <span>Down payment</span>
            <InfoTooltip
              label="Down payment"
              text="Cash paid upfront. Editing percentage updates this amount; editing this amount updates the percentage."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.downPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.downPaymentCurrency)}
              </span>
              <input
                id="jl-down-payment"
                className={inputClass}
                inputMode="decimal"
                value={input.downPayment}
                aria-invalid={Boolean(errors.downPayment)}
                onChange={(e) => handleDownAmountChange(e.target.value)}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="jl-down-currency"
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
          <label className={labelClass} htmlFor="jl-down-percent">
            <span>Down payment percentage</span>
            <InfoTooltip
              label="Down payment percentage"
              text="Share of property price paid upfront (0–100%). Never currency-converted."
            />
          </label>
          <FieldShell error={errors.downPaymentPercent}>
            <input
              id="jl-down-percent"
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
          <label className={labelClass} htmlFor="jl-loan-amount">
            <span>Jumbo loan amount</span>
            <InfoTooltip
              label="Jumbo loan amount"
              text="Financed principal = property price − down payment. Display currency only re-expresses this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.jumboLoanAmountCurrency)}
              </span>
              <input
                id="jl-loan-amount"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedJumboLoanAmount : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="jl-loan-currency"
                value={input.jumboLoanAmountCurrency}
                onChange={(next) =>
                  handleDisplayCurrencyChange('jumboLoanAmountCurrency', next)
                }
                aria-label="Jumbo loan amount currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="jl-term-years">
            <span>Loan term</span>
            <InfoTooltip
              label="Loan term"
              text="Loan duration in years and months (0–11). Monthly payments n = years × 12 + months."
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FieldShell error={errors.termYears}>
              <input
                id="jl-term-years"
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
                id="jl-term-months"
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
          <label className={labelClass} htmlFor="jl-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Nominal annual percentage rate. Monthly rate r = APR / 1200. Never currency-converted."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="jl-rate"
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
          <label className={labelClass} htmlFor="jl-first-day">
            <span>First day</span>
            <InfoTooltip
              label="First day"
              text="Date of the first monthly payment. Used to estimate the payoff date (first day + n months)."
            />
          </label>
          <FieldShell error={errors.firstDay}>
            <input
              id="jl-first-day"
              type="date"
              className={inputClass}
              value={input.firstDay}
              aria-invalid={Boolean(errors.firstDay)}
              onChange={(e) => set({ firstDay: e.target.value })}
            />
          </FieldShell>
          {errors.firstDay ? (
            <p className="mt-1 text-xs text-rose-600">{errors.firstDay}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="jl-monthly-payment">
            <span>Monthly payment</span>
            <InfoTooltip
              label="Monthly payment"
              text="Fixed amortizing principal-and-interest payment. Changing currency only re-expresses the payment for display."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.monthlyPaymentCurrency)}
              </span>
              <input
                id="jl-monthly-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="jl-monthly-payment-currency"
                value={input.monthlyPaymentCurrency}
                onChange={(next) =>
                  handleDisplayCurrencyChange('monthlyPaymentCurrency', next)
                }
                aria-label="Monthly payment currency"
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
