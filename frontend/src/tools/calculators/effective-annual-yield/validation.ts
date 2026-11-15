import { calculateEffectiveAnnualYield } from './calculation';
import type {
  EffectiveAnnualYieldFieldErrors,
  EffectiveAnnualYieldInput,
  EffectiveAnnualYieldResult,
} from './types';

export interface EffectiveAnnualYieldValidation {
  isValid: boolean;
  errors: EffectiveAnnualYieldFieldErrors;
  result: EffectiveAnnualYieldResult | null;
}

function parseNumber(raw: string): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateEffectiveAnnualYieldInput(
  input: EffectiveAnnualYieldInput
): EffectiveAnnualYieldValidation {
  const errors: EffectiveAnnualYieldFieldErrors = {};

  const face = parseNumber(input.faceValue);
  const coupon = parseNumber(input.annualCouponPayment);

  if (!face.blank && (face.invalid || face.value === null)) {
    errors.faceValue = 'Enter a valid face value.';
  } else if (!face.blank && face.value !== null && !(face.value > 0)) {
    errors.faceValue = 'Face value must be greater than zero.';
  }

  if (!coupon.blank && (coupon.invalid || coupon.value === null)) {
    errors.annualCouponPayment = 'Enter a valid annual coupon payment.';
  } else if (!coupon.blank && coupon.value !== null && coupon.value < 0) {
    errors.annualCouponPayment = 'Annual coupon payment cannot be negative.';
  }

  const incomplete = face.blank || coupon.blank || Object.keys(errors).length > 0;
  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateEffectiveAnnualYield(
    face.value!,
    coupon.value!,
    input.couponFrequency,
    input.currency
  );

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
