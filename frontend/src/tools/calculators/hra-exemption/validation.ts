import { calculateHraFromInput } from './calculation';
import { isSupportedTaxYear } from './tax-rules';
import type { HraFieldErrors, HraInput, HraResult } from './types';

function parseNumber(raw: string): {
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

export interface HraValidation {
  isValid: boolean;
  errors: HraFieldErrors;
  result: HraResult | null;
}

function hasErrors(errors: HraFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(input: HraInput): HraFieldErrors {
  const errors: HraFieldErrors = {};

  const basic = parseNumber(input.basicSalary);
  if (!basic.blank) {
    if (basic.invalid || basic.value == null) {
      errors.basicSalary = 'Please enter a valid basic salary.';
    } else if (basic.value < 0) {
      errors.basicSalary = 'Basic salary cannot be negative.';
    }
  }

  const da = parseNumber(input.dearnessAllowance);
  if (!da.blank) {
    if (da.invalid || da.value == null) {
      errors.dearnessAllowance = 'Please enter a valid dearness allowance.';
    } else if (da.value < 0) {
      errors.dearnessAllowance = 'Dearness allowance cannot be negative.';
    }
  }

  const hra = parseNumber(input.hraReceived);
  if (!hra.blank) {
    if (hra.invalid || hra.value == null) {
      errors.hraReceived = 'Please enter a valid HRA amount.';
    } else if (hra.value < 0) {
      errors.hraReceived = 'HRA received cannot be negative.';
    }
  }

  const rent = parseNumber(input.rentPaid);
  if (!rent.blank) {
    if (rent.invalid || rent.value == null) {
      errors.rentPaid = 'Please enter a valid rent amount.';
    } else if (rent.value < 0) {
      errors.rentPaid = 'Rent paid cannot be negative.';
    }
  }

  if (!isSupportedTaxYear(input.taxYear)) {
    errors.taxYear = 'Please select a supported tax year.';
  }

  if (!input.city.trim()) {
    errors.city = 'Please select a city classification.';
  }

  if (input.enablePartialYear) {
    const m = parseNumber(input.eligibleMonths);
    if (m.blank) {
      errors.eligibleMonths = 'Enter eligible months (1–12).';
    } else if (
      m.invalid ||
      m.value == null ||
      !Number.isInteger(m.value) ||
      m.value < 1 ||
      m.value > 12
    ) {
      errors.eligibleMonths = 'Eligible months must be a whole number from 1 to 12.';
    }
  }

  return errors;
}

export function validateHraInput(input: HraInput): HraValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  if (
    input.basicSalary.trim() === '' ||
    input.dearnessAllowance.trim() === '' ||
    input.hraReceived.trim() === '' ||
    input.rentPaid.trim() === ''
  ) {
    return { isValid: false, errors: {}, result: null };
  }

  const result = calculateHraFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate HRA exemption with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
