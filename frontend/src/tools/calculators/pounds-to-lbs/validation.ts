import {
  MAX_ABS_VALUE,
  type PoundsToLbsFieldErrors,
  type PoundsToLbsInput,
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

function numProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validatePoundsToLbs(input: PoundsToLbsInput): {
  isValid: boolean;
  errors: PoundsToLbsFieldErrors;
} {
  const errors: PoundsToLbsFieldErrors = {};
  let blank = false;

  if (input.source === 'pounds') {
    const p = numProblem(input.pounds);
    if (p === 'blank') blank = true;
    else if (p === 'bad') errors.pounds = 'Enter a valid mass in pounds.';
    else if (p === 'negative') errors.pounds = 'Mass cannot be negative.';
    else if (p === 'large') errors.pounds = 'Enter a smaller mass.';
  } else {
    const l = numProblem(input.lbs);
    if (l === 'blank') blank = true;
    else if (l === 'bad') errors.lbs = 'Enter a valid mass in lbs.';
    else if (l === 'negative') errors.lbs = 'Mass cannot be negative.';
    else if (l === 'large') errors.lbs = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
