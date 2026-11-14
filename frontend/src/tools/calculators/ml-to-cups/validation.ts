import { parseLengthInput } from '../inches-to-fraction/calculation';
import { MAX_ABS_VALUE, type MlToCupsFieldErrors, type MlToCupsInput } from './types';

/** Half-typed decimal values such as `1.` stay incomplete. */
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

/**
 * Parse milliliters as a plain decimal, or cups as decimal / fraction / mixed number
 * (reuses the shared length-fraction parser for cooking fractions like 1/2 or 1 1/2).
 */
export function parseVolumeField(
  raw: string,
  allowFraction: boolean
): { value: number | null; error?: string } {
  const cleaned = raw.trim();
  if (cleaned === '') return { value: null };

  if (allowFraction) {
    const parsed = parseLengthInput(cleaned);
    if (parsed.kind === 'incomplete') return { value: null };
    if (parsed.kind === 'invalid') return { value: Number.NaN, error: parsed.message };
    return { value: parsed.value };
  }

  if (isIncompleteNumber(cleaned)) return { value: null };
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: Number.NaN, error: 'Enter a valid number.' };
  }
  return { value };
}

function volumeProblem(
  value: number | null
): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateMlToCups(input: MlToCupsInput): {
  isValid: boolean;
  errors: MlToCupsFieldErrors;
} {
  const errors: MlToCupsFieldErrors = {};
  let blank = false;

  if (input.source === 'ml') {
    const state = volumeProblem(input.ml);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.ml = 'Enter a valid volume in milliliters.';
    else if (state === 'negative') errors.ml = 'Volume cannot be negative.';
    else if (state === 'large') errors.ml = 'Enter a smaller volume.';
  } else {
    const state = volumeProblem(input.cups);
    if (state === 'blank') blank = true;
    else if (state === 'bad') {
      errors.cups = 'Enter a valid cup amount (decimal or fraction such as 1/2).';
    } else if (state === 'negative') errors.cups = 'Volume cannot be negative.';
    else if (state === 'large') errors.cups = 'Enter a smaller volume.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
