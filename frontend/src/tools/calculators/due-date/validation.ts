import { calculateDueDate, isValidIsoDate } from './calculation';
import {
  MAX_CYCLE_DAYS,
  MIN_CYCLE_DAYS,
  type DueDateFieldErrors,
  type DueDateInput,
  type DueDateResult,
} from './types';

export interface DueDateValidation {
  isValid: boolean;
  errors: DueDateFieldErrors;
  result: DueDateResult | null;
}

function parseCycleDays(
  raw: string,
  errors: DueDateFieldErrors,
): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') {
    errors.cycleDays = 'Enter your average cycle length in days.';
    return null;
  }
  const n = Number(t);
  if (!Number.isFinite(n)) {
    errors.cycleDays = 'Enter a valid cycle length in days.';
    return null;
  }
  if (Math.abs(n - Math.round(n)) > 1e-9) {
    errors.cycleDays = 'Cycle length must be a whole number of days.';
    return null;
  }
  const days = Math.round(n);
  if (days < MIN_CYCLE_DAYS || days > MAX_CYCLE_DAYS) {
    errors.cycleDays = `Cycle length must be between ${MIN_CYCLE_DAYS} and ${MAX_CYCLE_DAYS} days for this estimate.`;
    return null;
  }
  return days;
}

export function validateDueDateInput(input: DueDateInput): DueDateValidation {
  const errors: DueDateFieldErrors = {};

  if (input.method === 'lmp') {
    if (input.lmpDate.trim() === '') {
      return { isValid: false, errors: {}, result: null };
    }
    if (!isValidIsoDate(input.lmpDate)) {
      errors.lmpDate = 'Enter a valid last-period start date.';
      return { isValid: false, errors, result: null };
    }
    const cycleDays = parseCycleDays(input.cycleDays, errors);
    if (cycleDays == null) {
      return { isValid: false, errors, result: null };
    }
    const result = calculateDueDate({
      method: 'lmp',
      lmpDate: input.lmpDate.trim(),
      cycleDays,
      conceptionDate: '',
    });
    if (!result) {
      errors.lmpDate = 'Unable to estimate a due date from these values.';
      return { isValid: false, errors, result: null };
    }
    return { isValid: true, errors: {}, result };
  }

  if (input.conceptionDate.trim() === '') {
    return { isValid: false, errors: {}, result: null };
  }
  if (!isValidIsoDate(input.conceptionDate)) {
    errors.conceptionDate = 'Enter a valid conception date.';
    return { isValid: false, errors, result: null };
  }
  const result = calculateDueDate({
    method: 'conception',
    lmpDate: '',
    cycleDays: 28,
    conceptionDate: input.conceptionDate.trim(),
  });
  if (!result) {
    errors.conceptionDate = 'Unable to estimate a due date from these values.';
    return { isValid: false, errors, result: null };
  }
  return { isValid: true, errors: {}, result };
}
