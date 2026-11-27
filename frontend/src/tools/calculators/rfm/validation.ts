import { calculateRfm, parseNumber } from './calculation';
import type { RfmFieldErrors, RfmInput, RfmResult } from './types';

export interface RfmValidation {
  errors: RfmFieldErrors;
  result: RfmResult | null;
}

export function validateRfmInput(input: RfmInput): RfmValidation {
  const errors: RfmFieldErrors = {};

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be greater than zero.';
  }

  if (input.waistText.trim() !== '') {
    const w = parseNumber(input.waistText);
    if (w === null) errors.waistText = 'Enter a valid waist circumference.';
    else if (!(w > 0))
      errors.waistText = 'Waist circumference must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateRfm(input) };
}
