import {
  ADULT_AGE_MAX,
  ADULT_AGE_MIN,
  calculateEerCalculator,
  parseNumber,
} from './calculation';
import type {
  EerCalculatorFieldErrors,
  EerCalculatorInput,
  EerCalculatorResult,
} from './types';

export interface EerCalculatorValidation {
  errors: EerCalculatorFieldErrors;
  result: EerCalculatorResult | null;
}

export function validateEerCalculatorInput(
  input: EerCalculatorInput,
): EerCalculatorValidation {
  const errors: EerCalculatorFieldErrors = {};

  if (input.ageYearsText.trim() !== '') {
    const age = parseNumber(input.ageYearsText);
    if (age === null) errors.ageYearsText = 'Enter a valid age.';
    else if (!(age >= ADULT_AGE_MIN && age <= ADULT_AGE_MAX)) {
      errors.ageYearsText = `Age must be ${ADULT_AGE_MIN}–${ADULT_AGE_MAX} years for adult EER.`;
    }
  }

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

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateEerCalculator(input) };
}
