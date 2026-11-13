import {
  MAX_REGULAR_HOURS,
  MAX_SHIFT_HOURS,
  MAX_SHIFTS_PER_WEEK,
  MAX_WAGE,
  MAX_WEEKS_PER_YEAR,
  type TwelveHourShiftPayFieldErrors,
  type TwelveHourShiftPayInput,
} from './types';

function finiteInRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function validateTwelveHourShiftPay(input: TwelveHourShiftPayInput): {
  isValid: boolean;
  errors: TwelveHourShiftPayFieldErrors;
} {
  const errors: TwelveHourShiftPayFieldErrors = {};

  if (!Number.isFinite(input.hourlyWage)) {
    errors.hourlyWage = 'Enter an hourly wage of 0 or more.';
  } else if (input.hourlyWage < 0) {
    errors.hourlyWage = 'Hourly wage cannot be negative.';
  } else if (input.hourlyWage > MAX_WAGE) {
    errors.hourlyWage = 'Enter an hourly wage of 1,000,000 or less.';
  }

  if (!Number.isFinite(input.overtimeHourlyWage)) {
    errors.overtimeHourlyWage = 'Enter an overtime hourly wage, or use the 1.5× suggestion.';
  } else if (input.overtimeHourlyWage < 0) {
    errors.overtimeHourlyWage = 'Overtime wage cannot be negative.';
  } else if (input.overtimeHourlyWage > MAX_WAGE) {
    errors.overtimeHourlyWage = 'Enter an overtime wage of 1,000,000 or less.';
  }

  if (!Number.isFinite(input.regularHours)) {
    errors.regularHours = 'Enter regular hours from 0 to 12.';
  } else if (input.regularHours < 0 || input.regularHours > MAX_REGULAR_HOURS) {
    errors.regularHours = 'Regular hours must be from 0 to 12.';
  }

  if (!Number.isFinite(input.shiftHours) || input.shiftHours <= 0 || input.shiftHours > MAX_SHIFT_HOURS) {
    errors.shiftHours = 'Shift length must be greater than 0 and at most 24 hours.';
  } else if (
    !errors.regularHours &&
    Number.isFinite(input.regularHours) &&
    input.regularHours > input.shiftHours
  ) {
    errors.regularHours = 'Regular hours cannot be longer than the shift.';
  }

  if (!finiteInRange(input.shiftsPerWeek, 0, MAX_SHIFTS_PER_WEEK)) {
    errors.shiftsPerWeek = 'Shifts per week must be from 0 to 14.';
  }

  if (!finiteInRange(input.weeksPerYear, 1, MAX_WEEKS_PER_YEAR)) {
    errors.weeksPerYear = 'Weeks per year must be from 1 to 53.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
