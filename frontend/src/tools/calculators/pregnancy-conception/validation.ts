import {
  MAX_CYCLE_DAYS,
  MIN_CYCLE_DAYS,
} from '../due-date/types';
import { isValidIsoDate } from '../due-date/calculation';
import {
  calculatePregnancyConception,
  parseWholeNumber,
} from './calculation';
import type {
  PregnancyConceptionFieldErrors,
  PregnancyConceptionInput,
  PregnancyConceptionResult,
} from './types';

export interface PregnancyConceptionValidation {
  isValid: boolean;
  errors: PregnancyConceptionFieldErrors;
  result: PregnancyConceptionResult | null;
}

export function collectFieldErrors(
  input: PregnancyConceptionInput,
): PregnancyConceptionFieldErrors {
  const errors: PregnancyConceptionFieldErrors = {};

  if (
    input.method !== 'dueDate' &&
    input.method !== 'lmp' &&
    input.method !== 'ultrasound'
  ) {
    errors.form = 'Select a dating method.';
    return errors;
  }

  if (input.method === 'dueDate') {
    if (input.dueDate.trim() === '') {
      errors.dueDate = 'Enter your due date.';
    } else if (!isValidIsoDate(input.dueDate)) {
      errors.dueDate = 'Enter a valid due date.';
    }
  }

  if (input.method === 'lmp') {
    if (input.lmpDate.trim() === '') {
      errors.lmpDate = 'Enter the first day of your last period.';
    } else if (!isValidIsoDate(input.lmpDate)) {
      errors.lmpDate = 'Enter a valid LMP date.';
    }
    const cycle = parseWholeNumber(input.cycleDays);
    if (input.cycleDays.trim() === '' || cycle == null) {
      errors.cycleDays = 'Enter average cycle length in days.';
    } else if (cycle < MIN_CYCLE_DAYS || cycle > MAX_CYCLE_DAYS) {
      errors.cycleDays = `Cycle length must be ${MIN_CYCLE_DAYS}–${MAX_CYCLE_DAYS} days.`;
    }
  }

  if (input.method === 'ultrasound') {
    if (input.ultrasoundDate.trim() === '') {
      errors.ultrasoundDate = 'Enter the ultrasound date.';
    } else if (!isValidIsoDate(input.ultrasoundDate)) {
      errors.ultrasoundDate = 'Enter a valid ultrasound date.';
    }
    const weeks = parseWholeNumber(input.ultrasoundWeeks);
    const days = parseWholeNumber(input.ultrasoundDays);
    if (input.ultrasoundWeeks.trim() === '' || weeks == null) {
      errors.ultrasoundWeeks = 'Enter gestational age weeks.';
    } else if (weeks < 0 || weeks > 42) {
      errors.ultrasoundWeeks = 'Weeks must be 0–42.';
    }
    if (input.ultrasoundDays.trim() === '' || days == null) {
      errors.ultrasoundDays = 'Enter gestational age days (0–6).';
    } else if (days < 0 || days > 6) {
      errors.ultrasoundDays = 'Days must be 0–6.';
    }
  }

  return errors;
}

export function hasFieldErrors(
  errors: PregnancyConceptionFieldErrors,
): boolean {
  return Object.keys(errors).length > 0;
}

export function validatePregnancyConceptionInput(
  input: PregnancyConceptionInput,
): PregnancyConceptionValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculatePregnancyConception(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to estimate conception with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
