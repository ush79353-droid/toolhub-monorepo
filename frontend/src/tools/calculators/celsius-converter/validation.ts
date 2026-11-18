import { toCelsius } from './calculation';
import {
  ABSOLUTE_ZERO_C,
  ABS_ZERO_EPS,
  MAX_ABS_CELSIUS,
  type TemperatureUnit,
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

export function parseTempInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, incomplete: false, value: null };
  if (isIncompleteNumber(trimmed)) return { blank: false, incomplete: true, value: null };
  const value = parseOptionalNumber(trimmed);
  if (value === null || !Number.isFinite(value)) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Enter a valid finite number.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function celsiusFromUnit(
  value: number,
  unit: TemperatureUnit,
): { ok: true; celsius: number } | { ok: false; error: string } {
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  const celsius = toCelsius(value, unit);
  if (!Number.isFinite(celsius)) {
    return { ok: false, error: 'Result is outside the finite numeric range.' };
  }
  if (celsius < ABSOLUTE_ZERO_C - ABS_ZERO_EPS) {
    return { ok: false, error: 'Temperature cannot be below absolute zero.' };
  }
  // Clamp tiny float noise at absolute zero to exact −273.15°C
  const c = celsius < ABSOLUTE_ZERO_C ? ABSOLUTE_ZERO_C : celsius;
  if (Math.abs(c) > MAX_ABS_CELSIUS) {
    return { ok: false, error: 'This temperature is outside the supported range.' };
  }
  return { ok: true, celsius: c };
}
