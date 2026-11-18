import { MAX_ABS_VALUE, type NmToMFieldErrors, type NmToMInput } from './types';

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

export function validateNmToM(input: NmToMInput): {
  isValid: boolean;
  errors: NmToMFieldErrors;
} {
  const errors: NmToMFieldErrors = {};
  let blank = false;

  if (input.source === 'nm') {
    const state = lengthProblem(input.nm);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.nm = 'Enter a valid length in nanometers.';
    else if (state === 'large') errors.nm = 'Enter a smaller absolute value.';
  } else {
    const state = lengthProblem(input.m);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.m = 'Enter a valid length in meters.';
    else if (state === 'large') errors.m = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
