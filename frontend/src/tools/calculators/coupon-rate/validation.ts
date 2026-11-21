import { calculateCouponRate } from './calculation';
import { FREQUENCY_MAP } from './types';
import type {
  CouponRateFieldErrors,
  CouponRateInput,
  CouponRateResult,
} from './types';

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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export interface CouponRateValidation {
  isValid: boolean;
  errors: CouponRateFieldErrors;
  result: CouponRateResult | null;
}

export function collectFieldErrors(
  input: CouponRateInput
): CouponRateFieldErrors {
  const errors: CouponRateFieldErrors = {};
  const { solveTarget } = input;

  if (!(input.frequency in FREQUENCY_MAP)) {
    errors.frequency = 'Select a supported coupon frequency.';
  }

  const face = parseNumber(input.faceValue);
  const period = parseNumber(input.couponPerPeriod);
  const annual = parseNumber(input.annualCoupon);
  const rate = parseNumber(input.couponRatePercent);

  const needFace =
    solveTarget === 'couponRate' ||
    solveTarget === 'couponPerPeriod' ||
    solveTarget === 'annualCoupon';
  const needPeriod = solveTarget === 'couponRate';
  const needRate =
    solveTarget === 'couponPerPeriod' ||
    solveTarget === 'annualCoupon' ||
    solveTarget === 'faceValue';
  const needAnnual = solveTarget === 'faceValue';

  if (needFace) {
    if (face.blank)
      errors.faceValue =
        'Enter a valid positive face value to calculate the coupon rate.';
    else if (face.invalid || face.value == null)
      errors.faceValue = 'Enter a valid face value.';
    else if (face.value <= 0)
      errors.faceValue =
        'Enter a valid positive face value to calculate the coupon rate.';
  }

  if (needPeriod) {
    if (period.blank)
      errors.couponPerPeriod = 'Enter the coupon payment per period.';
    else if (period.invalid || period.value == null)
      errors.couponPerPeriod = 'Enter a valid coupon per period.';
    else if (period.value < 0)
      errors.couponPerPeriod =
        'Coupon per period cannot be negative in standard fixed-coupon mode.';
  }

  if (needRate) {
    if (rate.blank) errors.couponRatePercent = 'Enter the coupon rate (%).';
    else if (rate.invalid || rate.value == null)
      errors.couponRatePercent = 'Enter a valid coupon rate.';
    else if (rate.value < 0)
      errors.couponRatePercent =
        'Coupon rate cannot be negative in standard fixed-coupon mode.';
    else if (solveTarget === 'faceValue' && rate.value <= 0)
      errors.couponRatePercent =
        'Coupon rate must be greater than zero to solve for face value.';
  }

  if (needAnnual) {
    if (annual.blank) errors.annualCoupon = 'Enter the annual coupon payment.';
    else if (annual.invalid || annual.value == null)
      errors.annualCoupon = 'Enter a valid annual coupon.';
    else if (annual.value < 0)
      errors.annualCoupon = 'Annual coupon cannot be negative.';
  }

  return errors;
}

export function hasFieldErrors(errors: CouponRateFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateCouponRateInput(
  input: CouponRateInput
): CouponRateValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateCouponRate(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
