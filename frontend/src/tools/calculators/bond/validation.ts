import {
  PERIODS_PER_YEAR,
  solveBondAnnualCoupon,
  solveBondFaceValue,
  solveBondPrice,
  solveBondTimeToMaturity,
  solveBondYield,
  calculateBond,
} from './calculation';
import type {
  BondFieldErrors,
  BondInput,
  BondResult,
  BondSolveTarget,
} from './types';

export interface BondValidation {
  isValid: boolean;
  errors: BondFieldErrors;
  result: BondResult | null;
  solveFor: BondSolveTarget | null;
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
 * Exactly one of price / face / yield / maturity / annual coupon must be blank.
 * Coupon frequency is always selected.
 */
export function validateBondInput(input: BondInput): BondValidation {
  const errors: BondFieldErrors = {};

  const price = parseNumber(input.price);
  const face = parseNumber(input.faceValue);
  const yieldPct = parseNumber(input.yieldPercent);
  const years = parseNumber(input.timeToMaturityYears);
  const coupon = parseNumber(input.annualCoupon);

  const blanks: BondSolveTarget[] = [];
  if (price.blank) blanks.push('price');
  if (face.blank) blanks.push('faceValue');
  if (yieldPct.blank) blanks.push('yield');
  if (years.blank) blanks.push('timeToMaturity');
  if (coupon.blank) blanks.push('annualCoupon');

  if (blanks.length === 0) {
    errors.form =
      'Leave exactly one of Price, Face value, Yield, Time to maturity, or Annual coupon blank to solve for that value.';
    return { isValid: false, errors, result: null, solveFor: null };
  }
  if (blanks.length > 1) {
    errors.form =
      'Leave only one field blank among Price, Face value, Yield, Time to maturity, and Annual coupon.';
    return { isValid: false, errors, result: null, solveFor: null };
  }

  const solveFor = blanks[0];

  if (!price.blank) {
    if (price.invalid || price.value === null) {
      errors.price = 'Enter a valid price.';
    } else if (!(price.value > 0)) {
      errors.price = 'Price must be greater than zero.';
    }
  }

  if (!face.blank) {
    if (face.invalid || face.value === null) {
      errors.faceValue = 'Enter a valid face value.';
    } else if (!(face.value > 0)) {
      errors.faceValue = 'Face value must be greater than zero.';
    }
  }

  if (!yieldPct.blank) {
    if (yieldPct.invalid || yieldPct.value === null) {
      errors.yieldPercent = 'Enter a valid yield.';
    } else {
      const m = PERIODS_PER_YEAR[input.couponFrequency];
      if (yieldPct.value / 100 <= -m) {
        errors.yieldPercent = 'Yield is too low for this coupon frequency.';
      }
    }
  }

  if (!years.blank) {
    if (years.invalid || years.value === null) {
      errors.timeToMaturityYears = 'Enter a valid time to maturity.';
    } else if (!(years.value > 0)) {
      errors.timeToMaturityYears = 'Time to maturity must be greater than zero.';
    } else {
      const m = PERIODS_PER_YEAR[input.couponFrequency];
      const N = years.value * m;
      if (!Number.isInteger(N)) {
        errors.timeToMaturityYears =
          'Maturity × frequency must be a whole number of coupon periods.';
      } else if (N > 1200) {
        errors.timeToMaturityYears = 'Time to maturity is too long.';
      }
    }
  }

  if (!coupon.blank) {
    if (coupon.invalid || coupon.value === null) {
      errors.annualCoupon = 'Enter a valid annual coupon.';
    } else if (coupon.value < 0) {
      errors.annualCoupon = 'Annual coupon cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null, solveFor };
  }

  const engine = {
    solveFor,
    price: price.blank ? undefined : (price.value as number),
    faceValue: face.blank ? undefined : (face.value as number),
    yieldPercent: yieldPct.blank ? undefined : (yieldPct.value as number),
    timeToMaturityYears: years.blank ? undefined : (years.value as number),
    annualCoupon: coupon.blank ? undefined : (coupon.value as number),
    couponMode: input.couponMode,
    couponFrequency: input.couponFrequency,
  };

  let message: string | null = null;
  switch (solveFor) {
    case 'price': {
      const s = solveBondPrice({
        faceValue: engine.faceValue!,
        yieldPercent: engine.yieldPercent!,
        timeToMaturityYears: engine.timeToMaturityYears!,
        annualCoupon: engine.annualCoupon!,
        couponMode: input.couponMode,
        couponFrequency: input.couponFrequency,
      });
      if (!s.ok) message = s.message;
      break;
    }
    case 'faceValue': {
      const s = solveBondFaceValue({
        price: engine.price!,
        yieldPercent: engine.yieldPercent!,
        timeToMaturityYears: engine.timeToMaturityYears!,
        annualCoupon: engine.annualCoupon!,
        couponMode: input.couponMode,
        couponFrequency: input.couponFrequency,
      });
      if (!s.ok) message = s.message;
      break;
    }
    case 'yield': {
      const s = solveBondYield({
        price: engine.price!,
        faceValue: engine.faceValue!,
        timeToMaturityYears: engine.timeToMaturityYears!,
        annualCoupon: engine.annualCoupon!,
        couponMode: input.couponMode,
        couponFrequency: input.couponFrequency,
      });
      if (!s.ok) message = s.message;
      break;
    }
    case 'timeToMaturity': {
      const s = solveBondTimeToMaturity({
        price: engine.price!,
        faceValue: engine.faceValue!,
        yieldPercent: engine.yieldPercent!,
        annualCoupon: engine.annualCoupon!,
        couponMode: input.couponMode,
        couponFrequency: input.couponFrequency,
      });
      if (!s.ok) message = s.message;
      break;
    }
    case 'annualCoupon': {
      const s = solveBondAnnualCoupon({
        price: engine.price!,
        faceValue: engine.faceValue!,
        yieldPercent: engine.yieldPercent!,
        timeToMaturityYears: engine.timeToMaturityYears!,
        couponMode: input.couponMode,
        couponFrequency: input.couponFrequency,
      });
      if (!s.ok) message = s.message;
      break;
    }
  }

  if (message) {
    errors.form = message;
    return { isValid: false, errors, result: null, solveFor };
  }

  const result = calculateBond(engine);
  if (!result) {
    errors.form = 'Could not complete the bond calculation.';
    return { isValid: false, errors, result: null, solveFor };
  }

  return { isValid: true, errors, result, solveFor };
}
