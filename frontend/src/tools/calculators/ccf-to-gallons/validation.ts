import {
  MAX_ABS_VALUE,
  type CcfToGallonsFieldErrors,
  type CcfToGallonsInput,
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

export function validateCcfToGallons(input: CcfToGallonsInput): {
  isValid: boolean;
  errors: CcfToGallonsFieldErrors;
} {
  const errors: CcfToGallonsFieldErrors = {};
  let blank = false;

  if (input.source === 'ccf') {
    const state = volumeProblem(input.ccf);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.ccf = 'Enter a valid number of CCF.';
    else if (state === 'negative') errors.ccf = 'Volume cannot be negative.';
    else if (state === 'large') errors.ccf = 'Enter a smaller value.';
  } else {
    const state = volumeProblem(input.usGallons);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.usGallons = 'Enter a valid number of US gallons.';
    else if (state === 'negative') errors.usGallons = 'Volume cannot be negative.';
    else if (state === 'large') errors.usGallons = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
