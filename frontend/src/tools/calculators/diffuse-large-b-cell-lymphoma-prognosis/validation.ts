import { parseAgeYears, calculateDlbclPrognosis } from './calculation';
import type {
  DlbclPrognosisFieldErrors,
  DlbclPrognosisInput,
  DlbclPrognosisResult,
} from './types';

export interface DlbclPrognosisValidation {
  isValid: boolean;
  errors: DlbclPrognosisFieldErrors;
  result: DlbclPrognosisResult | null;
}

export function validateDlbclPrognosisInput(
  input: DlbclPrognosisInput,
): DlbclPrognosisValidation {
  const errors: DlbclPrognosisFieldErrors = {};
  if (input.ageYearsText.trim() !== '') {
    const age = parseAgeYears(input.ageYearsText);
    if (age === null) {
      errors.ageYearsText = 'Enter a valid age in years.';
    } else if (!(age >= 0 && age <= 120)) {
      errors.ageYearsText = 'Age must be between 0 and 120 years.';
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    result: calculateDlbclPrognosis(input),
  };
}