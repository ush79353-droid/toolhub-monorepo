import { isValidIsoDate } from '../due-date/calculation';
import { calculateGestationalAge } from './calculation';
import type {
  GestationalAgeFieldErrors,
  GestationalAgeInput,
  GestationalAgeResult,
} from './types';

export interface GestationalAgeValidation {
  isValid: boolean;
  errors: GestationalAgeFieldErrors;
  result: GestationalAgeResult | null;
}

export function validateGestationalAgeInput(
  input: GestationalAgeInput,
): GestationalAgeValidation {
  const errors: GestationalAgeFieldErrors = {};
  const due = input.dueDate.trim();
  const current = input.currentDate.trim();

  if (due && !isValidIsoDate(due)) {
    errors.dueDate = 'Enter a valid estimated due date.';
  }
  if (current && !isValidIsoDate(current)) {
    errors.currentDate = 'Enter a valid current date.';
  }

  if (!due || !current) {
    return { isValid: false, errors, result: null };
  }

  if (errors.dueDate || errors.currentDate) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateGestationalAge(input);
  if (!result) {
    errors.form = 'Unable to calculate gestational age from the dates entered.';
    return { isValid: false, errors, result: null };
  }

  if (result.gestationalAgeDays > 320) {
    errors.form =
      'Gestational age is outside the supported educational range for this calculator.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}