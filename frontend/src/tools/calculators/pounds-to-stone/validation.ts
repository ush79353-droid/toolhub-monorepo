import {
  MAX_ABS_VALUE,
  type PoundsToStoneFieldErrors,
  type PoundsToStoneInput,
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

export function validatePoundsToStone(input: PoundsToStoneInput): {
  isValid: boolean;
  errors: PoundsToStoneFieldErrors;
} {
  const errors: PoundsToStoneFieldErrors = {};
  let blank = false;

  if (input.source === 'pounds') {
    const p = numProblem(input.pounds);
    if (p === 'blank') blank = true;
    else if (p === 'bad') errors.pounds = 'Enter a valid mass in pounds.';
    else if (p === 'negative') errors.pounds = 'Mass cannot be negative.';
    else if (p === 'large') errors.pounds = 'Enter a smaller mass.';
  } else {
    const s = numProblem(input.stone);
    if (s === 'blank') blank = true;
    else if (s === 'bad') errors.stone = 'Enter a valid mass in stone.';
    else if (s === 'negative') errors.stone = 'Mass cannot be negative.';
    else if (s === 'large') errors.stone = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
