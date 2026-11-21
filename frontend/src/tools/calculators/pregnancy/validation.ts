import {
  calculatePregnancy,
  isValidIsoDate,
  lmpGestationDays,
  MAX_CYCLE_DAYS,
  MIN_CYCLE_DAYS,
  parseWholeNumber,
} from './calculation';
import type {
  PregnancyFieldErrors,
  PregnancyInput,
  PregnancyResult,
} from './types';

export interface PregnancyValidation {
  isValid: boolean;
  errors: PregnancyFieldErrors;
  result: PregnancyResult | null;
}

export function validatePregnancyInput(
  input: PregnancyInput,
  options?: { requireCalculateReady?: boolean },
): PregnancyValidation {
  const errors: PregnancyFieldErrors = {};
  const requireReady = options?.requireCalculateReady ?? true;

  if (input.primaryDate.trim() === '') {
    if (requireReady) errors.primaryDate = 'Enter a date.';
  } else if (!isValidIsoDate(input.primaryDate)) {
    errors.primaryDate = 'Enter a valid calendar date.';
  }

  if (input.method === 'lmp') {
    const cycle = parseWholeNumber(input.cycleDays);
    if (cycle == null) {
      errors.cycleDays = 'Enter average cycle length in whole days.';
    } else if (cycle < MIN_CYCLE_DAYS || cycle > MAX_CYCLE_DAYS) {
      errors.cycleDays = `Cycle length must be ${MIN_CYCLE_DAYS}–${MAX_CYCLE_DAYS} days.`;
    } else if (lmpGestationDays(cycle) == null) {
      errors.cycleDays = 'Enter a valid cycle length.';
    }
  }

  if (input.method === 'ultrasound') {
    const w = parseWholeNumber(input.usWeeks);
    const d = parseWholeNumber(input.usDays);
    if (w == null) {
      errors.usWeeks = 'Enter gestational weeks at the ultrasound.';
    } else if (w < 0 || w > 42) {
      errors.usWeeks = 'Gestational weeks must be 0–42.';
    }
    if (input.usDays.trim() !== '' && d == null) {
      errors.usDays = 'Enter days as 0–6.';
    } else if (d != null && (d < 0 || d > 6)) {
      errors.usDays = 'Extra days must be 0–6.';
    }
  }

  if (input.asOfDate.trim() !== '' && !isValidIsoDate(input.asOfDate)) {
    errors.asOfDate = 'Enter a valid as-of date.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (!requireReady && input.primaryDate.trim() === '') {
    return { isValid: true, errors: {}, result: null };
  }

  const result = calculatePregnancy(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate pregnancy dates from these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
