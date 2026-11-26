import { calculateBai, parseNumber } from './calculation';
import type { BaiFieldErrors, BaiInput, BaiResult } from './types';

export interface BaiValidation {
  errors: BaiFieldErrors;
  result: BaiResult | null;
}

export function validateBaiInput(input: BaiInput): BaiValidation {
  const errors: BaiFieldErrors = {};

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be greater than zero.';
  }

  if (input.hipText.trim() !== '') {
    const hip = parseNumber(input.hipText);
    if (hip === null) errors.hipText = 'Enter a valid hip circumference.';
    else if (!(hip > 0))
      errors.hipText = 'Hip circumference must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateBai(input) };
}
