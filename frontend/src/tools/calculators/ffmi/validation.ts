import { calculateFfmi, parseNumber } from './calculation';
import type { FfmiFieldErrors, FfmiInput, FfmiResult } from './types';

export interface FfmiValidation {
  errors: FfmiFieldErrors;
  result: FfmiResult | null;
}

export function validateFfmiInput(input: FfmiInput): FfmiValidation {
  const errors: FfmiFieldErrors = {};

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

  if (input.bodyFatText.trim() !== '') {
    const f = parseNumber(input.bodyFatText);
    if (f === null) errors.bodyFatText = 'Enter a valid body fat %.';
    else if (!(f >= 0) || !(f < 100))
      errors.bodyFatText = 'Body fat % must be ≥ 0 and < 100.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateFfmi(input) };
}
