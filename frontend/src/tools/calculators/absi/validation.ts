import { calculateAbsi, parseNumber } from './calculation';
import type { AbsiFieldErrors, AbsiInput, AbsiResult } from './types';

export interface AbsiValidation {
  errors: AbsiFieldErrors;
  result: AbsiResult | null;
}

export function validateAbsiInput(input: AbsiInput): AbsiValidation {
  const errors: AbsiFieldErrors = {};

  if (input.ageText.trim() !== '') {
    const age = parseNumber(input.ageText);
    if (age === null) errors.ageText = 'Enter a valid age in years.';
    else if (age < 0) errors.ageText = 'Age cannot be negative.';
    else if (age > 120) errors.ageText = 'Enter an age of 120 years or less.';
  }

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be greater than zero.';
  }

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be greater than zero.';
  }

  if (input.waistText.trim() !== '') {
    const waist = parseNumber(input.waistText);
    if (waist === null) errors.waistText = 'Enter a valid waist circumference.';
    else if (!(waist > 0))
      errors.waistText = 'Waist circumference must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAbsi(input),
  };
}
