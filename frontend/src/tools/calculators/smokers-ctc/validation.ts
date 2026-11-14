import { buildSmokersCtcResult } from './calculation';
import type {
  SmokersCtcFieldErrors,
  SmokersCtcInput,
  SmokersCtcResult,
} from './types';

export interface SmokersCtcValidation {
  errors: SmokersCtcFieldErrors;
  result: SmokersCtcResult | null;
}

function requireNonNegative(
  value: number,
  label: string,
  allowZero = true
): string | undefined {
  if (!Number.isFinite(value)) return `Enter a valid ${label}.`;
  if (value < 0) return `${label} cannot be negative.`;
  if (!allowZero && value === 0) return `${label} must be greater than zero.`;
  return undefined;
}

/** Wage and pack price may be blank (NaN); other fields must be valid numbers. */
export function validateSmokersCtc(input: SmokersCtcInput): SmokersCtcValidation {
  const errors: SmokersCtcFieldErrors = {};

  const breakErr = requireNonNegative(input.breakMinutes, 'Avg smoke time break');
  if (breakErr) errors.breakMinutes = breakErr;

  const breaksErr = requireNonNegative(input.breaksPerDay, 'Smoke breaks per day');
  if (breaksErr) errors.breaksPerDay = breaksErr;

  const hoursErr = requireNonNegative(input.hoursPerDay, 'Hours per day', false);
  if (hoursErr) errors.hoursPerDay = hoursErr;

  const daysErr = requireNonNegative(input.daysPerWeek, 'Days per week');
  if (daysErr) errors.daysPerWeek = daysErr;
  else if (input.daysPerWeek > 7) {
    errors.daysPerWeek = 'Days per week cannot exceed 7.';
  }

  const holidayErr = requireNonNegative(input.holidayDays, 'Holiday days per year');
  if (holidayErr) errors.holidayDays = holidayErr;

  if (!Number.isNaN(input.wage) && !Number.isFinite(input.wage)) {
    errors.wage = 'Enter a valid wage.';
  } else if (Number.isFinite(input.wage) && input.wage < 0) {
    errors.wage = 'Wage cannot be negative.';
  }

  if (!Number.isNaN(input.packPrice) && !Number.isFinite(input.packPrice)) {
    errors.packPrice = 'Enter a valid pack price.';
  } else if (Number.isFinite(input.packPrice) && input.packPrice < 0) {
    errors.packPrice = 'Pack price cannot be negative.';
  }

  const packCountErr = requireNonNegative(
    input.cigarettesPerPack,
    'Cigarettes per pack',
    false
  );
  if (packCountErr) errors.cigarettesPerPack = packCountErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: buildSmokersCtcResult(input) };
}
