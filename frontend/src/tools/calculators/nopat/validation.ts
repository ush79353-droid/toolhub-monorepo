import { buildNopatResult } from './calculation';
import type { NopatFieldErrors, NopatInput, NopatResult } from './types';

function isBlank(value: number): boolean {
  return !Number.isFinite(value);
}

export function validateNopat(input: NopatInput): {
  isValid: boolean;
  errors: NopatFieldErrors;
  result: NopatResult | null;
} {
  const errors: NopatFieldErrors = {};

  if (!isBlank(input.taxRatePercent)) {
    if (input.taxRatePercent < 0 || input.taxRatePercent > 100) {
      errors.taxRatePercent = 'Tax rate must be between 0% and 100%';
    }
  }

  if (input.mode === 'simple') {
    // Operating profit may be zero or negative; only reject non-finite typed garbage via blank check.
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
  } else {
    // Precise mode: money fields may be zero or negative; require finite values when calculating.
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
  }

  const result = buildNopatResult(input);
  const hasResult = result.nopat !== null;
  return { isValid: hasResult, errors, result: hasResult ? result : null };
}
