import { MAX_ABS_VALUE, type CcToMlFieldErrors, type CcToMlInput } from './types';

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

function volumeProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateCcToMl(input: CcToMlInput): {
  isValid: boolean;
  errors: CcToMlFieldErrors;
} {
  const errors: CcToMlFieldErrors = {};
  let blank = false;

  if (input.source === 'cc') {
    const state = volumeProblem(input.cc);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.cc = 'Enter a valid volume in cubic centimeters.';
    else if (state === 'negative') errors.cc = 'Volume cannot be negative.';
    else if (state === 'large') errors.cc = 'Enter a smaller value.';
  } else if (input.source === 'ml') {
    const state = volumeProblem(input.ml);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.ml = 'Enter a valid volume in milliliters.';
    else if (state === 'negative') errors.ml = 'Volume cannot be negative.';
    else if (state === 'large') errors.ml = 'Enter a smaller value.';
  } else {
    const state = volumeProblem(input.liters);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.liters = 'Enter a valid volume in liters.';
    else if (state === 'negative') errors.liters = 'Volume cannot be negative.';
    else if (state === 'large') errors.liters = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
