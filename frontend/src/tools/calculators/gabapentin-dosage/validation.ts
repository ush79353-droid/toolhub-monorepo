import { calculateGabapentinDosage, parseAgeYears } from './calculation';
import type {
  GabapentinDosageFieldErrors,
  GabapentinDosageInput,
  GabapentinDosageResult,
} from './types';

export interface GabapentinDosageValidation {
  isValid: boolean;
  errors: GabapentinDosageFieldErrors;
  result: GabapentinDosageResult | null;
}

export function validateGabapentinDosageInput(
  input: GabapentinDosageInput,
): GabapentinDosageValidation {
  const errors: GabapentinDosageFieldErrors = {};

  const age = parseAgeYears(input.ageYearsText);
  if (age === 'invalid') {
    errors.ageYearsText = 'Enter a valid age from 0 to 120 years.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errors,
      result: calculateGabapentinDosage({ ...input, ageYearsText: '' }),
    };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateGabapentinDosage(input),
  };
}
