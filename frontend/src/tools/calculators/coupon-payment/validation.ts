import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateCouponPayment,
  formatCouponMoney,
  formatYieldPercent,
} from './calculation';
import type {
  CouponPaymentFieldErrors,
  CouponPaymentInput,
  CouponPaymentResult,
} from './types';

export interface CouponPaymentValidation {
  isValid: boolean;
  errors: CouponPaymentFieldErrors;
  result: CouponPaymentResult | null;
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

/**
 * Validates inputs, computes coupon amounts in the face-value currency at full
 * precision, then converts the periodic payment into `couponPaymentCurrency`
 * before display rounding. Percentages and payment counts are never FX-converted.
 * Market price (optional) is already in face-value currency; yield is a percent.
 */
export function validateCouponPaymentInput(
  input: CouponPaymentInput,
  rates?: CurrencyRatesSnapshot | null
): CouponPaymentValidation {
  const errors: CouponPaymentFieldErrors = {};

  const face = parseNumber(input.faceValue);
  const rate = parseNumber(input.annualCouponRatePercent);
  const payments = parseNumber(input.paymentsPerAnnum);
  const market = parseNumber(input.marketPrice);

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

  if (!payments.blank && (payments.invalid || payments.value === null)) {
    errors.paymentsPerAnnum = 'Enter a valid number of payments per annum.';
  } else if (!payments.blank && payments.value !== null && !(payments.value > 0)) {
    errors.paymentsPerAnnum = 'Number of payments per annum must be greater than zero.';
  }

  if (!market.blank && (market.invalid || market.value === null)) {
    errors.marketPrice = 'Enter a valid market price.';
  } else if (!market.blank && market.value !== null && !(market.value > 0)) {
    errors.marketPrice = 'Market price must be greater than zero.';
  }

  const incomplete =
    face.blank ||
    rate.blank ||
    payments.blank ||
    Boolean(errors.faceValue) ||
    Boolean(errors.annualCouponRatePercent) ||
    Boolean(errors.paymentsPerAnnum);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateCouponPayment({
    faceValue: face.value!,
    annualCouponRatePercent: rate.value!,
    paymentsPerAnnum: payments.value!,
    marketPrice: market.blank || errors.marketPrice ? null : market.value,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  let couponPaymentInResult = computed.couponPayment;
  if (input.couponPaymentCurrency !== input.faceValueCurrency) {
    if (!rates?.available) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    const converted = convertCurrency({
      amount: computed.couponPayment,
      from: input.faceValueCurrency,
      to: input.couponPaymentCurrency,
      rates: rates.rates,
    });
    if (!converted.ok) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    couponPaymentInResult = converted.amount;
  }

  const result: CouponPaymentResult = {
    annualCoupon: computed.annualCoupon,
    couponPaymentInFaceCurrency: computed.couponPayment,
    couponPayment: couponPaymentInResult,
    faceValueCurrency: input.faceValueCurrency,
    couponPaymentCurrency: input.couponPaymentCurrency,
    formattedCouponPayment: formatCouponMoney(
      couponPaymentInResult,
      input.couponPaymentCurrency
    ),
    currentYieldPercent: computed.currentYieldPercent,
    formattedCurrentYieldPercent:
      computed.currentYieldPercent === null
        ? null
        : formatYieldPercent(computed.currentYieldPercent),
  };

  return { isValid: true, errors, result };
}
