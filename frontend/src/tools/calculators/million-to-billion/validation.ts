import { isIncompleteNumber } from '../length-converter/validation';
import { normalizeScientificInput } from '../billion-to-trillion/validation';
import { parseDecimalString } from './calculation';
import type { DecimalValue, MillionBillionFieldErrors, SourceField } from './types';

export { isIncompleteNumber, normalizeScientificInput };

export function parseFieldInput(
  raw: string,
  field: SourceField
): {
  value: DecimalValue | null;
  blank: boolean;
  error?: string;
} {
  const cleaned =
    field === 'fullNumber'
      ? normalizeScientificInput(raw)
      : raw.trim().replace(/,/g, '');

  if (cleaned === '' || isIncompleteNumber(cleaned)) {
    if (
      field === 'fullNumber' &&
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
        field === 'million'
          ? 'Enter a valid millions value.'
          : field === 'billion'
            ? 'Enter a valid billions value.'
            : 'Enter a valid number (plain or scientific notation).',
    };
  }
  return { value, blank: false };
}

export type FieldParse = ReturnType<typeof parseFieldInput>;

export function clearFieldError(
  errors: MillionBillionFieldErrors,
  field: keyof MillionBillionFieldErrors
): MillionBillionFieldErrors {
  const next = { ...errors };
  delete next[field];
  return next;
}
