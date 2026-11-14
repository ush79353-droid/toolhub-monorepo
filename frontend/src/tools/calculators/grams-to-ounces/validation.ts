import {
  MAX_ABS_VALUE,
  type GramsToOuncesFieldErrors,
  type GramsToOuncesInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete. */
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
  const cleaned = raw.trim();
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

export function validateGramsToOunces(input: GramsToOuncesInput): {
  isValid: boolean;
  errors: GramsToOuncesFieldErrors;
} {
  const errors: GramsToOuncesFieldErrors = {};
  let blank = false;

  if (input.source === 'g') {
    const state = massProblem(input.g);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.g = 'Enter a valid number of grams.';
    else if (state === 'negative') errors.g = 'Mass cannot be negative.';
    else if (state === 'large') errors.g = 'Enter a smaller value.';
  } else {
    const state = massProblem(input.oz);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.oz = 'Enter a valid number of ounces.';
    else if (state === 'negative') errors.oz = 'Mass cannot be negative.';
    else if (state === 'large') errors.oz = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
