import { calculateEar } from './calculation';
import type { EarFieldErrors, EarInput, EarResult } from './types';

function parseRate(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateEarInput(input: EarInput): {
  isValid: boolean;
  errors: EarFieldErrors;
  result: EarResult | null;
} {
  const errors: EarFieldErrors = {};
  const rate = parseRate(input.annualInterestRate);

  // Cascading blank-until-complete
  if (rate === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(rate)) {
    errors.annualInterestRate = 'Enter a valid annual interest rate.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateEar(rate, input.compoundFrequency);
  if (!result) {
    errors.form =
      'Rate is too low for this compounding frequency (must keep 1 + rate/(100×n) > 0).';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
