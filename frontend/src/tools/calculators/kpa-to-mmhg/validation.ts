import {
  MAX_ABS_VALUE,
  type KpaToMmhgFieldErrors,
  type KpaToMmhgInput,
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

function pressureProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateKpaToMmhg(input: KpaToMmhgInput): {
  isValid: boolean;
  errors: KpaToMmhgFieldErrors;
} {
  const errors: KpaToMmhgFieldErrors = {};
  let blank = false;

  if (input.source === 'kPa') {
    const state = pressureProblem(input.kPa);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.kPa = 'Enter a valid pressure in kilopascals.';
    else if (state === 'large') errors.kPa = 'Enter a smaller absolute value.';
  } else {
    const state = pressureProblem(input.mmHg);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.mmHg = 'Enter a valid pressure in mmHg.';
    else if (state === 'large') errors.mmHg = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
