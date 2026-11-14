import { MAX_ABS_VALUE, type FeetToInchesFieldErrors, type FeetToInchesInput } from './types';

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

export function validateFeetToInches(input: FeetToInchesInput): {
  isValid: boolean;
  errors: FeetToInchesFieldErrors;
} {
  const errors: FeetToInchesFieldErrors = {};
  let blank = false;

  if (input.source === 'feet') {
    const state = finiteProblem(input.feet);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.feet = 'Enter a valid number of feet.';
    else if (state === 'large') errors.feet = 'Enter a smaller value.';
  } else {
    const state = finiteProblem(input.inches);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.inches = 'Enter a valid number of inches.';
    else if (state === 'large') errors.inches = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
