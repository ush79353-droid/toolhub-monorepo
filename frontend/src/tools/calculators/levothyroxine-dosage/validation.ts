import { calculateLevothyroxineDosage, parseNumber } from './calculation';
import type {
  LevothyroxineDosageFieldErrors,
  LevothyroxineDosageInput,
  LevothyroxineDosageResult,
} from './types';

export interface LevothyroxineDosageValidation {
  errors: LevothyroxineDosageFieldErrors;
  result: LevothyroxineDosageResult | null;
}

export function validateLevothyroxineDosageInput(
  input: LevothyroxineDosageInput,
): LevothyroxineDosageValidation {
  const errors: LevothyroxineDosageFieldErrors = {};

  const w = parseNumber(input.weightText);
  if (input.weightText.trim() !== '' && w === null) {
    errors.weightText = 'Enter a valid weight.';
  } else if (w !== null && !(w > 0)) {
    errors.weightText = 'Weight must be positive.';
  }

  const h = parseNumber(input.heightText);
  if (input.heightText.trim() !== '' && h === null) {
    errors.heightText = 'Enter a valid height.';
  } else if (h !== null && !(h > 0)) {
    errors.heightText = 'Height must be positive.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateLevothyroxineDosage(input) };
}
