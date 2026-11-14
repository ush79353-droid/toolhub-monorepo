import {
  MAX_ABS_VALUE,
  type PixelsToInchesFieldErrors,
  type PixelsToInchesInput,
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

function finiteProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validatePixelsToInches(input: PixelsToInchesInput): {
  isValid: boolean;
  errors: PixelsToInchesFieldErrors;
} {
  const errors: PixelsToInchesFieldErrors = {};
  let blank = false;

  const ppiState = finiteProblem(input.ppi);
  if (ppiState === 'blank') {
    blank = true;
  } else if (ppiState === 'bad') {
    errors.ppi = 'Enter a valid pixels-per-inch value.';
  } else if (ppiState === 'large') {
    errors.ppi = 'Enter a smaller PPI value.';
  } else if (input.ppi! <= 0) {
    errors.ppi = 'PPI must be greater than zero.';
  }

  if (input.source === 'inches') {
    const state = finiteProblem(input.inches);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.inches = 'Enter a valid number of inches.';
    else if (state === 'large') errors.inches = 'Enter a smaller value.';
    else if (input.inches! < 0) errors.inches = 'Inches cannot be negative.';
  } else {
    const state = finiteProblem(input.pixels);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.pixels = 'Enter a valid number of pixels.';
    else if (state === 'large') errors.pixels = 'Enter a smaller value.';
    else if (input.pixels! < 0) errors.pixels = 'Pixels cannot be negative.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
