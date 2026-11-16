import {
  ABSOLUTE_ZERO_C,
  ABS_ZERO_EPS,
  MAX_ABS_VALUE,
  type CentigradeToCelsiusFieldErrors,
  type CentigradeToCelsiusInput,
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

export function validateCentigradeToCelsius(input: CentigradeToCelsiusInput): {
  isValid: boolean;
  errors: CentigradeToCelsiusFieldErrors;
} {
  const errors: CentigradeToCelsiusFieldErrors = {};
  let blank = false;

  const field = input.source;
  const value = field === 'centigrade' ? input.centigrade : input.celsius;
  const label = field === 'centigrade' ? 'centigrade' : 'Celsius';

  if (value === null) blank = true;
  else if (!Number.isFinite(value)) {
    errors[field] = `Enter a valid temperature in ${label}.`;
  } else if (Math.abs(value) > MAX_ABS_VALUE) {
    errors[field] = 'Enter a smaller absolute value.';
  } else if (value < ABSOLUTE_ZERO_C - ABS_ZERO_EPS) {
    errors[field] = 'Temperature cannot be below absolute zero (−273.15°C).';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
