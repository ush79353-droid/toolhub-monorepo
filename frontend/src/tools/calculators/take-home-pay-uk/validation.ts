import { calculateTakeHomePayUk } from './calculation';
import {
  UK_LOCATION_OPTIONS,
  UK_TAX_YEAR_OPTIONS,
  type UkLocation,
  type UkTaxYearId,
} from './tax-parameters';
import type {
  TakeHomePayUkFieldErrors,
  TakeHomePayUkInput,
  TakeHomePayUkResult,
} from './types';

export interface TakeHomePayUkValidation {
  isValid: boolean;
  errors: TakeHomePayUkFieldErrors;
  result: TakeHomePayUkResult | null;
}

function parseMoney(
  raw: string
): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: 0, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned) || !/^\d+(\.\d+)?$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function isLocation(v: string): v is UkLocation {
  return UK_LOCATION_OPTIONS.some((o) => o.value === v);
}

function isYear(v: string): v is UkTaxYearId {
  return UK_TAX_YEAR_OPTIONS.some((o) => o.id === v);
}

export function validateTakeHomePayUkInput(
  input: TakeHomePayUkInput
): TakeHomePayUkValidation {
  const errors: TakeHomePayUkFieldErrors = {};
  if (!isLocation(input.location)) errors.location = 'Select a location.';
  if (!isYear(input.taxYear)) errors.taxYear = 'Select a tax year.';

  const emp = parseMoney(input.employmentIncome);
  if (emp.invalid || emp.value == null) {
    errors.employmentIncome = 'Enter a nonnegative amount.';
  }
  const se = parseMoney(input.selfEmploymentIncome);
  if (se.invalid || se.value == null) {
    errors.selfEmploymentIncome = 'Enter a nonnegative amount.';
  }
  const rent = parseMoney(input.rentalIncome);
  if (rent.invalid || rent.value == null) {
    errors.rentalIncome = 'Enter a nonnegative amount.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateTakeHomePayUk({
    location: input.location,
    taxYear: input.taxYear,
    employmentIncome: emp.value!,
    selfEmploymentIncome: se.value!,
    rentalIncome: rent.value!,
  });
  if (!result) {
    errors.form = 'Unable to calculate with these inputs.';
    return { isValid: false, errors, result: null };
  }
  return { isValid: true, errors: {}, result };
}
