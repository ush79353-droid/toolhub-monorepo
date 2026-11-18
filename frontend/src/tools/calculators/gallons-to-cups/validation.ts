import { MAX_ABS_VALUE, type GalToCupsFieldErrors, type GalToCupsInput } from './types';

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

function volumeProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateGalToCups(input: GalToCupsInput): {
  isValid: boolean;
  errors: GalToCupsFieldErrors;
} {
  const errors: GalToCupsFieldErrors = {};
  let blank = false;

  if (input.source === 'gallons') {
    const state = volumeProblem(input.gallons);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.gallons = 'Enter a valid volume in gallons.';
    else if (state === 'negative') errors.gallons = 'Volume cannot be negative.';
    else if (state === 'large') errors.gallons = 'Enter a smaller volume.';
  } else {
    const state = volumeProblem(input.cups);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.cups = 'Enter a valid volume in cups.';
    else if (state === 'negative') errors.cups = 'Volume cannot be negative.';
    else if (state === 'large') errors.cups = 'Enter a smaller volume.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
