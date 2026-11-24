import { calculateCaffeine } from './calculation';
import type {
  CaffeineFieldErrors,
  CaffeineInput,
  CaffeineResult,
} from './types';

export interface CaffeineValidation {
  isValid: boolean;
  errors: CaffeineFieldErrors;
  result: CaffeineResult | null;
}

function badCount(v: number | null): boolean {
  return v != null && (!Number.isFinite(v) || v < 0);
}

export function validateCaffeineInput(input: CaffeineInput): CaffeineValidation {
  const errors: CaffeineFieldErrors = {};
  if (badCount(input.count1)) errors.count1 = 'Enter 0 or more servings.';
  if (badCount(input.count2)) errors.count2 = 'Enter 0 or more servings.';
  if (badCount(input.count3)) errors.count3 = 'Enter 0 or more servings.';

  if (errors.count1 || errors.count2 || errors.count3) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateCaffeine(input),
  };
}
