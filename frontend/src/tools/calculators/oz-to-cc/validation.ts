import { MAX_ABS_VALUE, type OzToCcFieldErrors, type OzToCcInput } from './types';

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

function volumeProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateOzToCc(input: OzToCcInput): {
  isValid: boolean;
  errors: OzToCcFieldErrors;
} {
  const errors: OzToCcFieldErrors = {};
  let blank = false;

  if (input.source === 'oz') {
    const state = volumeProblem(input.oz);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.oz = 'Enter a valid volume in fluid ounces.';
    else if (state === 'negative') errors.oz = 'Volume cannot be negative.';
    else if (state === 'large') errors.oz = 'Enter a smaller value.';
  } else {
    const state = volumeProblem(input.cc);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.cc = 'Enter a valid volume in cubic centimeters.';
    else if (state === 'negative') errors.cc = 'Volume cannot be negative.';
    else if (state === 'large') errors.cc = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
