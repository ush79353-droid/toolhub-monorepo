import { calculateAgeAdjustedDDimer, parseNumber } from './calculation';
import type {
  AgeAdjustedDDimerFieldErrors,
  AgeAdjustedDDimerInput,
  AgeAdjustedDDimerResult,
} from './types';

export interface AgeAdjustedDDimerValidation {
  errors: AgeAdjustedDDimerFieldErrors;
  result: AgeAdjustedDDimerResult | null;
}

export function validateAgeAdjustedDDimerInput(
  input: AgeAdjustedDDimerInput,
): AgeAdjustedDDimerValidation {
  const errors: AgeAdjustedDDimerFieldErrors = {};

  if (input.ageYearsText.trim() !== '') {
    const age = parseNumber(input.ageYearsText);
    if (age === null) errors.ageYearsText = 'Enter a valid age.';
    else if (!(age >= 0 && age <= 120)) {
      errors.ageYearsText = 'Age must be between 0 and 120 years.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAgeAdjustedDDimer(input),
  };
}