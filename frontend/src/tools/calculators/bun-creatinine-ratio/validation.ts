import { calculateBunCreatinineRatio, parseNumber } from './calculation';
import type {
  BunCreatinineRatioFieldErrors,
  BunCreatinineRatioInput,
  BunCreatinineRatioResult,
} from './types';

export interface BunCreatinineRatioValidation {
  errors: BunCreatinineRatioFieldErrors;
  result: BunCreatinineRatioResult | null;
}

export function validateBunCreatinineRatioInput(
  input: BunCreatinineRatioInput,
): BunCreatinineRatioValidation {
  const errors: BunCreatinineRatioFieldErrors = {};

  if (input.bunText.trim() !== '') {
    const b = parseNumber(input.bunText);
    if (b === null) errors.bunText = 'Enter a valid BUN/urea value.';
    else if (b < 0) errors.bunText = 'BUN/urea must be non-negative.';
  }

  if (input.creatinineText.trim() !== '') {
    const c = parseNumber(input.creatinineText);
    if (c === null) errors.creatinineText = 'Enter a valid creatinine value.';
    else if (c < 0) errors.creatinineText = 'Creatinine must be non-negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateBunCreatinineRatio(input),
  };
}
