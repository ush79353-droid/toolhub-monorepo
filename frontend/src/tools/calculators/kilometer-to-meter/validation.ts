import {
  MAX_ABS_VALUE,
  type KilometerToMeterFieldErrors,
  type KilometerToMeterInput,
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

function lengthProblem(
  value: number | null,
): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateKilometerToMeter(input: KilometerToMeterInput): {
  isValid: boolean;
  errors: KilometerToMeterFieldErrors;
} {
  const errors: KilometerToMeterFieldErrors = {};
  let blank = false;

  if (input.source === 'km') {
    const state = lengthProblem(input.km);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.km = 'Enter a valid length in kilometers.';
    else if (state === 'negative') errors.km = 'Distance cannot be negative.';
    else if (state === 'large') errors.km = 'Enter a smaller length.';
  } else {
    const state = lengthProblem(input.m);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.m = 'Enter a valid length in meters.';
    else if (state === 'negative') errors.m = 'Distance cannot be negative.';
    else if (state === 'large') errors.m = 'Enter a smaller length.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
