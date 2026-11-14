import { isIncompleteNumber } from '../length-converter/validation';
import { parseDecimalString } from './calculation';
import type { BillionTrillionFieldErrors, DecimalValue } from './types';

export { isIncompleteNumber };

const SUPER_TO_ASCII: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
  '−': '-',
};

/** Normalize unicode scientific notation toward ASCII before parsing. */
export function normalizeScientificInput(raw: string): string {
  let out = raw.trim();
  out = out.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻−]/gu, (ch) => SUPER_TO_ASCII[ch] ?? ch);
  out = out.replace(/\u00d7/g, '×');
  return out;
}

export function parseFieldInput(
  raw: string,
  field: 'billion' | 'trillion' | 'scientific'
): {
  value: DecimalValue | null;
  blank: boolean;
  error?: string;
} {
  const cleaned =
    field === 'scientific' ? normalizeScientificInput(raw) : raw.trim().replace(/,/g, '');

  if (cleaned === '' || isIncompleteNumber(cleaned)) {
    // Allow incomplete sci forms while typing: "1e", "1×10", "1×10^"
    if (
      field === 'scientific' &&
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
        field === 'scientific'
          ? 'Enter a number or scientific notation such as 1e12 or 1 × 10^12.'
          : 'Enter a valid number.',
    };
  }
  return { value, blank: false };
}

export type FieldParse = ReturnType<typeof parseFieldInput>;

export function mergeFieldError(
  errors: BillionTrillionFieldErrors,
  field: keyof BillionTrillionFieldErrors,
  parsed: FieldParse
): BillionTrillionFieldErrors {
  if (parsed.error) return { ...errors, [field]: parsed.error };
  const next = { ...errors };
  delete next[field];
  return next;
}
