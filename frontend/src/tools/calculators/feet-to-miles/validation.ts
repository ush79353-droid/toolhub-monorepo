import {
  MAX_ABS_VALUE,
  type FeetToMilesFieldErrors,
  type FeetToMilesInput,
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

export function validateFeetToMiles(input: FeetToMilesInput): {
  isValid: boolean;
  errors: FeetToMilesFieldErrors;
} {
  const errors: FeetToMilesFieldErrors = {};
  let blank = false;

  if (input.source === 'feet') {
    const state = lengthProblem(input.feet);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.feet = 'Enter a valid distance in feet.';
    else if (state === 'large') errors.feet = 'Enter a smaller absolute value.';
  } else {
    const state = lengthProblem(input.miles);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.miles = 'Enter a valid distance in miles.';
    else if (state === 'large') errors.miles = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
