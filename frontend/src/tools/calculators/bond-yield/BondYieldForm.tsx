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
  COUPON_FREQUENCY_OPTIONS,
  type BondYieldFieldErrors,
  type BondYieldInput,
  type BondYieldResult,
  type CouponFrequency,
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

interface BondYieldFormProps {
  input: BondYieldInput;
  errors: BondYieldFieldErrors;
  result: BondYieldResult | null;
  onChange: (input: BondYieldInput) => void;
}

export function BondYieldForm({
  input,
  errors,
  result,
  onChange,
}: BondYieldFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const faceSymbol = getCurrencySymbol(input.faceValueCurrency);
  const bondSymbol = getCurrencySymbol(input.bondPriceCurrency);

  const set = (patch: Partial<BondYieldInput>) => {
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

  /** Convert face value amount; leave bond price and non-money fields alone. */
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

  /** Convert bond price when its own currency changes. */
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

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Bond Yield Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="by-face-value">
            <span>Face value</span>
            <InfoTooltip
              label="Face value"
              text="Par value of the bond. Changing currency converts this amount using live rates. Calculation currency for normalizing bond price."
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
                id="by-face-value"
                className={inputClass}
                inputMode="decimal"
                value={input.faceValue}
                aria-invalid={Boolean(errors.faceValue)}
                onChange={(e) => set({ faceValue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="by-face-currency"
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
          <label className={labelClass} htmlFor="by-bond-price">
            <span>Bond price</span>
            <InfoTooltip
              label="Bond price"
              text="Clean market price on a coupon date. Independent currency; converted into face-value currency before solving yield to maturity."
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
                id="by-bond-price"
                className={inputClass}
                inputMode="decimal"
                value={input.bondPrice}
                aria-invalid={Boolean(errors.bondPrice)}
                onChange={(e) => set({ bondPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="by-bond-currency"
                value={input.bondPriceCurrency}
                onChange={handleBondCurrencyChange}
                aria-label="Bond price currency"
              />
            </div>
          </div>
          {errors.bondPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bondPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="by-coupon-rate">
            <span>Annual coupon rate</span>
            <InfoTooltip
              label="Annual coupon rate"
              text="Annual coupon as a percent of face value. Zero is allowed (zero-coupon). Not FX-converted."
            />
          </label>
          <FieldShell error={errors.annualCouponRatePercent}>
            <input
              id="by-coupon-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualCouponRatePercent}
              aria-invalid={Boolean(errors.annualCouponRatePercent)}
              onChange={(e) => set({ annualCouponRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-primary">
              %
            </span>
          </FieldShell>
          {errors.annualCouponRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualCouponRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="by-frequency">
            <span>Coupon frequency</span>
            <InfoTooltip
              label="Coupon frequency"
              text="How often coupons are paid. Years × payments per year must be a whole number of periods. Not FX-converted."
            />
          </label>
          <select
            id="by-frequency"
            className={selectClass}
            value={input.couponFrequency}
            aria-invalid={Boolean(errors.couponFrequency)}
            onChange={(e) =>
              set({ couponFrequency: e.target.value as CouponFrequency })
            }
          >
            {COUPON_FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.couponFrequency ? (
            <p className="mt-1 text-xs text-rose-600">{errors.couponFrequency}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="by-years">
            <span>Years to maturity</span>
            <InfoTooltip
              label="Years to maturity"
              text="Remaining life in years on a coupon date. Must yield a whole number of coupon periods with the selected frequency. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.yearsToMaturity}>
            <input
              id="by-years"
              className={`${inputClass} pr-16`}
              inputMode="decimal"
              value={input.yearsToMaturity}
              aria-invalid={Boolean(errors.yearsToMaturity)}
              onChange={(e) => set({ yearsToMaturity: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-sm text-muted-foreground">
              year(s)
            </span>
          </FieldShell>
          {errors.yearsToMaturity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.yearsToMaturity}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="by-yield">
            <span>Bond yield</span>
            <InfoTooltip
              label="Bond yield"
              text="Annual nominal yield to maturity (YTM), not current yield. Solved numerically from the coupon-date price equation."
            />
          </label>
          <FieldShell muted>
            <input
              id="by-yield"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result?.formattedBondYieldPercent ?? ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-primary">
              %
            </span>
          </FieldShell>
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
