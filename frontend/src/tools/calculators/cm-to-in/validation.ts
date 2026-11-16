import {
  MAX_ABS_VALUE,
  type CmToInFieldErrors,
  type CmToInInput,
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

function lengthProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateCmToIn(input: CmToInInput): {
  isValid: boolean;
  errors: CmToInFieldErrors;
} {
  const errors: CmToInFieldErrors = {};
  let blank = false;

  if (input.source === 'centimeters') {
    const state = lengthProblem(input.centimeters);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.centimeters = 'Enter a valid length in centimeters.';
    else if (state === 'negative') errors.centimeters = 'Length cannot be negative.';
    else if (state === 'large') errors.centimeters = 'Enter a smaller value.';
  } else {
    const state = lengthProblem(input.inches);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.inches = 'Enter a valid length in inches.';
    else if (state === 'negative') errors.inches = 'Length cannot be negative.';
    else if (state === 'large') errors.inches = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
