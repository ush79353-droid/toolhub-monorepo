import { calculateDri, parseNumber } from './calculation';
import type { DriFieldErrors, DriInput, DriResult } from './types';

export interface DriValidation {
  errors: DriFieldErrors;
  result: DriResult | null;
}

export function validateDriInput(input: DriInput): DriValidation {
  const errors: DriFieldErrors = {};

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be positive.';
  }

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateDri(input) };
}
