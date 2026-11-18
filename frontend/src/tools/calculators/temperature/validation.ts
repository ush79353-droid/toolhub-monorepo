import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { temperatureScales } from './calculation';
import {
  ABS_ZERO_EPS,
  MAX_ABS_KELVIN,
  type TemperatureUnit,
} from './types';

export { isIncompleteNumber, parseOptionalNumber };

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

export function kelvinFromUnit(
  value: number,
  unit: TemperatureUnit,
): { ok: true; kelvin: number } | { ok: false; error: string } {
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  const kelvin = temperatureScales[unit].toKelvin(value);
  if (!Number.isFinite(kelvin)) {
    return { ok: false, error: 'Result is outside the finite numeric range.' };
  }
  if (kelvin < -ABS_ZERO_EPS) {
    return {
      ok: false,
      error: 'Temperature cannot be below absolute zero (−273.15°C / 0 K).',
    };
  }
  // Clamp tiny negative float noise at absolute zero to 0
  const k = kelvin < 0 ? 0 : kelvin;
  if (k > MAX_ABS_KELVIN) {
    return { ok: false, error: 'This temperature is outside the supported range.' };
  }
  return { ok: true, kelvin: k };
}
