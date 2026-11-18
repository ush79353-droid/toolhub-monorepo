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
  type BondPriceFieldErrors,
  type BondPriceInput,
  type BondPriceResult,
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

interface BondPriceFormProps {
  input: BondPriceInput;
  errors: BondPriceFieldErrors;
  result: BondPriceResult | null;
  onChange: (input: BondPriceInput) => void;
}

export function BondPriceForm({
  input,
  errors,
  result,
  onChange,
}: BondPriceFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const faceSymbol = getCurrencySymbol(input.faceValueCurrency);
  const couponPeriodSymbol = getCurrencySymbol(input.couponPerPeriodCurrency);
  const annualCouponSymbol = getCurrencySymbol(input.annualCouponCurrency);
  const bondPriceSymbol = getCurrencySymbol(input.bondPriceCurrency);

  const set = (patch: Partial<BondPriceInput>) => {
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

  const resultCurrenciesOkForFace = (nextFace: SupportedCurrency) =>
    (input.couponPerPeriodCurrency === nextFace ||
      canConvertPair(nextFace, input.couponPerPeriodCurrency)) &&
    (input.annualCouponCurrency === nextFace ||
      canConvertPair(nextFace, input.annualCouponCurrency)) &&
    (input.bondPriceCurrency === nextFace ||
      canConvertPair(nextFace, input.bondPriceCurrency));

  /** Convert face value; leave result currencies and non-money fields alone. */
  const handleFaceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.faceValueCurrency) return;

    const faceAmount = parseMoneyInput(input.faceValue);
    if (!Number.isFinite(faceAmount)) {
      if (!resultCurrenciesOkForFace(next)) {
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
    if (!resultCurrenciesOkForFace(next)) {
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

  const handleResultCurrencyChange = (
    field: 'couponPerPeriodCurrency' | 'annualCouponCurrency' | 'bondPriceCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.faceValueCurrency, next)) {
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
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Coupon per period
        </legend>

        <div>
          <label className={labelClass} htmlFor="bp-face-value">
            <span>Face value</span>
            <InfoTooltip
              label="Face value"
              text="Par value of the bond. Changing this currency converts the face amount; rates and years are never converted."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.faceValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {faceSymbol}
              </span>
              <input
                id="bp-face-value"
                className={inputClass}
                inputMode="decimal"
                value={input.faceValue}
                aria-invalid={Boolean(errors.faceValue)}
                onChange={(e) => set({ faceValue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bp-face-currency"
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
          <label className={labelClass} htmlFor="bp-coupon-rate">
            <span>Annual coupon rate</span>
            <InfoTooltip
              label="Annual coupon rate"
              text="Nominal annual coupon rate as a percent of face value. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.annualCouponRatePercent}>
            <input
              id="bp-coupon-rate"
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
          <label className={labelClass} htmlFor="bp-coupon-frequency">
            <span>Coupon frequency</span>
            <InfoTooltip
              label="Coupon frequency"
              text="How many coupon payments the bond makes each year. Not FX-converted."
            />
          </label>
          <select
            id="bp-coupon-frequency"
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
          <label className={labelClass} htmlFor="bp-coupon-per-period">
            <span>Coupon per period</span>
            <InfoTooltip
              label="Coupon per period"
              text="Face × rate / payments per year, then converted into this field’s currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {couponPeriodSymbol}
              </span>
              <input
                id="bp-coupon-per-period"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedCouponPerPeriod : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bp-coupon-period-currency"
                value={input.couponPerPeriodCurrency}
                onChange={(next) =>
                  handleResultCurrencyChange('couponPerPeriodCurrency', next)
                }
                aria-label="Coupon per period currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="bp-annual-coupon">
            <span>Annual Coupon</span>
            <InfoTooltip
              label="Annual Coupon"
              text="Face × annual coupon rate, then converted into this field’s currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {annualCouponSymbol}
              </span>
              <input
                id="bp-annual-coupon"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedAnnualCoupon : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bp-annual-coupon-currency"
                value={input.annualCouponCurrency}
                onChange={(next) =>
                  handleResultCurrencyChange('annualCouponCurrency', next)
                }
                aria-label="Annual coupon currency"
              />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Bond price</legend>

        <div>
          <label className={labelClass} htmlFor="bp-years">
            <span>Years to maturity</span>
            <InfoTooltip
              label="Years to maturity"
              text="Remaining life of the bond in years. Years × frequency must be a whole number of coupon periods. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.yearsToMaturity}>
            <input
              id="bp-years"
              className={`${inputClass} pr-16`}
              inputMode="decimal"
              value={input.yearsToMaturity}
              aria-invalid={Boolean(errors.yearsToMaturity)}
              onChange={(e) => set({ yearsToMaturity: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs text-muted-foreground">
              year(s)
            </span>
          </FieldShell>
          {errors.yearsToMaturity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.yearsToMaturity}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bp-ytm">
            <span>Yield to maturity (YTM)</span>
            <InfoTooltip
              label="Yield to maturity (YTM)"
              text="Annual yield used to discount coupons and principal. Zero YTM uses the undiscounted sum of cash flows. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.yieldToMaturityPercent}>
            <input
              id="bp-ytm"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.yieldToMaturityPercent}
              aria-invalid={Boolean(errors.yieldToMaturityPercent)}
              onChange={(e) => set({ yieldToMaturityPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.yieldToMaturityPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.yieldToMaturityPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bp-bond-price">
            <span>Bond price</span>
            <InfoTooltip
              label="Bond price"
              text="Present value of coupons plus principal under the regular coupon-date (clean price) assumption, then converted into this field’s currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {bondPriceSymbol}
              </span>
              <input
                id="bp-bond-price"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedBondPrice : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bp-bond-price-currency"
                value={input.bondPriceCurrency}
                onChange={(next) =>
                  handleResultCurrencyChange('bondPriceCurrency', next)
                }
                aria-label="Bond price currency"
              />
            </div>
          </div>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
