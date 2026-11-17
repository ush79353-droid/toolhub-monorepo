import { MAX_ABS_VALUE, type KgToLbsFieldErrors, type KgToLbsInput } from './types';

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

function massProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateKgToLbs(input: KgToLbsInput): {
  isValid: boolean;
  errors: KgToLbsFieldErrors;
} {
  const errors: KgToLbsFieldErrors = {};
  let blank = false;

  if (input.source === 'kg') {
    const state = massProblem(input.kg);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.kg = 'Enter a valid mass in kilograms.';
    else if (state === 'negative') errors.kg = 'Mass cannot be negative.';
    else if (state === 'large') errors.kg = 'Enter a smaller mass.';
  } else {
    const state = massProblem(input.lbs);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.lbs = 'Enter a valid mass in pounds.';
    else if (state === 'negative') errors.lbs = 'Mass cannot be negative.';
    else if (state === 'large') errors.lbs = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
