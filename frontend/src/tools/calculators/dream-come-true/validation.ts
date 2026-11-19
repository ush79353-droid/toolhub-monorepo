import { calculateDreamComeTrue } from './calculation';
import type {
  DreamComeTrueFieldErrors,
  DreamComeTrueInput,
  DreamComeTrueResult,
} from './types';

function parseRequiredPositive(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function parseRequiredNonNeg(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateDreamComeTrueInput(input: DreamComeTrueInput): {
  isValid: boolean;
  errors: DreamComeTrueFieldErrors;
  result: DreamComeTrueResult | null;
  incomplete: boolean;
} {
  const errors: DreamComeTrueFieldErrors = {};

  const dream = parseRequiredPositive(input.dreamPrice);
  const initial = parseRequiredNonNeg(input.initialSavings);
  const monthly = parseRequiredNonNeg(input.monthlySavings);
  const rate = parseRequiredNonNeg(input.annualInterestRate);

  // Incomplete form (blank dream or monthly) — no scary errors for empty defaults
  if (dream === null || monthly === null) {
    return { isValid: false, errors: {}, result: null, incomplete: true };
  }

  if (Number.isNaN(dream) || (dream as number) <= 0) {
    errors.dreamPrice = 'Enter a dream price greater than zero';
  }

  if (initial === null) {
    errors.initialSavings = 'Enter initial savings (use 0 if none)';
  } else if (Number.isNaN(initial) || (initial as number) < 0) {
    errors.initialSavings = 'Enter a valid nonnegative initial savings amount';
  }

  if (Number.isNaN(monthly) || (monthly as number) < 0) {
    errors.monthlySavings = 'Enter a valid nonnegative monthly savings amount';
  }

  if (rate === null) {
    errors.annualInterestRate = 'Enter the annual interest rate (0 allowed)';
  } else if (Number.isNaN(rate) || (rate as number) < 0) {
    errors.annualInterestRate = 'Interest rate cannot be negative';
  } else if ((rate as number) > 100) {
    errors.annualInterestRate = 'Interest rate must be 100% or less';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null, incomplete: false };
  }

  const result = calculateDreamComeTrue({
    dreamPrice: dream as number,
    initialSavings: (initial as number) ?? 0,
    monthlySavings: monthly as number,
    annualInterestRate: rate as number,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate time to goal with the current inputs.' },
      result: null,
      incomplete: false,
    };
  }

  return { isValid: true, errors, result, incomplete: false };
}
