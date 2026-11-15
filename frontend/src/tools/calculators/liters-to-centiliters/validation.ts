import {
  MAX_ABS_VALUE,
  type LitersToCentilitersFieldErrors,
  type LitersToCentilitersInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete so the source field is not overwritten. */
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

function volumeProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateLitersToCentiliters(input: LitersToCentilitersInput): {
  isValid: boolean;
  errors: LitersToCentilitersFieldErrors;
} {
  const errors: LitersToCentilitersFieldErrors = {};
  let blank = false;

  if (input.source === 'liters') {
    const state = volumeProblem(input.liters);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.liters = 'Enter a valid number of liters.';
    else if (state === 'negative') errors.liters = 'Volume cannot be negative.';
    else if (state === 'large') errors.liters = 'Enter a smaller value.';
  } else {
    const state = volumeProblem(input.centiliters);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.centiliters = 'Enter a valid number of centiliters.';
    else if (state === 'negative') errors.centiliters = 'Volume cannot be negative.';
    else if (state === 'large') errors.centiliters = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
