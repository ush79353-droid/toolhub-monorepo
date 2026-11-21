import { calculateBloodDonationDueDate, isValidIsoDate } from './calculation';
import type {
  BloodDonationDueDateFieldErrors,
  BloodDonationDueDateInput,
  BloodDonationDueDateResult,
} from './types';

export interface BloodDonationDueDateValidation {
  isValid: boolean;
  errors: BloodDonationDueDateFieldErrors;
  result: BloodDonationDueDateResult | null;
}

function parsePeriod(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function collectFieldErrors(
  input: BloodDonationDueDateInput
): BloodDonationDueDateFieldErrors {
  const errors: BloodDonationDueDateFieldErrors = {};
  const period = parsePeriod(input.periodValue);
  const last = input.lastDonationDate.trim();

  if (period.blank) {
    errors.periodValue = 'Enter the period between donations.';
  } else if (period.invalid || period.value == null) {
    errors.periodValue = 'Enter a valid period.';
  } else if (period.value < 0) {
    errors.periodValue = 'Period cannot be negative.';
  } else if (input.periodUnit === 'months' && !Number.isInteger(period.value)) {
    errors.periodValue = 'Use a whole number of months.';
  } else if (input.periodUnit === 'days' && !Number.isInteger(period.value)) {
    errors.periodValue = 'Use a whole number of days.';
  } else if (input.periodUnit === 'weeks' && !Number.isInteger(period.value)) {
    errors.periodValue = 'Use a whole number of weeks (or switch to days).';
  }

  if (last === '') {
    errors.lastDonationDate = 'Enter the last donation date.';
  } else if (!isValidIsoDate(last)) {
    errors.lastDonationDate = 'Enter a valid calendar date.';
  }

  return errors;
}

export function hasFieldErrors(
  errors: BloodDonationDueDateFieldErrors
): boolean {
  return Object.keys(errors).length > 0;
}

export function validateBloodDonationDueDateInput(
  input: BloodDonationDueDateInput
): BloodDonationDueDateValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateBloodDonationDueDate(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
