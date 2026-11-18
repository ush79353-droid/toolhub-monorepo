import {
  MAX_ABS_VALUE,
  type OunceToKgFieldErrors,
  type OunceToKgInput,
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

export function validateOunceToKg(input: OunceToKgInput): {
  isValid: boolean;
  errors: OunceToKgFieldErrors;
} {
  const errors: OunceToKgFieldErrors = {};
  let blank = false;

  const apply = (
    field: 'oz' | 'kg' | 'lb',
    value: number | null,
    badMsg: string,
  ) => {
    const state = massProblem(value);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors[field] = badMsg;
    else if (state === 'negative') errors[field] = 'Mass cannot be negative.';
    else if (state === 'large') errors[field] = 'Enter a smaller mass.';
  };

  if (input.source === 'oz') apply('oz', input.oz, 'Enter a valid mass in ounces.');
  else if (input.source === 'kg') apply('kg', input.kg, 'Enter a valid mass in kilograms.');
  else apply('lb', input.lb, 'Enter a valid mass in pounds.');

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
