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
  CouponPaymentFieldErrors,
  CouponPaymentInput,
  CouponPaymentResult,
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

interface CouponPaymentFormProps {
  input: CouponPaymentInput;
  errors: CouponPaymentFieldErrors;
  result: CouponPaymentResult | null;
  onChange: (input: CouponPaymentInput) => void;
}

export function CouponPaymentForm({
  input,
  errors,
  result,
  onChange,
}: CouponPaymentFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const faceSymbol = getCurrencySymbol(input.faceValueCurrency);
  const resultSymbol = getCurrencySymbol(input.couponPaymentCurrency);

  const set = (patch: Partial<CouponPaymentInput>) => {
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

  /** Convert face value + market price; leave result currency and non-money fields alone. */
  const handleFaceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.faceValueCurrency) return;

    const faceAmount = parseMoneyInput(input.faceValue);
    const marketAmount = parseMoneyInput(input.marketPrice);
    const hasFace = Number.isFinite(faceAmount);
    const hasMarket = Number.isFinite(marketAmount);

    if (!hasFace && !hasMarket) {
      if (
        input.couponPaymentCurrency !== next &&
        !canConvertPair(next, input.couponPaymentCurrency)
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
      input.couponPaymentCurrency !== next &&
      !canConvertPair(next, input.couponPaymentCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    let nextFace = input.faceValue;
    let nextMarket = input.marketPrice;

    if (hasFace) {
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
      nextFace = moneyAmountToInputString(converted.amount);
    }

    if (hasMarket) {
      const converted = convertCurrency({
        amount: marketAmount,
        from: input.faceValueCurrency,
        to: next,
        rates: rates.rates,
      });
      if (!converted.ok) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      nextMarket = moneyAmountToInputString(converted.amount);
    }

    setConversionError(null);
    onChange({
      ...input,
      faceValueCurrency: next,
      faceValue: nextFace,
      marketPrice: nextMarket,
    });
  };

  /** Change result display currency only — no change to face value, rate, or payments. */
  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.couponPaymentCurrency) return;

    if (!canConvertPair(input.faceValueCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({ ...input, couponPaymentCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Coupon Payment Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="cp-face-value">
            <span>Face value of bond</span>
            <InfoTooltip
              label="Face value of bond"
              text="Par value of the bond used to compute the annual coupon."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.faceValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {faceSymbol}
              </span>
              <input
                id="cp-face-value"
                className={inputClass}
                inputMode="decimal"
                value={input.faceValue}
                aria-invalid={Boolean(errors.faceValue)}
                onChange={(e) => set({ faceValue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cp-face-currency"
                value={input.faceValueCurrency}
                onChange={handleFaceCurrencyChange}
                aria-label="Face value currency"
              />
            </div>
          </div>
          {errors.faceValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.faceValue}</p>
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
          <label className={labelClass} htmlFor="cp-coupon-rate">
            <span>Annual coupon rate</span>
            <InfoTooltip
              label="Annual coupon rate"
              text="Nominal annual coupon rate as a percent of face value. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.annualCouponRatePercent}>
            <input
              id="cp-coupon-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualCouponRatePercent}
              aria-invalid={Boolean(errors.annualCouponRatePercent)}
              onChange={(e) => set({ annualCouponRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.annualCouponRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualCouponRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cp-payments">
            <span>Number of payments per annum</span>
            <InfoTooltip
              label="Number of payments per annum"
              text="How many coupon payments the bond makes each year (for example 2 for semi-annual)."
            />
          </label>
          <FieldShell error={errors.paymentsPerAnnum}>
            <input
              id="cp-payments"
              className={inputClass}
              inputMode="decimal"
              value={input.paymentsPerAnnum}
              aria-invalid={Boolean(errors.paymentsPerAnnum)}
              onChange={(e) => set({ paymentsPerAnnum: e.target.value })}
            />
          </FieldShell>
          {errors.paymentsPerAnnum ? (
            <p className="mt-1 text-xs text-rose-600">{errors.paymentsPerAnnum}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cp-coupon-payment">
            <span>Coupon payment</span>
            <InfoTooltip
              label="Coupon payment"
              text="Periodic payment = (Face Value × Rate / 100) ÷ payments per annum, then converted into the result currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {resultSymbol}
              </span>
              <input
                id="cp-coupon-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedCouponPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cp-result-currency"
                value={input.couponPaymentCurrency}
                onChange={handleResultCurrencyChange}
                aria-label="Coupon payment currency"
              />
            </div>
          </div>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.currentYieldOpen}
        onToggle={(event) => set({ currentYieldOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.currentYieldOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Current yield</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Optional. Current yield (%) = annual coupon ÷ market price × 100. Market price uses
            the face-value currency and converts with it.
          </p>
          <div>
            <label className={labelClass} htmlFor="cp-market-price">
              <span>Market price</span>
              <InfoTooltip
                label="Market price"
                text="Current market price of the bond in the face-value currency. Required only for current yield."
              />
            </label>
            <FieldShell error={errors.marketPrice}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {faceSymbol}
              </span>
              <input
                id="cp-market-price"
                className={inputClass}
                inputMode="decimal"
                value={input.marketPrice}
                aria-invalid={Boolean(errors.marketPrice)}
                onChange={(e) => set({ marketPrice: e.target.value })}
              />
            </FieldShell>
            {errors.marketPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.marketPrice}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="cp-current-yield">
              <span>Current yield</span>
              <InfoTooltip
                label="Current yield"
                text="Annual coupon divided by market price, as a percent. Not FX-converted."
              />
            </label>
            <FieldShell muted>
              <input
                id="cp-current-yield"
                className={`${inputClass} pr-8 font-semibold`}
                readOnly
                value={result?.formattedCurrentYieldPercent ?? ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
          </div>
        </div>
      </details>
    </form>
  );
}
