import {
  MAX_ABS_VALUE,
  type BarToAtmFieldErrors,
  type BarToAtmInput,
} from './types';

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

function pressureProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateBarToAtm(input: BarToAtmInput): {
  isValid: boolean;
  errors: BarToAtmFieldErrors;
} {
  const errors: BarToAtmFieldErrors = {};
  let blank = false;

  if (input.source === 'bar') {
    const state = pressureProblem(input.bar);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.bar = 'Enter a valid pressure in bar.';
    else if (state === 'negative') {
      errors.bar =
        'Absolute pressure cannot be negative. Use a gauge converter for relative vacuum.';
    } else if (state === 'large') errors.bar = 'Enter a smaller value.';
  } else {
    const state = pressureProblem(input.atm);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.atm = 'Enter a valid pressure in atmospheres.';
    else if (state === 'negative') {
      errors.atm =
        'Absolute pressure cannot be negative. Use a gauge converter for relative vacuum.';
    } else if (state === 'large') errors.atm = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
