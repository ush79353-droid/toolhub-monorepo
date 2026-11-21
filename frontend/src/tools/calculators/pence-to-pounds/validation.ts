import { calculatePenceToPounds } from './calculation';
import type {
  PenceToPoundsFieldErrors,
  PenceToPoundsInput,
  PenceToPoundsResult,
} from './types';

const MAX_ABS = 1e15;

function parseAmount(raw: string): {
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

export interface PenceToPoundsValidation {
  isValid: boolean;
  errors: PenceToPoundsFieldErrors;
  result: PenceToPoundsResult | null;
}

export function collectFieldErrors(
  input: PenceToPoundsInput,
): PenceToPoundsFieldErrors {
  const errors: PenceToPoundsFieldErrors = {};
  const field = input.lastEdited;
  const raw = field === 'pence' ? input.pence : input.pounds;
  const parsed = parseAmount(raw);

  if (parsed.blank) {
    return errors;
  }
  if (parsed.invalid || parsed.value == null) {
    errors[field] =
      field === 'pence'
        ? 'Enter a valid amount in pence.'
        : 'Enter a valid amount in pounds.';
    return errors;
  }
  if (parsed.value < 0) {
    errors[field] =
      field === 'pence'
        ? 'Pence cannot be negative.'
        : 'Pounds cannot be negative.';
    return errors;
  }
  if (Math.abs(parsed.value) > MAX_ABS) {
    errors[field] = 'Amount is out of range.';
  }
  return errors;
}

export function hasFieldErrors(errors: PenceToPoundsFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validatePenceToPoundsInput(
  input: PenceToPoundsInput,
): PenceToPoundsValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const sourceRaw = input.lastEdited === 'pence' ? input.pence : input.pounds;
  if (sourceRaw.trim() === '') {
    return { isValid: false, errors: {}, result: null };
  }
  const result = calculatePenceToPounds(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to convert with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
