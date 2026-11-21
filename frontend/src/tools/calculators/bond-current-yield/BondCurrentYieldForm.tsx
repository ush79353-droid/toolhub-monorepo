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
  type BondCurrentYieldFieldErrors,
  type BondCurrentYieldInput,
  type BondCurrentYieldResult,
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

interface BondCurrentYieldFormProps {
  input: BondCurrentYieldInput;
  errors: BondCurrentYieldFieldErrors;
  result: BondCurrentYieldResult | null;
  onChange: (input: BondCurrentYieldInput) => void;
}

export function BondCurrentYieldForm({
  input,
  errors,
  result,
  onChange,
}: BondCurrentYieldFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const faceSymbol = getCurrencySymbol(input.faceValueCurrency);
  const periodSymbol = getCurrencySymbol(input.couponPerPeriodCurrency);
  const annualSymbol = getCurrencySymbol(input.annualCouponCurrency);
  const bondSymbol = getCurrencySymbol(input.bondPriceCurrency);

  const set = (patch: Partial<BondCurrentYieldInput>) => {
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

  const ensureResultCurrenciesReachable = (calcCurrency: SupportedCurrency) => {
    if (
      input.couponPerPeriodCurrency !== calcCurrency &&
      !canConvertPair(calcCurrency, input.couponPerPeriodCurrency)
    ) {
      return false;
    }
    if (
      input.annualCouponCurrency !== calcCurrency &&
      !canConvertPair(calcCurrency, input.annualCouponCurrency)
    ) {
      return false;
    }
    return true;
  };

  /** Convert face value; leave bond price and non-money fields alone. */
  const handleFaceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.faceValueCurrency) return;

    const faceAmount = parseMoneyInput(input.faceValue);
    const hasFace = Number.isFinite(faceAmount);

    if (!hasFace) {
      if (
        (input.bondPriceCurrency !== next &&
          !canConvertPair(input.bondPriceCurrency, next)) ||
        !ensureResultCurrenciesReachable(next)
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
      (input.bondPriceCurrency !== next &&
        !canConvertPair(input.bondPriceCurrency, next)) ||
      !ensureResultCurrenciesReachable(next)
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

  /** Convert bond price amount when its own currency changes. */
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

  const handleDisplayCurrencyChange = (
    field: 'couponPerPeriodCurrency' | 'annualCouponCurrency',
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
        open={input.annualCouponOpen}
        onToggle={(event) => set({ annualCouponOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.annualCouponOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Annual coupon payment</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="bcy-face-value">
              <span>Face value</span>
              <InfoTooltip
                label="Face value"
                text="Par value of the bond used to compute the annual coupon. Calculation currency for normalizing bond price."
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
                  id="bcy-face-value"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.faceValue}
                  aria-invalid={Boolean(errors.faceValue)}
                  onChange={(e) => set({ faceValue: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="bcy-face-currency"
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
            <label className={labelClass} htmlFor="bcy-frequency">
              <span>Frequency</span>
              <InfoTooltip
                label="Frequency"
                text="How often coupons are paid: Annually (1), Semiannually (2), Quarterly (4), or Monthly (12). Not FX-converted."
              />
            </label>
            <select
              id="bcy-frequency"
              className={selectClass}
              value={input.frequency}
              aria-invalid={Boolean(errors.frequency)}
              onChange={(e) =>
                set({ frequency: e.target.value as CouponFrequency })
              }
            >
              {COUPON_FREQUENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.frequency ? (
              <p className="mt-1 text-xs text-rose-600">{errors.frequency}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bcy-coupon-rate">
              <span>Coupon rate</span>
              <InfoTooltip
                label="Coupon rate"
                text="Annual coupon rate as a percent of face value. Zero is allowed. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.couponRatePercent}>
              <input
                id="bcy-coupon-rate"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.couponRatePercent}
                aria-invalid={Boolean(errors.couponRatePercent)}
                onChange={(e) => set({ couponRatePercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.couponRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.couponRatePercent}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bcy-coupon-per-period">
              <span>Coupon per period</span>
              <InfoTooltip
                label="Coupon per period"
                text="Annual coupon divided by payments per year, then converted into this display currency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {periodSymbol}
                </span>
                <input
                  id="bcy-coupon-per-period"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedCouponPerPeriod : ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="bcy-period-currency"
                  value={input.couponPerPeriodCurrency}
                  onChange={(next) =>
                    handleDisplayCurrencyChange('couponPerPeriodCurrency', next)
                  }
                  aria-label="Coupon per period currency"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="bcy-annual-coupon">
              <span>Annual coupon</span>
              <InfoTooltip
                label="Annual coupon"
                text="Face value × coupon rate / 100, then converted into this display currency."
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
                  id="bcy-annual-coupon"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedAnnualCoupon : ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="bcy-annual-currency"
                  value={input.annualCouponCurrency}
                  onChange={(next) =>
                    handleDisplayCurrencyChange('annualCouponCurrency', next)
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
        open={input.bondYieldOpen}
        onToggle={(event) => set({ bondYieldOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.bondYieldOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Bond current yield</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Current yield (%) = annual coupon ÷ bond price × 100. This is not yield
            to maturity. Bond price converts into the face-value currency before the
            ratio is computed.
          </p>
          <div>
            <label className={labelClass} htmlFor="bcy-bond-price">
              <span>Bond price</span>
              <InfoTooltip
                label="Bond price"
                text="Current market price of the bond. Must be positive. Converted into face-value currency for the yield formula."
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
                  id="bcy-bond-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.bondPrice}
                  aria-invalid={Boolean(errors.bondPrice)}
                  onChange={(e) => set({ bondPrice: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="bcy-bond-currency"
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
            <label className={labelClass} htmlFor="bcy-current-yield">
              <span>Current yield</span>
              <InfoTooltip
                label="Current yield"
                text="Annual coupon divided by bond price, as a percent. Not FX-converted and not yield to maturity."
              />
            </label>
            <FieldShell muted>
              <input
                id="bcy-current-yield"
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

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
