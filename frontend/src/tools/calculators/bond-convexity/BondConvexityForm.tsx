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
  COUPON_FREQUENCY_OPTIONS,
  type BondConvexityFieldErrors,
  type BondConvexityInput,
  type BondConvexityResult,
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

interface BondConvexityFormProps {
  input: BondConvexityInput;
  errors: BondConvexityFieldErrors;
  result: BondConvexityResult | null;
  onChange: (input: BondConvexityInput) => void;
}

export function BondConvexityForm({
  input,
  errors,
  result,
  onChange,
}: BondConvexityFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const faceSymbol = getCurrencySymbol(input.faceValueCurrency);
  const couponSymbol = getCurrencySymbol(input.couponPerPeriodCurrency);
  const annualSymbol = getCurrencySymbol(input.annualCouponCurrency);
  const priceSymbol = getCurrencySymbol(input.bondPriceCurrency);

  const set = (patch: Partial<BondConvexityInput>) => {
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

  /** Convert face value; leave result currencies and non-money fields alone. */
  const handleFaceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.faceValueCurrency) return;

    const amount = parseMoneyInput(input.faceValue);
    const hasFace = Number.isFinite(amount);

    if (!hasFace) {
      if (
        (input.couponPerPeriodCurrency !== next &&
          !canConvertPair(next, input.couponPerPeriodCurrency)) ||
        (input.annualCouponCurrency !== next &&
          !canConvertPair(next, input.annualCouponCurrency)) ||
        (input.bondPriceCurrency !== next &&
          !canConvertPair(next, input.bondPriceCurrency))
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
      (input.couponPerPeriodCurrency !== next &&
        !canConvertPair(next, input.couponPerPeriodCurrency)) ||
      (input.annualCouponCurrency !== next &&
        !canConvertPair(next, input.annualCouponCurrency)) ||
      (input.bondPriceCurrency !== next &&
        !canConvertPair(next, input.bondPriceCurrency))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
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

  /** Change a result display currency only — no change to face/rates/years. */
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
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.couponSectionOpen}
        onToggle={(event) => set({ couponSectionOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.couponSectionOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Coupon per period</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="bc-face-value">
              <span>Face value</span>
              <InfoTooltip
                label="Face value"
                text="Par value of the bond. Changing currency converts this amount using live rates."
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
                  id="bc-face-value"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.faceValue}
                  aria-invalid={Boolean(errors.faceValue)}
                  onChange={(e) => set({ faceValue: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="bc-face-currency"
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
            <label className={labelClass} htmlFor="bc-coupon-rate">
              <span>Annual coupon rate</span>
              <InfoTooltip
                label="Annual coupon rate"
                text="Nominal annual coupon rate as a percent of face value. Not FX-converted. Zero is allowed (zero-coupon bond)."
              />
            </label>
            <FieldShell error={errors.annualCouponRatePercent}>
              <input
                id="bc-coupon-rate"
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
              <p className="mt-1 text-xs text-rose-600">
                {errors.annualCouponRatePercent}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bc-frequency">
              <span>Coupon frequency</span>
              <InfoTooltip
                label="Coupon frequency"
                text="How often coupons are paid. Sets payments per year for the coupon, price, and convexity math."
              />
            </label>
            <select
              id="bc-frequency"
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
            <label className={labelClass} htmlFor="bc-coupon-per-period">
              <span>Coupon per period</span>
              <InfoTooltip
                label="Coupon per period"
                text="Face × annual coupon rate ÷ payments per year, then converted into the result currency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {couponSymbol}
                </span>
                <input
                  id="bc-coupon-per-period"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedCouponPerPeriod : ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="bc-coupon-currency"
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
            <label className={labelClass} htmlFor="bc-annual-coupon">
              <span>Annual coupon</span>
              <InfoTooltip
                label="Annual coupon"
                text="Face × annual coupon rate, then converted into the result currency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {annualSymbol}
                </span>
                <input
                  id="bc-annual-coupon"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedAnnualCoupon : ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="bc-annual-currency"
                  value={input.annualCouponCurrency}
                  onChange={(next) =>
                    handleResultCurrencyChange('annualCouponCurrency', next)
                  }
                  aria-label="Annual coupon currency"
                />
              </div>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.priceSectionOpen}
        onToggle={(event) => set({ priceSectionOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.priceSectionOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Bond price</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="bc-years">
              <span>Years to maturity</span>
              <InfoTooltip
                label="Years to maturity"
                text="Remaining life of the bond in years. Period count = years × payments per year. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.yearsToMaturity}>
              <input
                id="bc-years"
                className={`${inputClass} pr-16`}
                inputMode="decimal"
                value={input.yearsToMaturity}
                aria-invalid={Boolean(errors.yearsToMaturity)}
                onChange={(e) => set({ yearsToMaturity: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                year(s)
              </span>
            </FieldShell>
            {errors.yearsToMaturity ? (
              <p className="mt-1 text-xs text-rose-600">{errors.yearsToMaturity}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bc-ytm">
              <span>Yield to maturity</span>
              <InfoTooltip
                label="Yield to maturity"
                text="Annual yield used as the discount rate (nominal, compounded with coupon frequency). Not FX-converted."
              />
            </label>
            <FieldShell error={errors.yieldToMaturityPercent}>
              <input
                id="bc-ytm"
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
              <p className="mt-1 text-xs text-rose-600">
                {errors.yieldToMaturityPercent}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bc-bond-price">
              <span>Bond price</span>
              <InfoTooltip
                label="Bond price"
                text="Present value of future coupons plus face value, then converted into the result currency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {priceSymbol}
                </span>
                <input
                  id="bc-bond-price"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedBondPrice : ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="bc-price-currency"
                  value={input.bondPriceCurrency}
                  onChange={(next) =>
                    handleResultCurrencyChange('bondPriceCurrency', next)
                  }
                  aria-label="Bond price currency"
                />
              </div>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.convexitySectionOpen}
        onToggle={(event) =>
          set({ convexitySectionOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.convexitySectionOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Bond convexity</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="bc-yield-diff">
              <span>Yield differential</span>
              <InfoTooltip
                label="Yield differential"
                text="Annual yield bump Δy used for finite-difference convexity. Entered as a percent (0.01 = 1 basis point). Must be greater than zero. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.yieldDifferentialPercent}>
              <input
                id="bc-yield-diff"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.yieldDifferentialPercent}
                aria-invalid={Boolean(errors.yieldDifferentialPercent)}
                onChange={(e) =>
                  set({ yieldDifferentialPercent: e.target.value })
                }
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.yieldDifferentialPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.yieldDifferentialPercent}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bc-convexity">
              <span>Bond convexity</span>
              <InfoTooltip
                label="Bond convexity"
                text="Finite-difference convexity (P₋ + P₊ − 2P₀) / (P₀ (Δy)²) in annual-yield units. Dimensionless; not FX-converted. Not analytic Macaulay convexity."
              />
            </label>
            <FieldShell muted>
              <input
                id="bc-convexity"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedBondConvexity : ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        </div>
      </details>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
