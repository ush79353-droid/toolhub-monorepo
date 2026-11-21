import { calculateEffectiveDurationFromInput } from './calculation';
import {
  BOND_FREQUENCY_MAP,
  type EffectiveDurationFieldErrors,
  type EffectiveDurationInput,
  type EffectiveDurationResult,
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

export interface EffectiveDurationValidation {
  isValid: boolean;
  errors: EffectiveDurationFieldErrors;
  result: EffectiveDurationResult | null;
}

export function collectFieldErrors(
  input: EffectiveDurationInput,
): EffectiveDurationFieldErrors {
  const errors: EffectiveDurationFieldErrors = {};

  if (!(input.frequency in BOND_FREQUENCY_MAP)) {
    errors.frequency = 'Select a supported coupon frequency.';
  }

  const dy = parseNumber(input.yieldDifferentialPercent);
  if (dy.blank) {
    errors.yieldDifferentialPercent =
      'Enter a yield differential greater than zero (percentage points).';
  } else if (dy.invalid || dy.value == null) {
    errors.yieldDifferentialPercent = 'Enter a valid yield differential.';
  } else if (dy.value <= 0) {
    errors.yieldDifferentialPercent =
      'Yield differential must be greater than zero.';
  }

  if (input.mode === 'scenario') {
    const p0 = parseNumber(input.basePrice);
    const pDown = parseNumber(input.priceYieldDown);
    const pUp = parseNumber(input.priceYieldUp);

    if (p0.blank) errors.basePrice = 'Enter the initial bond price.';
    else if (p0.invalid || p0.value == null)
      errors.basePrice = 'Enter a valid initial bond price.';
    else if (p0.value <= 0)
      errors.basePrice = 'Initial bond price must be greater than zero.';

    if (pDown.blank)
      errors.priceYieldDown = 'Enter the bond price after the yield decrease.';
    else if (pDown.invalid || pDown.value == null)
      errors.priceYieldDown = 'Enter a valid down-yield bond price.';
    else if (pDown.value <= 0)
      errors.priceYieldDown = 'Down-yield bond price must be greater than zero.';

    if (pUp.blank)
      errors.priceYieldUp = 'Enter the bond price after the yield increase.';
    else if (pUp.invalid || pUp.value == null)
      errors.priceYieldUp = 'Enter a valid up-yield bond price.';
    else if (pUp.value <= 0)
      errors.priceYieldUp = 'Up-yield bond price must be greater than zero.';

    return errors;
  }

  const face = parseNumber(input.faceValue);
  const coupon = parseNumber(input.annualCouponRatePercent);
  const years = parseNumber(input.yearsToMaturity);
  const ytm = parseNumber(input.yieldToMaturityPercent);

  if (face.blank) errors.faceValue = 'Enter a face value greater than zero.';
  else if (face.invalid || face.value == null)
    errors.faceValue = 'Enter a valid face value.';
  else if (face.value <= 0)
    errors.faceValue = 'Face value must be greater than zero.';

  if (coupon.blank)
    errors.annualCouponRatePercent =
      'Enter the annual coupon rate (%). Use 0 for a zero-coupon bond.';
  else if (coupon.invalid || coupon.value == null)
    errors.annualCouponRatePercent = 'Enter a valid annual coupon rate.';
  else if (coupon.value < 0)
    errors.annualCouponRatePercent = 'Coupon rate cannot be negative.';

  if (years.blank)
    errors.yearsToMaturity = 'Enter years to maturity greater than zero.';
  else if (years.invalid || years.value == null)
    errors.yearsToMaturity = 'Enter a valid maturity in years.';
  else if (years.value <= 0)
    errors.yearsToMaturity = 'Years to maturity must be greater than zero.';
  else if (input.frequency in BOND_FREQUENCY_MAP) {
    const m = BOND_FREQUENCY_MAP[input.frequency];
    const periods = years.value * m;
    if (Math.abs(periods - Math.round(periods)) > 1e-9) {
      errors.yearsToMaturity =
        `Maturity × frequency must be a whole number of coupon periods (got ${periods}). Do not round silently; adjust maturity or frequency.`;
    }
  }

  if (ytm.blank)
    errors.yieldToMaturityPercent = 'Enter the yield to maturity (%).';
  else if (ytm.invalid || ytm.value == null)
    errors.yieldToMaturityPercent = 'Enter a valid yield to maturity.';
  else if (dy.value != null && dy.value > 0) {
    const m = BOND_FREQUENCY_MAP[input.frequency] ?? 1;
    const y = ytm.value / 100;
    const dyDec = dy.value / 100;
    const downPeriodic = (y - dyDec) / m;
    const upPeriodic = (y + dyDec) / m;
    const basePeriodic = y / m;
    if (basePeriodic <= -1 || downPeriodic <= -1 || upPeriodic <= -1) {
      errors.yieldToMaturityPercent =
        'Yield scenarios must keep 1 + periodic yield positive for all shocks.';
    }
  }

  return errors;
}

export function hasFieldErrors(errors: EffectiveDurationFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateEffectiveDurationInput(
  input: EffectiveDurationInput,
): EffectiveDurationValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateEffectiveDurationFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
