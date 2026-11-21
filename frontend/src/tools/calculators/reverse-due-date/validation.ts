import {
  calculateReverseDueDateFromInput,
  isValidIsoDate,
  pregnancyLengthToDays,
} from './calculation';
import type {
  ReverseDueDateFieldErrors,
  ReverseDueDateInput,
  ReverseDueDateResult,
} from './types';

export interface ReverseDueDateValidation {
  isValid: boolean;
  errors: ReverseDueDateFieldErrors;
  result: ReverseDueDateResult | null;
}

export function collectFieldErrors(
  input: ReverseDueDateInput,
): ReverseDueDateFieldErrors {
  const errors: ReverseDueDateFieldErrors = {};
  const lengthRaw = Number(input.pregnancyLength.trim().replace(/,/g, ''));
  if (input.pregnancyLength.trim() === '') {
    errors.pregnancyLength = 'Enter pregnancy length.';
  } else if (!Number.isFinite(lengthRaw) || lengthRaw <= 0) {
    errors.pregnancyLength = 'Enter a valid pregnancy length.';
  } else if (pregnancyLengthToDays(lengthRaw, input.lengthUnit) == null) {
    errors.pregnancyLength =
      'Pregnancy length must be between 22 and 43 weeks (or equivalent days).';
  }

  const due = input.dueDate.trim();
  const conception = input.conceptionDate.trim();
  const intercourse = input.intercourseDate.trim();

  if (due && !isValidIsoDate(due)) {
    errors.dueDate = 'Enter a valid due date.';
  }
  if (conception && !isValidIsoDate(conception)) {
    errors.conceptionDate = 'Enter a valid conception date.';
  }
  if (intercourse && !isValidIsoDate(intercourse)) {
    errors.intercourseDate = 'Enter a valid intercourse date.';
  }

  if (!due && !conception && !intercourse) {
    errors.form =
      'Enter a due date, conception date, or earliest intercourse date.';
  }

  return errors;
}

export function validateReverseDueDateInput(
  input: ReverseDueDateInput,
): ReverseDueDateValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateReverseDueDateFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
