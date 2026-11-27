import { calculateUrineAnionGap, parseNumber } from './calculation';
import type {
  UrineAnionGapFieldErrors,
  UrineAnionGapInput,
  UrineAnionGapResult,
} from './types';

export interface UrineAnionGapValidation {
  errors: UrineAnionGapFieldErrors;
  result: UrineAnionGapResult | null;
}

export function validateUrineAnionGapInput(
  input: UrineAnionGapInput,
): UrineAnionGapValidation {
  const errors: UrineAnionGapFieldErrors = {};

  if (input.sodiumText.trim() !== '') {
    if (parseNumber(input.sodiumText) === null) {
      errors.sodiumText = 'Enter a valid urinary Na⁺.';
    }
  }
  if (input.potassiumText.trim() !== '') {
    if (parseNumber(input.potassiumText) === null) {
      errors.potassiumText = 'Enter a valid urinary K⁺.';
    }
  }
  if (input.chlorideText.trim() !== '') {
    if (parseNumber(input.chlorideText) === null) {
      errors.chlorideText = 'Enter a valid urinary Cl⁻.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateUrineAnionGap(input) };
}
