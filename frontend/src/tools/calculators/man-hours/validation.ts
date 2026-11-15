import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateManHoursResult } from './calculation';
import type { ManHoursFieldErrors, ManHoursInput, ManHoursResult } from './types';

function parseOptionalNumber(value: string): number | null | typeof Number.NaN {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateManHoursInput(input: ManHoursInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: ManHoursFieldErrors;
  result: ManHoursResult | null;
} {
  const errors: ManHoursFieldErrors = {};

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  const people = parseOptionalNumber(input.people);
  const hoursPerPerson = parseOptionalNumber(input.hoursPerPerson);
  const hourlyPay = parseOptionalNumber(input.hourlyPay);

  if (people === null || hoursPerPerson === null || hourlyPay === null) {
    return {
      isValid: false,
      incomplete: true,
      errors,
      result: null,
    };
  }

  if (Number.isNaN(people) || people < 0 || !Number.isInteger(people)) {
    errors.people = 'Enter a whole number of people (0 or more)';
  }
  if (Number.isNaN(hoursPerPerson) || hoursPerPerson < 0) {
    errors.hoursPerPerson = 'Hours per person cannot be negative';
  }
  if (Number.isNaN(hourlyPay) || hourlyPay < 0) {
    errors.hourlyPay = 'Hourly pay cannot be negative';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateManHoursResult(people, hoursPerPerson, hourlyPay, input.currency);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
