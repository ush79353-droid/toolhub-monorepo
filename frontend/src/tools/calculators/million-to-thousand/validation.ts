import { isIncompleteNumber } from '../length-converter/validation';
import { normalizeScientificInput } from '../billion-to-trillion/validation';
import { parseDecimalString } from './calculation';
import type { DecimalValue, MillionThousandFieldErrors } from './types';

export { isIncompleteNumber, normalizeScientificInput };

export function parseFieldInput(
  raw: string,
  field: 'millions' | 'thousands' | 'decimal'
): {
  value: DecimalValue | null;
  blank: boolean;
  error?: string;
} {
  const cleaned =
    field === 'decimal' ? normalizeScientificInput(raw) : raw.trim().replace(/,/g, '');

  if (cleaned === '' || isIncompleteNumber(cleaned)) {
    if (
      field === 'decimal' &&
      (/^[+-]?\d*\.?\d*[eE][+-]?$/.test(cleaned) ||
        /^[+-]?\d*\.?\d*\s*[×xX*]?\s*10\s*[\^]?\s*[+-]?$/u.test(cleaned.replace(/\s+/g, '')))
    ) {
      return { value: null, blank: true };
    }
    if (cleaned === '' || isIncompleteNumber(cleaned)) {
      return { value: null, blank: true };
    }
  }

  if (
    /infinity|nan/i.test(cleaned) ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned === '+'
  ) {
    if (cleaned === '.' || cleaned === '-' || cleaned === '-.' || cleaned === '+') {
      return { value: null, blank: true };
    }
    return { value: null, blank: false, error: 'Enter a finite number.' };
  }

  const value = parseDecimalString(cleaned);
  if (value === null) {
    return {
      value: null,
      blank: false,
      error:
        field === 'decimal'
          ? 'Enter a number or scientific notation such as 1e6 or 1 × 10^6.'
          : `Enter a valid ${field === 'millions' ? 'millions' : 'thousands'} value.`,
    };
  }
  return { value, blank: false };
}

export type FieldParse = ReturnType<typeof parseFieldInput>;

export function clearFieldError(
  errors: MillionThousandFieldErrors,
  field: keyof MillionThousandFieldErrors
): MillionThousandFieldErrors {
  const next = { ...errors };
  delete next[field];
  return next;
}
