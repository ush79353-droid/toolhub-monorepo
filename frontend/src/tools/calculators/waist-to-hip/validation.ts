import { calculateWhr, parseNumber } from './calculation';
import type { WhrFieldErrors, WhrInput, WhrResult } from './types';

export interface WhrValidation {
  errors: WhrFieldErrors;
  result: WhrResult | null;
}

export function validateWhrInput(input: WhrInput): WhrValidation {
  const errors: WhrFieldErrors = {};

  if (input.waistText.trim() !== '') {
    const w = parseNumber(input.waistText);
    if (w === null) errors.waistText = 'Enter a valid waist circumference.';
    else if (!(w > 0))
      errors.waistText = 'Waist circumference must be greater than zero.';
  }

  if (input.hipText.trim() !== '') {
    const h = parseNumber(input.hipText);
    if (h === null) errors.hipText = 'Enter a valid hip circumference.';
    else if (!(h > 0))
      errors.hipText = 'Hip circumference must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateWhr(input) };
}
