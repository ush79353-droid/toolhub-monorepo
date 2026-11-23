import {
  calculateOvulation,
  MAX_CYCLE_DAYS,
  MIN_CYCLE_DAYS,
} from './calculation';
import { isValidIsoDate } from '../due-date/calculation';
import type {
  OvulationFieldErrors,
  OvulationInput,
  OvulationResult,
} from './types';

export interface OvulationValidation {
  isValid: boolean;
  errors: OvulationFieldErrors;
  result: OvulationResult | null;
}

function parseCycleDays(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim();
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (!/^\d+$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateOvulationInput(
  input: OvulationInput,
): OvulationValidation {
  const errors: OvulationFieldErrors = {};
  const cycle = parseCycleDays(input.cycleDurationDays);

  if (cycle.blank || cycle.invalid || cycle.value == null) {
    errors.cycleDurationDays = `Enter a whole-number cycle length (${MIN_CYCLE_DAYS}–${MAX_CYCLE_DAYS} days).`;
  } else if (
    cycle.value < MIN_CYCLE_DAYS ||
    cycle.value > MAX_CYCLE_DAYS
  ) {
    errors.cycleDurationDays = `Cycle length must be between ${MIN_CYCLE_DAYS} and ${MAX_CYCLE_DAYS} days.`;
  }

  const lmp = input.lastPeriodIso.trim();
  if (!lmp) {
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    return { isValid: false, errors, result: null };
  }
  if (!isValidIsoDate(lmp)) {
    errors.lastPeriodIso = 'Enter a valid last-period start date.';
  }

  if (Object.keys(errors).length > 0 || cycle.value == null) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateOvulation({
    cycleDurationDays: input.cycleDurationDays,
    lastPeriodIso: lmp,
    cycleLengthDays: cycle.value,
  });

  if (!result) {
    errors.form = 'Unable to estimate ovulation from the entered values.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
