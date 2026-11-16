import {
  MAX_ABS_VALUE,
  type AcresToHectaresFieldErrors,
  type AcresToHectaresInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete so the source field is not overwritten. */
export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.')
  );
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function areaProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateAcresToHectares(input: AcresToHectaresInput): {
  isValid: boolean;
  errors: AcresToHectaresFieldErrors;
} {
  const errors: AcresToHectaresFieldErrors = {};
  let blank = false;

  if (input.source === 'acres') {
    const state = areaProblem(input.acres);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.acres = 'Enter a valid number of acres.';
    else if (state === 'negative') errors.acres = 'Area cannot be negative.';
    else if (state === 'large') errors.acres = 'Enter a smaller value.';
  } else {
    const state = areaProblem(input.hectares);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.hectares = 'Enter a valid number of hectares.';
    else if (state === 'negative') errors.hectares = 'Area cannot be negative.';
    else if (state === 'large') errors.hectares = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
