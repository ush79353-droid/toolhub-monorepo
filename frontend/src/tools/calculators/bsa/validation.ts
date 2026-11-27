import { calculateBsa, parseNumber } from './calculation';
import type { BsaFieldErrors, BsaInput, BsaResult } from './types';

export interface BsaValidation {
  errors: BsaFieldErrors;
  result: BsaResult | null;
}

export function validateBsaInput(input: BsaInput): BsaValidation {
  const errors: BsaFieldErrors = {};

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

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateBsa(input) };
}
