import {
  ABSOLUTE_ZERO_C,
  ABSOLUTE_ZERO_F,
  ABS_ZERO_EPS,
  MAX_ABS_VALUE,
  type FahrenheitToCelsiusFieldErrors,
  type FahrenheitToCelsiusInput,
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

export function validateFahrenheitToCelsius(input: FahrenheitToCelsiusInput): {
  isValid: boolean;
  errors: FahrenheitToCelsiusFieldErrors;
} {
  const errors: FahrenheitToCelsiusFieldErrors = {};
  let blank = false;

  if (input.source === 'fahrenheit') {
    const value = input.fahrenheit;
    if (value === null) blank = true;
    else if (!Number.isFinite(value)) {
      errors.fahrenheit = 'Enter a valid temperature in Fahrenheit.';
    } else if (Math.abs(value) > MAX_ABS_VALUE) {
      errors.fahrenheit = 'Enter a smaller absolute value.';
    } else if (value < ABSOLUTE_ZERO_F - ABS_ZERO_EPS) {
      errors.fahrenheit = 'Temperature cannot be below absolute zero.';
    }
  } else {
    const value = input.celsius;
    if (value === null) blank = true;
    else if (!Number.isFinite(value)) errors.celsius = 'Enter a valid temperature in Celsius.';
    else if (Math.abs(value) > MAX_ABS_VALUE) errors.celsius = 'Enter a smaller absolute value.';
    else if (value < ABSOLUTE_ZERO_C - ABS_ZERO_EPS) {
      errors.celsius = 'Temperature cannot be below absolute zero.';
    }
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
