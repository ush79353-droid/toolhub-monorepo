import { calculateMedicine3TimesADay, parseHhMm } from './calculation';
import type {
  Medicine3TimesADayFieldErrors,
  Medicine3TimesADayInput,
  Medicine3TimesADayResult,
} from './types';

export interface Medicine3TimesADayValidation {
  isValid: boolean;
  errors: Medicine3TimesADayFieldErrors;
  result: Medicine3TimesADayResult | null;
}

export function validateMedicine3TimesADayInput(
  input: Medicine3TimesADayInput,
): Medicine3TimesADayValidation {
  const errors: Medicine3TimesADayFieldErrors = {};
  const raw = input.firstDoseTime.trim();

  if (!raw) {
    return { isValid: false, errors, result: null };
  }

  if (parseHhMm(raw) == null) {
    errors.firstDoseTime = 'Enter a valid first dose time.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateMedicine3TimesADay(input);
  if (!result) {
    errors.form = 'Unable to build a dose schedule from the values entered.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
