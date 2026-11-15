import { isIncompleteNumber } from '../length-converter/validation';
import { parseDecimalString } from './calculation';
import type { DecimalValue, CentsEurosFieldErrors } from './types';

export { isIncompleteNumber };

export function parseFieldInput(
  raw: string,
  field: 'cents' | 'euros'
): {
  value: DecimalValue | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned === '+' ||
    isIncompleteNumber(cleaned)
  ) {
    return { value: null, blank: true };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: 'Enter a finite number.' };
  }
  const value = parseDecimalString(cleaned);
  if (value === null) {
    return {
      value: null,
      blank: false,
      error: `Enter a valid ${field} value.`,
    };
  }
  return { value, blank: false };
}

export type FieldParse = ReturnType<typeof parseFieldInput>;

export function clearFieldError(
  errors: CentsEurosFieldErrors,
  field: keyof CentsEurosFieldErrors
): CentsEurosFieldErrors {
  const next = { ...errors };
  delete next[field];
  return next;
}
