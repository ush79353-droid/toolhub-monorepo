import { calculateWhtr, parseNumber } from './calculation';
import type { WhtrFieldErrors, WhtrInput, WhtrResult } from './types';

export interface WhtrValidation {
  errors: WhtrFieldErrors;
  result: WhtrResult | null;
}

export function validateWhtrInput(input: WhtrInput): WhtrValidation {
  const errors: WhtrFieldErrors = {};

  if (input.waistText.trim() !== '') {
    const w = parseNumber(input.waistText);
    if (w === null) errors.waistText = 'Enter a valid waist circumference.';
    else if (!(w > 0))
      errors.waistText = 'Waist circumference must be greater than zero.';
  }

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateWhtr(input) };
}
