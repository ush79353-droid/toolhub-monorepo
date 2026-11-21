import {
  calculateYieldToMaturityFromInput,
  resolvePeriods,
} from './calculation';
import type {
  CouponFrequency,
  YieldToMaturityFieldErrors,
  YieldToMaturityInput,
  YieldToMaturityResult,
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

export interface YieldToMaturityValidation {
  isValid: boolean;
  errors: YieldToMaturityFieldErrors;
  result: YieldToMaturityResult | null;
}

function positiveMoney(
  parsed: ReturnType<typeof parseNumber>,
  blankMsg: string,
): string | undefined {
  if (parsed.blank) return blankMsg;
  if (parsed.invalid || parsed.value == null) return 'Enter a valid amount.';
  if (!(parsed.value > 0)) return 'Value must be greater than zero.';
  return undefined;
}

function couponRateError(
  parsed: ReturnType<typeof parseNumber>,
): string | undefined {
  if (parsed.blank) return 'Enter the annual coupon rate (%).';
  if (parsed.invalid || parsed.value == null)
    return 'Enter a valid coupon rate.';
  if (parsed.value < 0) return 'Coupon rate cannot be negative.';
  return undefined;
}

function ytmError(
  parsed: ReturnType<typeof parseNumber>,
  m: number,
): string | undefined {
  if (parsed.blank) return 'Enter the yield to maturity (%).';
  if (parsed.invalid || parsed.value == null) return 'Enter a valid YTM.';
  if (parsed.value / 100 <= -m) {
    return `YTM must be greater than -${m * 100}% for this coupon frequency.`;
  }
  return undefined;
}

export function collectFieldErrors(
  input: YieldToMaturityInput,
): YieldToMaturityFieldErrors {
  const errors: YieldToMaturityFieldErrors = {};
  const { solveTarget } = input;
  const m = input.couponFrequency;

  if (![1, 2, 4, 12].includes(m)) {
    errors.couponFrequency =
      'Select annually, semiannually, quarterly, or monthly.';
  }

  const years = parseNumber(input.yearsToMaturity);
  if (years.blank) {
    errors.yearsToMaturity = 'Enter years to maturity.';
  } else if (years.invalid || years.value == null) {
    errors.yearsToMaturity = 'Enter a valid years to maturity.';
  } else if (!(years.value > 0)) {
    errors.yearsToMaturity = 'Years to maturity must be greater than zero.';
  } else if (resolvePeriods(years.value, m as CouponFrequency) === null) {
    errors.yearsToMaturity =
      'Years × coupon frequency must equal a whole number of coupon periods. Fractional periods require a settlement-aware schedule (not silently rounded).';
  }

  if (
    solveTarget === 'ytm' ||
    solveTarget === 'bondPrice' ||
    solveTarget === 'couponRate'
  ) {
    const eF = positiveMoney(
      parseNumber(input.faceValue),
      'Enter face value greater than zero.',
    );
    if (eF) errors.faceValue = eF;
  }

  if (
    solveTarget === 'ytm' ||
    solveTarget === 'faceValue' ||
    solveTarget === 'couponRate'
  ) {
    const eP = positiveMoney(
      parseNumber(input.bondPrice),
      'Enter bond price greater than zero.',
    );
    if (eP) errors.bondPrice = eP;
  }

  if (
    solveTarget === 'ytm' ||
    solveTarget === 'bondPrice' ||
    solveTarget === 'faceValue'
  ) {
    const eC = couponRateError(parseNumber(input.annualCouponRatePercent));
    if (eC) errors.annualCouponRatePercent = eC;
  }

  if (
    solveTarget === 'bondPrice' ||
    solveTarget === 'faceValue' ||
    solveTarget === 'couponRate'
  ) {
    const eY = ytmError(parseNumber(input.yieldToMaturityPercent), m);
    if (eY) errors.yieldToMaturityPercent = eY;
  }

  return errors;
}

export function hasFieldErrors(errors: YieldToMaturityFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateYieldToMaturityInput(
  input: YieldToMaturityInput,
): YieldToMaturityValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateYieldToMaturityFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Unable to solve for a valid yield with these inputs. Check price, coupons, and maturity.',
      },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
