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
  RevenueDraft,
  RevenueFieldErrors,
  RevenueResult,
  RevenueSolveTarget,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface RevenueFormProps {
  input: RevenueDraft;
  errors: RevenueFieldErrors;
  result: RevenueResult | null;
  onChange: (input: RevenueDraft) => void;
}

export function RevenueForm({ input, errors, result, onChange }: RevenueFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const priceSymbol = getCurrencySymbol(input.priceCurrency);
  const revenueSymbol = getCurrencySymbol(input.totalRevenueCurrency);

  const displayPrice =
    result && result.solvedField === 'price' ? result.formattedPrice : input.price;
  const displayQuantity =
    result && result.solvedField === 'quantity'
      ? result.formattedQuantity
      : input.quantity;
  const displayRevenue =
    result && result.solvedField === 'totalRevenue'
      ? result.formattedTotalRevenue
      : input.totalRevenue;

  const setField = (field: RevenueSolveTarget, value: string) => {
    setConversionError(null);
    onChange({
      ...input,
      [field === 'totalRevenue' ? 'totalRevenue' : field]: value,
      lastEdited: field,
      solveFor: field,
    });
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const handlePriceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.priceCurrency) return;
    const amount = parseMoneyInput(input.price);
    if (!Number.isFinite(amount)) {
      if (
        input.totalRevenueCurrency !== next &&
        !canConvertPair(next, input.totalRevenueCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, priceCurrency: next, lastEdited: 'price' });
      return;
    }
    if (!canConvertPair(input.priceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertCurrency({
      amount,
      from: input.priceCurrency,
      to: next,
      rates: rates.rates,
    });
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      priceCurrency: next,
      price: moneyAmountToInputString(converted.amount),
      lastEdited: 'price',
    });
  };

  const handleRevenueCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalRevenueCurrency) return;
    const amount = parseMoneyInput(input.totalRevenue);
    if (!Number.isFinite(amount)) {
      if (!canConvertPair(input.priceCurrency, next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, totalRevenueCurrency: next, lastEdited: 'totalRevenue' });
      return;
    }
    if (!canConvertPair(input.totalRevenueCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertCurrency({
      amount,
      from: input.totalRevenueCurrency,
      to: next,
      rates: rates.rates,
    });
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      totalRevenueCurrency: next,
      totalRevenue: moneyAmountToInputString(converted.amount),
      lastEdited: 'totalRevenue',
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="revenue-price">
          <span>Price</span>
          <InfoTooltip
            label="Price"
            text="Unit price. Leave blank to solve for price. Changing currency converts this amount."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.price} muted={result?.solvedField === 'price'}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {priceSymbol}
            </span>
            <input
              id="revenue-price"
              className={inputClass}
              inputMode="decimal"
              value={displayPrice}
              aria-invalid={Boolean(errors.price)}
              onChange={(e) => setField('price', e.target.value)}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="revenue-price-currency"
              value={input.priceCurrency}
              onChange={handlePriceCurrencyChange}
              aria-label="Price currency"
            />
          </div>
        </div>
        {errors.price ? <p className="mt-1 text-xs text-rose-600">{errors.price}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="revenue-quantity">
          <span>Quantity</span>
          <InfoTooltip
            label="Quantity"
            text="Units sold. Leave blank to solve for quantity. Never FX-converted. Fractional values allowed."
          />
        </label>
        <FieldShell error={errors.quantity} muted={result?.solvedField === 'quantity'}>
          <input
            id="revenue-quantity"
            className={inputClass}
            inputMode="decimal"
            value={displayQuantity}
            aria-invalid={Boolean(errors.quantity)}
            onChange={(e) => setField('quantity', e.target.value)}
          />
        </FieldShell>
        {errors.quantity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="revenue-total">
          <span>Total revenue</span>
          <InfoTooltip
            label="Total revenue"
            text="Price × Quantity in the selected display currency. Leave blank to solve for total revenue."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell
            error={errors.totalRevenue}
            muted={result?.solvedField === 'totalRevenue'}
          >
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {revenueSymbol}
            </span>
            <input
              id="revenue-total"
              className={`${inputClass} font-semibold`}
              inputMode="decimal"
              value={displayRevenue}
              aria-invalid={Boolean(errors.totalRevenue)}
              onChange={(e) => setField('totalRevenue', e.target.value)}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="revenue-total-currency"
              value={input.totalRevenueCurrency}
              onChange={handleRevenueCurrencyChange}
              aria-label="Total revenue currency"
            />
          </div>
        </div>
        {errors.totalRevenue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.totalRevenue}</p>
        ) : null}
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
    </form>
  );
}
