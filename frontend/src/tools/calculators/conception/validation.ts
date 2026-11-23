import {
  calculateConception,
  localTodayIso,
  parseCycleDays,
} from './calculation';
import { isValidIsoDate } from '../due-date/calculation';
import type {
  ConceptionFieldErrors,
  ConceptionInput,
  ConceptionResult,
} from './types';

export interface ConceptionValidation {
  isValid: boolean;
  errors: ConceptionFieldErrors;
  result: ConceptionResult | null;
}

export function validateConceptionInput(
  input: ConceptionInput,
  asOfIso: string = localTodayIso()
): ConceptionValidation {
  const errors: ConceptionFieldErrors = {};
  const due = input.dueDate.trim();
  const lmp = input.lmpDate.trim();

  if (due && !isValidIsoDate(due)) {
    errors.dueDate = 'Enter a valid due date.';
  }
  if (lmp && !isValidIsoDate(lmp)) {
    errors.lmpDate = 'Enter a valid LMP date.';
  }

  const cycle = parseCycleDays(input.cycleDays);
  if (cycle == null) {
    errors.cycleDays = 'Choose a supported average cycle length.';
  }

  if (!due && !lmp) {
    return { isValid: false, errors, result: null };
  }

  if (errors.dueDate || errors.lmpDate || errors.cycleDays) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateConception(input, asOfIso);
  if (!result) {
    errors.form = 'Unable to estimate conception from the dates entered.';
    return { isValid: false, errors, result: null };
  }

  if (result.gestationalAgeDays > 300) {
    errors.form = 'Gestational age is outside the supported educational range.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
