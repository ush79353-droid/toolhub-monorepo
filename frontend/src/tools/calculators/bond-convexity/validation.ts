import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateBondConvexity,
  formatBondMoney,
  formatConvexity,
} from './calculation';
import {
  COUPON_FREQUENCY_OPTIONS,
  type BondConvexityFieldErrors,
  type BondConvexityInput,
  type BondConvexityResult,
  type CouponFrequency,
} from './types';

export interface BondConvexityValidation {
  isValid: boolean;
  errors: BondConvexityFieldErrors;
  result: BondConvexityResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function isCouponFrequency(value: string): value is CouponFrequency {
  return COUPON_FREQUENCY_OPTIONS.some((o) => o.value === value);
}

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Validates inputs, prices the bond in face-value currency at full precision,
 * then converts money results into independent display currencies.
 * Percentages, years, frequency, and dimensionless convexity are never FX-converted.
 */
export function validateBondConvexityInput(
  input: BondConvexityInput,
  rates?: CurrencyRatesSnapshot | null
): BondConvexityValidation {
  const errors: BondConvexityFieldErrors = {};

  const face = parseNumber(input.faceValue);
  const rate = parseNumber(input.annualCouponRatePercent);
  const years = parseNumber(input.yearsToMaturity);
  const ytm = parseNumber(input.yieldToMaturityPercent);
  const dy = parseNumber(input.yieldDifferentialPercent);

  if (!face.blank && (face.invalid || face.value === null)) {
    errors.faceValue = 'Enter a valid face value.';
  } else if (!face.blank && face.value !== null && !(face.value > 0)) {
    errors.faceValue = 'Face value must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualCouponRatePercent = 'Enter a valid annual coupon rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.annualCouponRatePercent = 'Annual coupon rate cannot be negative.';
  }

  if (!isCouponFrequency(input.couponFrequency)) {
    errors.couponFrequency = 'Select a valid coupon frequency.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.yearsToMaturity = 'Enter a valid number of years.';
  } else if (!years.blank && years.value !== null && !(years.value > 0)) {
    errors.yearsToMaturity = 'Years to maturity must be greater than zero.';
  }

  if (!ytm.blank && (ytm.invalid || ytm.value === null)) {
    errors.yieldToMaturityPercent = 'Enter a valid yield to maturity.';
  }

  if (!dy.blank && (dy.invalid || dy.value === null)) {
    errors.yieldDifferentialPercent = 'Enter a valid yield differential.';
  } else if (!dy.blank && dy.value !== null && !(dy.value > 0)) {
    errors.yieldDifferentialPercent =
      'Yield differential must be greater than zero.';
  }

  const incomplete =
    face.blank ||
    rate.blank ||
    years.blank ||
    ytm.blank ||
    dy.blank ||
    Boolean(errors.faceValue) ||
    Boolean(errors.annualCouponRatePercent) ||
    Boolean(errors.couponFrequency) ||
    Boolean(errors.yearsToMaturity) ||
    Boolean(errors.yieldToMaturityPercent) ||
    Boolean(errors.yieldDifferentialPercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateBondConvexity({
    faceValue: face.value!,
    annualCouponRatePercent: rate.value!,
    couponFrequency: input.couponFrequency,
    yearsToMaturity: years.value!,
    yieldToMaturityPercent: ytm.value!,
    yieldDifferentialPercent: dy.value!,
  });

  if (computed === null) {
    errors.form =
      'This combination does not produce a finite bond price or convexity. Check that yield shifts keep 1 + y/m > 0.';
    return { isValid: false, errors, result: null };
  }

  const couponOut = convertMoney(
    computed.couponPerPeriod,
    input.faceValueCurrency,
    input.couponPerPeriodCurrency,
    rates
  );
  if (!couponOut.ok) {
    errors.form = couponOut.message;
    return { isValid: false, errors, result: null };
  }

  const annualOut = convertMoney(
    computed.annualCoupon,
    input.faceValueCurrency,
    input.annualCouponCurrency,
    rates
  );
  if (!annualOut.ok) {
    errors.form = annualOut.message;
    return { isValid: false, errors, result: null };
  }

  const priceOut = convertMoney(
    computed.bondPrice,
    input.faceValueCurrency,
    input.bondPriceCurrency,
    rates
  );
  if (!priceOut.ok) {
    errors.form = priceOut.message;
    return { isValid: false, errors, result: null };
  }

  const result: BondConvexityResult = {
    paymentsPerYear: computed.paymentsPerYear,
    couponPerPeriodInFace: computed.couponPerPeriod,
    couponPerPeriod: couponOut.amount,
    annualCouponInFace: computed.annualCoupon,
    annualCoupon: annualOut.amount,
    bondPriceInFace: computed.bondPrice,
    bondPrice: priceOut.amount,
    bondConvexity: computed.bondConvexity,
    faceValueCurrency: input.faceValueCurrency,
    couponPerPeriodCurrency: input.couponPerPeriodCurrency,
    annualCouponCurrency: input.annualCouponCurrency,
    bondPriceCurrency: input.bondPriceCurrency,
    formattedCouponPerPeriod: formatBondMoney(
      couponOut.amount,
      input.couponPerPeriodCurrency
    ),
    formattedAnnualCoupon: formatBondMoney(
      annualOut.amount,
      input.annualCouponCurrency
    ),
    formattedBondPrice: formatBondMoney(priceOut.amount, input.bondPriceCurrency),
    formattedBondConvexity: formatConvexity(computed.bondConvexity),
  };

  return { isValid: true, errors: {}, result };
}
