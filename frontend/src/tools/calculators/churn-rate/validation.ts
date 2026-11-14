import { calculateChurnRate } from './calculation';
import type {
  ChurnRateFieldErrors,
  ChurnRateInput,
  ChurnRateResult,
} from './types';

export interface ChurnRateDraftStrings {
  startingCustomers: string;
  customersLost: string;
}

export interface ChurnRateValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: ChurnRateFieldErrors;
  result: ChurnRateResult | null;
}

function parseNonNegative(raw: string, label: string): {
  value: number | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (!/^\+?\d+(\.\d+)?$/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error: `${label} must be a non-negative number.`,
    };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (value < 0) {
    return { value: null, blank: false, error: `${label} cannot be negative.` };
  }
  return { value, blank: false };
}

export function validateChurnRateDraft(draft: ChurnRateDraftStrings): ChurnRateValidation {
  const errors: ChurnRateFieldErrors = {};
  const start = parseNonNegative(draft.startingCustomers, 'Starting customers');
  const lost = parseNonNegative(draft.customersLost, 'Customers lost');
  const anyBlank = start.blank || lost.blank;

  if (!start.blank && start.error) errors.startingCustomers = start.error;
  if (!lost.blank && lost.error) errors.customersLost = lost.error;

  if (!start.blank && start.value !== null && start.value <= 0) {
    errors.startingCustomers = 'Starting customers must be greater than zero.';
  }

  if (
    !anyBlank &&
    start.value !== null &&
    lost.value !== null &&
    !errors.startingCustomers &&
    !errors.customersLost &&
    lost.value > start.value
  ) {
    errors.customersLost = 'Customers lost cannot exceed starting customers.';
  }

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  const input: ChurnRateInput = {
    startingCustomers: start.value!,
    customersLost: lost.value!,
  };
  const result = calculateChurnRate(input);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
