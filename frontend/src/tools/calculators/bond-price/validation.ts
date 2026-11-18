import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateBondPrice, formatBondMoney } from './calculation';
import {
  COUPON_FREQUENCY_OPTIONS,
  type BondPriceFieldErrors,
  type BondPriceInput,
  type BondPriceResult,
  type CouponFrequency,
} from './types';

export interface BondPriceValidation {
  isValid: boolean;
  errors: BondPriceFieldErrors;
  result: BondPriceResult | null;
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
 * then converts money results into independent display currencies. Rates,
 * years, and coupon frequency are never FX-converted.
 */
export function validateBondPriceInput(
  input: BondPriceInput,
  rates?: CurrencyRatesSnapshot | null
): BondPriceValidation {
  const errors: BondPriceFieldErrors = {};

  const face = parseNumber(input.faceValue);
  const rate = parseNumber(input.annualCouponRatePercent);
  const years = parseNumber(input.yearsToMaturity);
  const ytm = parseNumber(input.yieldToMaturityPercent);

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
  } else if (!ytm.blank && ytm.value !== null && ytm.value < 0) {
    errors.yieldToMaturityPercent = 'Yield to maturity cannot be negative.';
  }

  const incomplete =
    face.blank ||
    rate.blank ||
    years.blank ||
    ytm.blank ||
    Boolean(errors.faceValue) ||
    Boolean(errors.annualCouponRatePercent) ||
    Boolean(errors.couponFrequency) ||
    Boolean(errors.yearsToMaturity) ||
    Boolean(errors.yieldToMaturityPercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const frequency = input.couponFrequency;
  const m = COUPON_FREQUENCY_OPTIONS.find((o) => o.value === frequency)!
    .periodsPerYear;
  const rawPeriods = years.value! * m;
  if (Math.abs(rawPeriods - Math.round(rawPeriods)) > 1e-9) {
    errors.yearsToMaturity =
      'Years × coupon frequency must be a whole number of periods (regular coupon dates).';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateBondPrice({
    faceValue: face.value!,
    annualCouponRatePercent: rate.value!,
    couponFrequency: frequency,
    yearsToMaturity: years.value!,
    yieldToMaturityPercent: ytm.value!,
  });

  if (computed === null) {
    errors.form =
      'This combination does not produce a finite bond price under the regular coupon-date assumption.';
    return { isValid: false, errors, result: null };
  }

  const faceCurrency = input.faceValueCurrency;

  const couponPeriodOut = convertMoney(
    computed.couponPerPeriod,
    faceCurrency,
    input.couponPerPeriodCurrency,
    rates
  );
  if (!couponPeriodOut.ok) {
    errors.form = couponPeriodOut.message;
    return { isValid: false, errors, result: null };
  }

  const annualOut = convertMoney(
    computed.annualCoupon,
    faceCurrency,
    input.annualCouponCurrency,
    rates
  );
  if (!annualOut.ok) {
    errors.form = annualOut.message;
    return { isValid: false, errors, result: null };
  }

  const priceOut = convertMoney(
    computed.bondPrice,
    faceCurrency,
    input.bondPriceCurrency,
    rates
  );
  if (!priceOut.ok) {
    errors.form = priceOut.message;
    return { isValid: false, errors, result: null };
  }

  const result: BondPriceResult = {
    annualCouponInFace: computed.annualCoupon,
    couponPerPeriodInFace: computed.couponPerPeriod,
    bondPriceInFace: computed.bondPrice,
    periodsPerYear: computed.periodsPerYear,
    totalPeriods: computed.totalPeriods,
    annualCoupon: annualOut.amount,
    couponPerPeriod: couponPeriodOut.amount,
    bondPrice: priceOut.amount,
    faceValueCurrency: faceCurrency,
    couponPerPeriodCurrency: input.couponPerPeriodCurrency,
    annualCouponCurrency: input.annualCouponCurrency,
    bondPriceCurrency: input.bondPriceCurrency,
    formattedAnnualCoupon: formatBondMoney(
      annualOut.amount,
      input.annualCouponCurrency
    ),
    formattedCouponPerPeriod: formatBondMoney(
      couponPeriodOut.amount,
      input.couponPerPeriodCurrency
    ),
    formattedBondPrice: formatBondMoney(
      priceOut.amount,
      input.bondPriceCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
