import { MAX_ABS_VALUE, type MmToInchesFieldErrors, type MmToInchesInput } from './types';

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

export function validateMmToInches(input: MmToInchesInput): {
  isValid: boolean;
  errors: MmToInchesFieldErrors;
} {
  const errors: MmToInchesFieldErrors = {};
  let blank = false;

  if (input.source === 'mm') {
    const state = lengthProblem(input.mm);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.mm = 'Enter a valid length in millimeters.';
    else if (state === 'large') errors.mm = 'Enter a smaller absolute value.';
  } else {
    const state = lengthProblem(input.inches);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.inches = 'Enter a valid length in inches.';
    else if (state === 'large') errors.inches = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
