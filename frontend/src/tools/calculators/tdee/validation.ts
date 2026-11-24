import { AGE_MAX, AGE_MIN, calculateTdee, parseNumber } from './calculation';
import type { TdeeFieldErrors, TdeeInput, TdeeResult } from './types';

export interface TdeeValidation {
  isValid: boolean;
  errors: TdeeFieldErrors;
  result: TdeeResult | null;
}

export function validateTdeeInput(input: TdeeInput): TdeeValidation {
  const errors: TdeeFieldErrors = {};

  const age = parseNumber(input.ageYearsText);
  if (input.ageYearsText.trim() !== '' && age === null) {
    errors.ageYearsText = 'Enter a valid age.';
  } else if (age !== null && !(age >= AGE_MIN && age <= AGE_MAX)) {
    errors.ageYearsText = `Age must be between ${AGE_MIN} and ${AGE_MAX} years.`;
  }

  const h = parseNumber(input.heightText);
  if (input.heightText.trim() !== '' && h === null) {
    errors.heightText = 'Enter a valid height.';
  } else if (h !== null && !(h > 0)) {
    errors.heightText = 'Height must be greater than 0.';
  }

  const w = parseNumber(input.weightText);
  if (input.weightText.trim() !== '' && w === null) {
    errors.weightText = 'Enter a valid weight.';
  } else if (w !== null && !(w > 0)) {
    errors.weightText = 'Weight must be greater than 0.';
  }

  const result = calculateTdee(input);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    result,
  };
}
