import { calculateOverweight, parseNumber } from './calculation';
import type {
  OverweightFieldErrors,
  OverweightInput,
  OverweightResult,
} from './types';

export interface OverweightValidation {
  errors: OverweightFieldErrors;
  result: OverweightResult | null;
}

export function validateOverweightInput(
  input: OverweightInput,
): OverweightValidation {
  const errors: OverweightFieldErrors = {};

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be greater than zero.';
  }
  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be greater than zero.';
  }
  if (input.childMode && input.ageText.trim() !== '') {
    const a = parseNumber(input.ageText);
    if (a === null) errors.ageText = 'Enter a valid age.';
    else if (!(a >= 2 && a <= 19)) {
      errors.ageText = 'Pediatric age must be between 2 and 19 years.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateOverweight(input) };
}
