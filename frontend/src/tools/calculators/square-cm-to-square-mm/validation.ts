import {
  MAX_ABS_VALUE,
  type SquareCmToSquareMmFieldErrors,
  type SquareCmToSquareMmInput,
} from './types';

export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    /e[+-]?$/i.test(cleaned)
  );
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function areaProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateSquareCmToSquareMm(input: SquareCmToSquareMmInput): {
  isValid: boolean;
  errors: SquareCmToSquareMmFieldErrors;
} {
  const errors: SquareCmToSquareMmFieldErrors = {};
  const state = areaProblem(input.value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[input.source] = 'Enter a valid finite area.';
  } else if (state === 'negative') {
    errors[input.source] = 'Area cannot be negative.';
  } else if (state === 'large') {
    errors[input.source] = 'Enter a smaller area.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
