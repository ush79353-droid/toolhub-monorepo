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
  fromAnnualRentalIncome,
  toAnnualRentalIncome,
} from './calculation';
import {
  RENT_PERIOD_OPTIONS,
  type GrossRentMultiplierFieldErrors,
  type GrossRentMultiplierInput,
  type GrossRentMultiplierResult,
  type RentPeriod,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-white px-2 pr-7 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

interface GrossRentMultiplierFormProps {
  input: GrossRentMultiplierInput;
  errors: GrossRentMultiplierFieldErrors;
  result: GrossRentMultiplierResult | null;
  onChange: (input: GrossRentMultiplierInput) => void;
}

export function GrossRentMultiplierForm({
  input,
  errors,
  result,
  onChange,
}: GrossRentMultiplierFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const priceSymbol = getCurrencySymbol(input.propertyPriceCurrency);
  const incomeSymbol = getCurrencySymbol(input.grossRentalIncomeCurrency);

  const set = (patch: Partial<GrossRentMultiplierInput>) => {
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

  const handlePropertyCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.propertyPriceCurrency) return;
    const amount = parseMoneyInput(input.propertyPrice);
    if (!Number.isFinite(amount)) {
      if (
        input.grossRentalIncomeCurrency !== next &&
        !canConvertPair(next, input.grossRentalIncomeCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      set({ propertyPriceCurrency: next });
      return;
    }
    if (!canConvertPair(input.propertyPriceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.grossRentalIncomeCurrency !== next &&
      !canConvertPair(next, input.grossRentalIncomeCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertFieldAmount(amount, input.propertyPriceCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({
      propertyPriceCurrency: next,
      propertyPrice: moneyAmountToInputString(converted),
    });
  };

  const handleIncomeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.grossRentalIncomeCurrency) return;
    const amount = parseMoneyInput(input.grossRentalIncome);
    if (!Number.isFinite(amount)) {
      set({ grossRentalIncomeCurrency: next });
      return;
    }
    if (!canConvertPair(input.grossRentalIncomeCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertFieldAmount(
      amount,
      input.grossRentalIncomeCurrency,
      next
    );
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({
      grossRentalIncomeCurrency: next,
      grossRentalIncome: moneyAmountToInputString(converted),
    });
  };

  const handleRentPeriodChange = (next: RentPeriod) => {
    if (next === input.rentPeriod) return;
    const amount = parseMoneyInput(input.grossRentalIncome);
    if (!Number.isFinite(amount) || !(amount > 0)) {
      set({ rentPeriod: next });
      return;
    }
    const annual = toAnnualRentalIncome(amount, input.rentPeriod);
    if (annual === null) {
      set({ rentPeriod: next });
      return;
    }
    const reexpressed = fromAnnualRentalIncome(annual, next);
    if (reexpressed === null) {
      set({ rentPeriod: next });
      return;
    }
    set({
      rentPeriod: next,
      grossRentalIncome: moneyAmountToInputString(reexpressed),
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
        <label className={labelClass} htmlFor="grm-property-price">
          <span>Property price</span>
          <InfoTooltip
            label="Property price"
            text="Asking price or fair market value of the rental property."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.propertyPrice}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {priceSymbol}
            </span>
            <input
              id="grm-property-price"
              className={inputClass}
              inputMode="decimal"
              value={input.propertyPrice}
              aria-invalid={Boolean(errors.propertyPrice)}
              onChange={(e) => set({ propertyPrice: e.target.value })}
            />
          </FieldShell>
          <div className="w-[100px] shrink-0 sm:w-[110px]">
            <CurrencySelect
              id="grm-property-price-currency"
              value={input.propertyPriceCurrency}
              onChange={handlePropertyCurrencyChange}
              aria-label="Property price currency"
            />
          </div>
        </div>
        {errors.propertyPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.propertyPrice}</p>
        ) : null}
        {conversionError ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="mt-1 text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="grm-rental-income">
          <span>Gross rental income</span>
          <InfoTooltip
            label="Gross rental income"
            text="Total rent collected before expenses. Choose monthly or yearly; the calculator annualizes before computing GRM."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.grossRentalIncome}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {incomeSymbol}
            </span>
            <input
              id="grm-rental-income"
              className={inputClass}
              inputMode="decimal"
              value={input.grossRentalIncome}
              aria-invalid={Boolean(errors.grossRentalIncome)}
              onChange={(e) => set({ grossRentalIncome: e.target.value })}
            />
          </FieldShell>
          <div className="w-[100px] shrink-0 sm:w-[110px]">
            <CurrencySelect
              id="grm-rental-income-currency"
              value={input.grossRentalIncomeCurrency}
              onChange={handleIncomeCurrencyChange}
              aria-label="Gross rental income currency"
            />
          </div>
          <div className="relative w-[72px] shrink-0">
            <select
              id="grm-rent-period"
              className={selectClass}
              value={input.rentPeriod}
              aria-label="Gross rental income period"
              onChange={(e) => handleRentPeriodChange(e.target.value as RentPeriod)}
            >
              {RENT_PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
        {errors.grossRentalIncome ? (
          <p className="mt-1 text-xs text-rose-600">{errors.grossRentalIncome}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="grm-result">
          Gross rent multiplier
        </label>
        <FieldShell muted>
          <input
            id="grm-result"
            className={`${inputClass} font-semibold`}
            readOnly
            value={result ? result.formattedGrossRentMultiplier : ''}
            aria-live="polite"
          />
        </FieldShell>
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
