import {
  calculateFertilityByAge,
  findBand,
  MAX_AGE,
  MIN_AGE,
} from './calculation';
import type {
  FertilityByAgeFieldErrors,
  FertilityByAgeInput,
  FertilityByAgeResult,
} from './types';

export interface FertilityByAgeValidation {
  isValid: boolean;
  errors: FertilityByAgeFieldErrors;
  result: FertilityByAgeResult | null;
}

export function validateFertilityByAgeInput(
  input: FertilityByAgeInput
): FertilityByAgeValidation {
  const errors: FertilityByAgeFieldErrors = {};
  const raw = input.ageYears.trim();

  if (raw === '') {
    return { isValid: false, errors, result: null };
  }

  if (!/^\d+$/.test(raw)) {
    errors.ageYears = 'Select an age in years.';
    return { isValid: false, errors, result: null };
  }

  const age = Number(raw);
  if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) {
    errors.ageYears = `Select an age between ${MIN_AGE} and ${MAX_AGE} years.`;
    return { isValid: false, errors, result: null };
  }

  const band = findBand(age);
  if (!band) {
    errors.ageYears = 'No educational rate is published for this age in this tool.';
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculateFertilityByAge(input, age, band),
  };
}
