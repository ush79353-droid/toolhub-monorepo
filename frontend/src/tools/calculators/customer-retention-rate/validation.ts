import { calculateCustomerRetention } from './calculation';
import type {
  CustomerRetentionFieldErrors,
  CustomerRetentionInput,
  CustomerRetentionResult,
} from './types';

export interface CustomerRetentionDraft {
  existingCustomers: string;
  newCustomers: string;
  totalCustomers: string;
}

export interface CustomerRetentionValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: CustomerRetentionFieldErrors;
  result: CustomerRetentionResult | null;
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

export function emptyDraft(): CustomerRetentionDraft {
  return { existingCustomers: '', newCustomers: '', totalCustomers: '' };
}

export function validateCustomerRetentionDraft(
  draft: CustomerRetentionDraft
): CustomerRetentionValidation {
  const errors: CustomerRetentionFieldErrors = {};
  const existing = parseNonNegative(draft.existingCustomers, 'Existing customers');
  const neu = parseNonNegative(draft.newCustomers, 'New customers');
  const total = parseNonNegative(draft.totalCustomers, 'Total customers');
  const anyBlank = existing.blank || neu.blank || total.blank;

  if (!existing.blank && existing.error) errors.existingCustomers = existing.error;
  if (!neu.blank && neu.error) errors.newCustomers = neu.error;
  if (!total.blank && total.error) errors.totalCustomers = total.error;

  if (!existing.blank && existing.value !== null && existing.value <= 0) {
    errors.existingCustomers = 'Existing customers must be greater than zero.';
  }

  if (
    !anyBlank &&
    existing.value !== null &&
    neu.value !== null &&
    total.value !== null &&
    !errors.existingCustomers &&
    !errors.newCustomers &&
    !errors.totalCustomers
  ) {
    const retained = total.value - neu.value;
    if (retained < 0) {
      errors.totalCustomers = 'Total customers cannot be less than new customers.';
    } else if (retained > existing.value) {
      errors.totalCustomers =
        'Retained customers cannot exceed existing customers (total − new ≤ existing).';
    }
  }

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  const input: CustomerRetentionInput = {
    existingCustomers: existing.value!,
    newCustomers: neu.value!,
    totalCustomers: total.value!,
  };
  const result = calculateCustomerRetention(input);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
