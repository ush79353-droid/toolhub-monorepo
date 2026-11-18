import {
  MAX_ABS_VALUE,
  type MetersToFeetFieldErrors,
  type MetersToFeetInput,
} from './types';

/** Half-typed values such as `1.` or `1e` stay incomplete. */
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

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
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

export function validateMetersToFeet(input: MetersToFeetInput): {
  isValid: boolean;
  errors: MetersToFeetFieldErrors;
} {
  const errors: MetersToFeetFieldErrors = {};
  let blank = false;

  if (input.source === 'meters') {
    const state = lengthProblem(input.meters);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.meters = 'Enter a valid length in meters.';
    else if (state === 'large') errors.meters = 'Enter a smaller absolute value.';
  } else {
    const state = lengthProblem(input.feet);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.feet = 'Enter a valid length in feet.';
    else if (state === 'large') errors.feet = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
