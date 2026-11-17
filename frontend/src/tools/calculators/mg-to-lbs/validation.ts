import { MAX_ABS_VALUE, type MgToLbsFieldErrors, type MgToLbsInput } from './types';

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

export function validateMgToLbs(input: MgToLbsInput): {
  isValid: boolean;
  errors: MgToLbsFieldErrors;
} {
  const errors: MgToLbsFieldErrors = {};
  let blank = false;

  if (input.source === 'milligrams') {
    const m = numProblem(input.milligrams);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.milligrams = 'Enter a valid mass in milligrams.';
    else if (m === 'negative') errors.milligrams = 'Mass cannot be negative.';
    else if (m === 'large') errors.milligrams = 'Enter a smaller mass.';
  } else {
    const p = numProblem(input.pounds);
    if (p === 'blank') blank = true;
    else if (p === 'bad') errors.pounds = 'Enter a valid mass in pounds.';
    else if (p === 'negative') errors.pounds = 'Mass cannot be negative.';
    else if (p === 'large') errors.pounds = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
