import { calculateAdderallDosage, parseNumber } from './calculation';
import type {
  AdderallDosageFieldErrors,
  AdderallDosageInput,
  AdderallDosageResult,
} from './types';

export interface AdderallDosageValidation {
  errors: AdderallDosageFieldErrors;
  result: AdderallDosageResult | null;
}

export function validateAdderallDosageInput(
  input: AdderallDosageInput,
): AdderallDosageValidation {
  const errors: AdderallDosageFieldErrors = {};

  if (input.ageYearsText.trim() !== '') {
    const age = parseNumber(input.ageYearsText);
    if (age === null) errors.ageYearsText = 'Enter a valid age in years.';
    else if (age < 0) errors.ageYearsText = 'Age cannot be negative.';
  }

  if (input.indication === 'custom' && input.prescribedDoseMgText.trim() !== '') {
    const dose = parseNumber(input.prescribedDoseMgText);
    if (dose === null) {
      errors.prescribedDoseMgText = 'Enter a valid prescribed dose in mg.';
    } else if (!(dose > 0)) {
      errors.prescribedDoseMgText = 'Prescribed dose must be positive.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateAdderallDosage(input) };
}
