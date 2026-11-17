import {
  ABSOLUTE_ZERO_F,
  ABSOLUTE_ZERO_K,
  ABS_ZERO_EPS,
  MAX_ABS_VALUE,
  type KelvinToFahrenheitFieldErrors,
  type KelvinToFahrenheitInput,
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

const ABS_ZERO_MSG = 'Temperature cannot be below absolute zero (0 K or -459.67 °F).';

export function validateKelvinToFahrenheit(input: KelvinToFahrenheitInput): {
  isValid: boolean;
  errors: KelvinToFahrenheitFieldErrors;
} {
  const errors: KelvinToFahrenheitFieldErrors = {};
  let blank = false;

  if (input.source === 'kelvin') {
    const value = input.kelvin;
    if (value === null) blank = true;
    else if (!Number.isFinite(value)) errors.kelvin = 'Enter a valid temperature in kelvin.';
    else if (Math.abs(value) > MAX_ABS_VALUE) errors.kelvin = 'Enter a smaller absolute value.';
    else if (value < ABSOLUTE_ZERO_K - ABS_ZERO_EPS) errors.kelvin = ABS_ZERO_MSG;
  } else {
    const value = input.fahrenheit;
    if (value === null) blank = true;
    else if (!Number.isFinite(value)) errors.fahrenheit = 'Enter a valid temperature in Fahrenheit.';
    else if (Math.abs(value) > MAX_ABS_VALUE) errors.fahrenheit = 'Enter a smaller absolute value.';
    else if (value < ABSOLUTE_ZERO_F - ABS_ZERO_EPS) errors.fahrenheit = ABS_ZERO_MSG;
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
