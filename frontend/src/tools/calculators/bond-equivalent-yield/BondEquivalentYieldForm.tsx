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
  BondEquivalentYieldFieldErrors,
  BondEquivalentYieldInput,
  BondEquivalentYieldResult,
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

interface BondEquivalentYieldFormProps {
  input: BondEquivalentYieldInput;
  errors: BondEquivalentYieldFieldErrors;
  result: BondEquivalentYieldResult | null;
  onChange: (input: BondEquivalentYieldInput) => void;
}

export function BondEquivalentYieldForm({
  input,
  errors,
  result,
  onChange,
}: BondEquivalentYieldFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const bondSymbol = getCurrencySymbol(input.bondPriceCurrency);
  const faceSymbol = getCurrencySymbol(input.faceValueCurrency);

  const set = (patch: Partial<BondEquivalentYieldInput>) => {
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

  const handleBondCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.bondPriceCurrency) return;

    const priceAmount = parseMoneyInput(input.bondPrice);
    const hasPrice = Number.isFinite(priceAmount);

    if (!hasPrice) {
      if (
        next !== input.faceValueCurrency &&
        !canConvertPair(next, input.faceValueCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, bondPriceCurrency: next });
      return;
    }

    if (!canConvertPair(input.bondPriceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      next !== input.faceValueCurrency &&
      !canConvertPair(next, input.faceValueCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount: priceAmount,
      from: input.bondPriceCurrency,
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
      bondPriceCurrency: next,
      bondPrice: moneyAmountToInputString(converted.amount),
    });
  };

  const handleFaceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.faceValueCurrency) return;

    const faceAmount = parseMoneyInput(input.faceValue);
    const hasFace = Number.isFinite(faceAmount);

    if (!hasFace) {
      if (
        input.bondPriceCurrency !== next &&
        !canConvertPair(input.bondPriceCurrency, next)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, faceValueCurrency: next });
      return;
    }

    if (!canConvertPair(input.faceValueCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.bondPriceCurrency !== next &&
      !canConvertPair(input.bondPriceCurrency, next)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount: faceAmount,
      from: input.faceValueCurrency,
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
      faceValueCurrency: next,
      faceValue: moneyAmountToInputString(converted.amount),
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
        <label className={labelClass} htmlFor="bey-bond-price">
          <span>Bond price</span>
          <InfoTooltip
            label="Bond price"
            text="Purchase price of the discount instrument. Must be positive and not exceed face value. Converted into face-value currency before BEY is computed."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.bondPrice}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {bondSymbol}
            </span>
            <input
              id="bey-bond-price"
              className={inputClass}
              inputMode="decimal"
              value={input.bondPrice}
              aria-invalid={Boolean(errors.bondPrice)}
              onChange={(e) => set({ bondPrice: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="bey-bond-currency"
              value={input.bondPriceCurrency}
              onChange={handleBondCurrencyChange}
              aria-label="Bond price currency"
            />
          </div>
        </div>
        {errors.bondPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.bondPrice}</p>
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
        <label className={labelClass} htmlFor="bey-face-value">
          <span>Face value</span>
          <InfoTooltip
            label="Face value"
            text="Redemption (par) value at maturity. Calculation currency for normalizing bond price. Must be positive."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.faceValue}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {faceSymbol}
            </span>
            <input
              id="bey-face-value"
              className={inputClass}
              inputMode="decimal"
              value={input.faceValue}
              aria-invalid={Boolean(errors.faceValue)}
              onChange={(e) => set({ faceValue: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="bey-face-currency"
              value={input.faceValueCurrency}
              onChange={handleFaceCurrencyChange}
              aria-label="Face value currency"
            />
          </div>
        </div>
        {errors.faceValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.faceValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bey-days">
          <span>Number of days to maturity</span>
          <InfoTooltip
            label="Days to maturity"
            text="Remaining calendar days until maturity. Must be positive. Never FX-converted. BEY annualizes with a 365-day year."
          />
        </label>
        <FieldShell error={errors.daysToMaturity}>
          <input
            id="bey-days"
            className={`${inputClass} pr-16`}
            inputMode="decimal"
            value={input.daysToMaturity}
            aria-invalid={Boolean(errors.daysToMaturity)}
            onChange={(e) => set({ daysToMaturity: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            day(s)
          </span>
        </FieldShell>
        {errors.daysToMaturity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.daysToMaturity}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bey-result">
          <span>Bond equivalent yield (BEY)</span>
          <InfoTooltip
            label="Bond equivalent yield"
            text="Investment-basis BEY: ((Face − Price) / Price) × (365 / Days) × 100. Not bank discount yield, YTM, or coupon current yield. Not FX-converted."
          />
        </label>
        <FieldShell muted>
          <input
            id="bey-result"
            className={`${inputClass} pr-8 font-semibold`}
            readOnly
            value={result?.formattedBeyPercent ?? ''}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
