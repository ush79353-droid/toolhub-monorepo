import {
  MAX_ABS_VALUE,
  type OuncesToGramsFieldErrors,
  type OuncesToGramsInput,
} from './types';

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

function massProblem(
  value: number | null,
): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateOuncesToGrams(input: OuncesToGramsInput): {
  isValid: boolean;
  errors: OuncesToGramsFieldErrors;
} {
  const errors: OuncesToGramsFieldErrors = {};
  let blank = false;

  if (input.source === 'oz') {
    const state = massProblem(input.oz);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.oz = 'Enter a valid mass in ounces.';
    else if (state === 'negative') errors.oz = 'Mass cannot be negative.';
    else if (state === 'large') errors.oz = 'Enter a smaller mass.';
  } else {
    const state = massProblem(input.g);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.g = 'Enter a valid mass in grams.';
    else if (state === 'negative') errors.g = 'Mass cannot be negative.';
    else if (state === 'large') errors.g = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
