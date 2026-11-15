import {
  MAX_REGULAR_HOURS,
  MAX_WAGE,
  type TwelveHourShiftPayFieldErrors,
  type TwelveHourShiftPayInput,
} from './types';

export function validateTwelveHourShiftPay(input: TwelveHourShiftPayInput): {
  isValid: boolean;
  errors: TwelveHourShiftPayFieldErrors;
} {
  const errors: TwelveHourShiftPayFieldErrors = {};

  if (!Number.isFinite(input.hourlyWage)) {
    errors.hourlyWage = 'Enter an hourly wage greater than 0.';
  } else if (input.hourlyWage <= 0) {
    errors.hourlyWage = 'Hourly wage must be greater than 0.';
  } else if (input.hourlyWage > MAX_WAGE) {
    errors.hourlyWage = 'Enter an hourly wage of 1,000,000 or less.';
  }

  if (!Number.isFinite(input.overtimeHourlyWage)) {
    errors.overtimeHourlyWage = 'Enter an overtime hourly wage greater than 0.';
  } else if (input.overtimeHourlyWage <= 0) {
    errors.overtimeHourlyWage = 'Overtime hourly wage must be greater than 0.';
  } else if (input.overtimeHourlyWage > MAX_WAGE) {
    errors.overtimeHourlyWage = 'Enter an overtime wage of 1,000,000 or less.';
  }

  if (!Number.isFinite(input.regularHours)) {
    errors.regularHours = 'Enter regular hours from 0 to 12.';
  } else if (input.regularHours < 0) {
    errors.regularHours = 'Regular hours cannot be negative.';
  } else if (input.regularHours > MAX_REGULAR_HOURS) {
    errors.regularHours = 'Regular hours must be from 0 to 12 on a 12-hour shift.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
