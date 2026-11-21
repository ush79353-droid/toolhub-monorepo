import {
  calculateYieldToCallFromInput,
  resolveYears,
} from './calculation';
import type {
  YieldToCallFieldErrors,
  YieldToCallInput,
  YieldToCallResult,
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

export interface YieldToCallValidation {
  isValid: boolean;
  errors: YieldToCallFieldErrors;
  result: YieldToCallResult | null;
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

export function collectFieldErrors(
  input: YieldToCallInput,
): YieldToCallFieldErrors {
  const errors: YieldToCallFieldErrors = {};

  const interest = parseNumber(input.annualInterest);
  if (interest.blank) {
    errors.annualInterest = 'Enter the annual interest amount.';
  } else if (interest.invalid || interest.value == null) {
    errors.annualInterest = 'Enter a valid annual interest amount.';
  } else if (interest.value < 0) {
    errors.annualInterest = 'Annual interest cannot be negative.';
  }

  const callErr = positiveMoney(
    parseNumber(input.callPrice),
    'Enter the call price.',
  );
  if (callErr) errors.callPrice = callErr;

  const marketErr = positiveMoney(
    parseNumber(input.marketPrice),
    'Enter the market price.',
  );
  if (marketErr) errors.marketPrice = marketErr;

  const years = parseNumber(input.yearsUntilCall);
  if (years.blank) {
    errors.yearsUntilCall = 'Enter years until call.';
  } else if (years.invalid || years.value == null) {
    errors.yearsUntilCall = 'Enter a valid number of years.';
  } else if (resolveYears(years.value) === null) {
    errors.yearsUntilCall =
      'Years until call must be a whole number of years (1 or more).';
  }

  return errors;
}

export function hasFieldErrors(errors: YieldToCallFieldErrors): boolean {
  return Object.values(errors).some((v) => typeof v === 'string' && v.length > 0);
}

export function validateYieldToCallInput(
  input: YieldToCallInput,
): YieldToCallValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateYieldToCallFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Could not solve yield to call for these inputs. Check that prices and years allow a finite discount rate above −100%.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
