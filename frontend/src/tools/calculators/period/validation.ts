import { isValidIsoDate } from '../due-date/calculation';
import { calculatePeriodForecast } from './calculation';
import type { PeriodFieldErrors, PeriodInput, PeriodResult } from './types';
import {
  MAX_CYCLE_DAYS,
  MAX_PERIOD_DAYS,
  MIN_CYCLE_DAYS,
  MIN_PERIOD_DAYS,
} from './types';

export interface PeriodValidation {
  isValid: boolean;
  errors: PeriodFieldErrors;
  result: PeriodResult | null;
}

function parseIntInRange(
  raw: string,
  min: number,
  max: number,
  label: string
): { value?: number; error?: string } {
  const t = raw.trim();
  if (t === '') return {};
  if (!/^\d+$/.test(t)) return { error: `${label} must be a whole number.` };
  const n = Number(t);
  if (!Number.isInteger(n) || n < min || n > max) {
    return { error: `${label} must be between ${min} and ${max}.` };
  }
  return { value: n };
}

export function validatePeriodInput(input: PeriodInput): PeriodValidation {
  const errors: PeriodFieldErrors = {};

  const cycle = parseIntInRange(
    input.cycleDays,
    MIN_CYCLE_DAYS,
    MAX_CYCLE_DAYS,
    'Cycle duration'
  );
  if (cycle.error) errors.cycleDays = cycle.error;

  const period = parseIntInRange(
    input.periodDays,
    MIN_PERIOD_DAYS,
    MAX_PERIOD_DAYS,
    'Period duration'
  );
  if (period.error) errors.periodDays = period.error;

  const lmp = input.lastPeriodIso.trim();
  if (lmp !== '' && !isValidIsoDate(lmp)) {
    errors.lastPeriodIso = 'Enter a valid last-period start date.';
  }

  if (cycle.value !== undefined && period.value !== undefined) {
    if (period.value >= cycle.value) {
      errors.periodDays =
        'Period duration must be shorter than cycle duration.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    cycle.value === undefined ||
    period.value === undefined ||
    lmp === ''
  ) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculatePeriodForecast(lmp, cycle.value, period.value),
  };
}
