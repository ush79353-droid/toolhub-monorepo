import { temperatureScales } from '../temperature/calculation';
import type { TemperatureUnit } from '../temperature/types';
import {
  MAX_ABS_VALUE,
  type ImperialCategory,
  type ImperialFieldErrors,
  type ImperialInput,
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

export function validateImperial(input: ImperialInput): {
  isValid: boolean;
  errors: ImperialFieldErrors;
} {
  const errors: ImperialFieldErrors = {};
  const { category, sourceKey, value } = input;

  if (value === null) {
    return { isValid: false, errors };
  }
  if (!Number.isFinite(value)) {
    errors[sourceKey] = 'Enter a valid number.';
    return { isValid: false, errors };
  }
  if (Math.abs(value) > MAX_ABS_VALUE) {
    errors[sourceKey] = 'Enter a smaller value.';
    return { isValid: false, errors };
  }

  if (category === 'temperature') {
    const kelvin = temperatureScales[sourceKey as TemperatureUnit].toKelvin(value);
    if (!Number.isFinite(kelvin) || kelvin < -1e-12) {
      errors[sourceKey] = 'Temperature cannot be below absolute zero (−273.15°C / 0 K).';
      return { isValid: false, errors };
    }
  } else if (value < 0) {
    errors[sourceKey] = 'Value cannot be negative.';
    return { isValid: false, errors };
  }

  return { isValid: true, errors };
}

export function allowsNegative(category: ImperialCategory): boolean {
  return category === 'temperature';
}
