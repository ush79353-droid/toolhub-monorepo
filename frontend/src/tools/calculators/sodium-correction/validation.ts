import { calculateSodiumCorrection, parseNumber } from './calculation';
import type {
  SodiumCorrectionFieldErrors,
  SodiumCorrectionInput,
  SodiumCorrectionResult,
} from './types';

export interface SodiumCorrectionValidation {
  errors: SodiumCorrectionFieldErrors;
  result: SodiumCorrectionResult | null;
}

export function validateSodiumCorrectionInput(
  input: SodiumCorrectionInput,
): SodiumCorrectionValidation {
  const errors: SodiumCorrectionFieldErrors = {};

  if (input.sodiumText.trim() !== '') {
    const n = parseNumber(input.sodiumText);
    if (n === null) errors.sodiumText = 'Enter a valid sodium value.';
    else if (!(n > 0)) errors.sodiumText = 'Sodium must be greater than zero.';
  }

  if (input.glucoseText.trim() !== '') {
    const g = parseNumber(input.glucoseText);
    if (g === null) errors.glucoseText = 'Enter a valid glucose value.';
    else if (!(g > 0))
      errors.glucoseText = 'Glucose must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateSodiumCorrection(input),
  };
}
