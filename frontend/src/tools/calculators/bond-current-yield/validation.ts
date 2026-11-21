import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateBondCurrentYield,
  formatBondMoney,
  formatYieldPercent,
  paymentsPerYearForFrequency,
} from './calculation';
import {
  COUPON_FREQUENCY_OPTIONS,
  type BondCurrentYieldFieldErrors,
  type BondCurrentYieldInput,
  type BondCurrentYieldResult,
  type CouponFrequency,
} from './types';

export interface BondCurrentYieldValidation {
  isValid: boolean;
  errors: BondCurrentYieldFieldErrors;
  result: BondCurrentYieldResult | null;
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
 * Validates inputs, normalizes face value and bond price into the face-value
 * currency, computes coupons and current yield at full precision, then converts
 * money outputs into independent display currencies. Frequency, coupon rate %,
 * and current yield % are never FX-converted.
 */
export function validateBondCurrentYieldInput(
  input: BondCurrentYieldInput,
  rates?: CurrencyRatesSnapshot | null
): BondCurrentYieldValidation {
  const errors: BondCurrentYieldFieldErrors = {};

  const face = parseNumber(input.faceValue);
  const rate = parseNumber(input.couponRatePercent);
  const price = parseNumber(input.bondPrice);

  if (!face.blank && (face.invalid || face.value === null)) {
    errors.faceValue = 'Enter a valid face value.';
  } else if (!face.blank && face.value !== null && !(face.value > 0)) {
    errors.faceValue = 'Face value must be greater than zero.';
  }

  if (!isCouponFrequency(input.frequency)) {
    errors.frequency = 'Select a valid coupon frequency.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.couponRatePercent = 'Enter a valid coupon rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.couponRatePercent = 'Coupon rate cannot be negative.';
  }

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.bondPrice = 'Enter a valid bond price.';
  } else if (!price.blank && price.value !== null && !(price.value > 0)) {
    errors.bondPrice = 'Bond price must be greater than zero.';
  }

  const incomplete =
    face.blank ||
    rate.blank ||
    price.blank ||
    Boolean(errors.faceValue) ||
    Boolean(errors.frequency) ||
    Boolean(errors.couponRatePercent) ||
    Boolean(errors.bondPrice);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const paymentsPerYear = paymentsPerYearForFrequency(input.frequency);
  if (paymentsPerYear === null) {
    errors.frequency = 'Select a valid coupon frequency.';
    return { isValid: false, errors, result: null };
  }

  const bondInFace = convertMoney(
    price.value!,
    input.bondPriceCurrency,
    input.faceValueCurrency,
    rates
  );
  if (!bondInFace.ok) {
    errors.form = bondInFace.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateBondCurrentYield({
    faceValue: face.value!,
    couponRatePercent: rate.value!,
    paymentsPerYear,
    bondPrice: bondInFace.amount,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const periodOut = convertMoney(
    computed.couponPerPeriod,
    input.faceValueCurrency,
    input.couponPerPeriodCurrency,
    rates
  );
  if (!periodOut.ok) {
    errors.form = periodOut.message;
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

  const result: BondCurrentYieldResult = {
    annualCouponInFaceCurrency: computed.annualCoupon,
    couponPerPeriodInFaceCurrency: computed.couponPerPeriod,
    annualCoupon: annualOut.amount,
    couponPerPeriod: periodOut.amount,
    currentYieldPercent: computed.currentYieldPercent,
    faceValueCurrency: input.faceValueCurrency,
    couponPerPeriodCurrency: input.couponPerPeriodCurrency,
    annualCouponCurrency: input.annualCouponCurrency,
    bondPriceCurrency: input.bondPriceCurrency,
    formattedAnnualCoupon: formatBondMoney(
      annualOut.amount,
      input.annualCouponCurrency
    ),
    formattedCouponPerPeriod: formatBondMoney(
      periodOut.amount,
      input.couponPerPeriodCurrency
    ),
    formattedCurrentYieldPercent: formatYieldPercent(
      computed.currentYieldPercent
    ),
    paymentsPerYear,
  };

  return { isValid: true, errors, result };
}
