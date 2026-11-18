import { MAX_ABS_VALUE, type CuInToGalFieldErrors, type CuInToGalInput } from './types';

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

export function validateCuInToGal(input: CuInToGalInput): {
  isValid: boolean;
  errors: CuInToGalFieldErrors;
} {
  const errors: CuInToGalFieldErrors = {};
  let blank = false;

  if (input.source === 'cubicInches') {
    const state = volumeProblem(input.cubicInches);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.cubicInches = 'Enter a valid volume in cubic inches.';
    else if (state === 'negative') errors.cubicInches = 'Volume cannot be negative.';
    else if (state === 'large') errors.cubicInches = 'Enter a smaller value.';
  } else if (input.source === 'gallons') {
    const state = volumeProblem(input.gallons);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.gallons = 'Enter a valid volume in gallons.';
    else if (state === 'negative') errors.gallons = 'Volume cannot be negative.';
    else if (state === 'large') errors.gallons = 'Enter a smaller value.';
  } else {
    const state = volumeProblem(input.other);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.other = 'Enter a valid volume.';
    else if (state === 'negative') errors.other = 'Volume cannot be negative.';
    else if (state === 'large') errors.other = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
