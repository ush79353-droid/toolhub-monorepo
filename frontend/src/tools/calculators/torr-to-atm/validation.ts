import { MAX_ABS_VALUE, type TorrToAtmFieldErrors, type TorrToAtmInput } from './types';

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

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

/**
 * Signed values are allowed as gauge / differential pressure.
 * Absolute pressure cannot be negative — documented in UI copy.
 */
function pressureProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateTorrToAtm(input: TorrToAtmInput): {
  isValid: boolean;
  errors: TorrToAtmFieldErrors;
} {
  const errors: TorrToAtmFieldErrors = {};
  let blank = false;

  if (input.source === 'Torr') {
    const state = pressureProblem(input.torr);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.torr = 'Enter a valid pressure in Torr.';
    else if (state === 'large') errors.torr = 'Enter a smaller absolute value.';
  } else {
    const state = pressureProblem(input.atm);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.atm = 'Enter a valid pressure in atmospheres.';
    else if (state === 'large') errors.atm = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
