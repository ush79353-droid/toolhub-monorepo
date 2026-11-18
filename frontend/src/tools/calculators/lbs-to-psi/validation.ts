import { MAX_ABS_VALUE, type LbsToPsiFieldErrors, type LbsToPsiInput } from './types';

/** Half-typed values such as `1.` stay incomplete so the source field is not overwritten. */
export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    cleaned.toLowerCase().endsWith('e') ||
    cleaned.toLowerCase().endsWith('e-') ||
    cleaned.toLowerCase().endsWith('e+')
  );
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function pressureProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

/**
 * Signed values are allowed (gauge / differential pressure).
 * Absolute vacuum magnitude is not modeled here.
 */
export function validateLbsToPsi(input: LbsToPsiInput): {
  isValid: boolean;
  errors: LbsToPsiFieldErrors;
} {
  const errors: LbsToPsiFieldErrors = {};
  let blank = false;

  if (input.source === 'psf') {
    const state = pressureProblem(input.psf);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.psf = 'Enter a valid pressure in lbf/ft².';
    else if (state === 'large') errors.psf = 'Enter a smaller magnitude.';
  } else {
    const state = pressureProblem(input.psi);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.psi = 'Enter a valid pressure in psi.';
    else if (state === 'large') errors.psi = 'Enter a smaller magnitude.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
