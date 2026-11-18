import { MAX_ABS_VALUE, type FootToCmFieldErrors, type FootToCmInput } from './types';

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

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function lengthProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateFootToCm(input: FootToCmInput): {
  isValid: boolean;
  errors: FootToCmFieldErrors;
} {
  const errors: FootToCmFieldErrors = {};
  const state = lengthProblem(input.value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[input.source] = 'Enter a valid length.';
  } else if (state === 'large') {
    errors[input.source] = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
