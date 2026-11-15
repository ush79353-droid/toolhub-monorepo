import { calculateSimpleInterest } from './calculation';
import type {
  SimpleInterestFieldErrors,
  SimpleInterestInput,
  SimpleInterestResult,
} from './types';

function parseNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parseOptionalNonNegInt(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return 0;
  const n = Number(trimmed.replace(/,/g, ''));
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateSimpleInterestInput(input: SimpleInterestInput): {
  isValid: boolean;
  errors: SimpleInterestFieldErrors;
  result: SimpleInterestResult | null;
} {
  const errors: SimpleInterestFieldErrors = {};

  const principal = parseNumber(input.principal);
  const interestRate = parseNumber(input.interestRate);
  const termYears = parseOptionalNonNegInt(input.termYears);
  const termMonths = parseOptionalNonNegInt(input.termMonths);

  // Need principal and rate entered; years/months may be blank (treated as 0).
  if (principal === null || interestRate === null) {
    return { isValid: false, errors, result: null };
  }

  // If both term fields blank and user hasn't entered anything for term - still allow
  // calculation with t=0 when principal+rate present. But if only one of years/months
  // is invalid, error.

  if (Number.isNaN(principal) || principal < 0) {
    errors.principal = 'Enter a valid principal (≥ 0).';
  }

  if (Number.isNaN(interestRate) || interestRate < 0) {
    errors.interestRate = 'Enter a valid interest rate (≥ 0).';
  }

  if (Number.isNaN(termYears!) || !Number.isInteger(termYears!) || termYears! < 0) {
    errors.termYears = 'Years must be a non-negative whole number.';
  }

  if (Number.isNaN(termMonths!) || !Number.isInteger(termMonths!) || termMonths! < 0) {
    errors.termMonths = 'Months must be a non-negative whole number.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateSimpleInterest({
    principal: principal!,
    interestRatePercent: interestRate!,
    termYears: termYears!,
    termMonths: termMonths!,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'Unable to calculate simple interest for these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
