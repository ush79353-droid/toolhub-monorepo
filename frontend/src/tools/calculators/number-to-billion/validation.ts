import { isIncompleteNumber } from '../length-converter/validation';
import { normalizeScientificInput } from '../billion-to-trillion/validation';
import { parseDecimalString } from './calculation';
import type { DecimalValue, NumberBillionFieldErrors } from './types';

export { isIncompleteNumber, normalizeScientificInput };

export function parseFieldInput(
  raw: string,
  field: 'number' | 'billion' | 'scientific'
): {
  value: DecimalValue | null;
  blank: boolean;
  error?: string;
} {
  const cleaned =
    field === 'scientific' || field === 'number'
      ? normalizeScientificInput(raw)
      : raw.trim().replace(/,/g, '');

  if (cleaned === '' || isIncompleteNumber(cleaned)) {
    if (
      (field === 'scientific' || field === 'number') &&
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

  const value = parseDecimalString(cleaned.replace(/,/g, ''));
  if (value === null) {
    return {
      value: null,
      blank: false,
      error:
        field === 'scientific'
          ? 'Enter a number or scientific notation such as 1e9 or 1 × 10^9.'
          : field === 'number'
            ? 'Enter a valid number (plain or scientific notation).'
            : 'Enter a valid billions value.',
    };
  }
  return { value, blank: false };
}

export type FieldParse = ReturnType<typeof parseFieldInput>;

export function clearFieldError(
  errors: NumberBillionFieldErrors,
  field: keyof NumberBillionFieldErrors
): NumberBillionFieldErrors {
  const next = { ...errors };
  delete next[field];
  return next;
}
