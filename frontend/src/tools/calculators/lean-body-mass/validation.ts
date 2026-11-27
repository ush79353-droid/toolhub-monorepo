import { calculateLeanBodyMass, parseNumber } from './calculation';
import type { LbmFieldErrors, LbmInput, LbmResult } from './types';

export interface LbmValidation {
  errors: LbmFieldErrors;
  result: LbmResult | null;
}

export function validateLbmInput(input: LbmInput): LbmValidation {
  const errors: LbmFieldErrors = {};

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

  return { errors: {}, result: calculateLeanBodyMass(input) };
}
