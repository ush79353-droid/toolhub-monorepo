import type { ConversionCategory } from './types';
import { MAX_ABS_VALUE } from './types';
import { getCategory, getUnit } from './units';
import { toBase, toKelvin } from './calculation';

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

export type ParseResult =
  | { blank: true; incomplete?: false; value?: undefined; error?: undefined }
  | { blank?: false; incomplete: true; value?: undefined; error?: undefined }
  | { blank?: false; incomplete?: false; value: null; error: string }
  | { blank?: false; incomplete?: false; value: number; error?: undefined };

export function parseMetricInput(raw: string): ParseResult {
  const cleaned = raw.trim();
  if (cleaned === '') return { blank: true };
  if (isIncompleteNumber(cleaned)) return { incomplete: true };
  const value = parseOptionalNumber(cleaned);
  if (value === null || !Number.isFinite(value)) {
    return { value: null, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(value) > MAX_ABS_VALUE) {
    return { value: null, error: 'Enter a smaller absolute value.' };
  }
  return { value };
}

export function baseFromField(
  value: number,
  category: ConversionCategory,
  unitId: string,
): { ok: true; base: number } | { ok: false; error: string } {
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }

  const cat = getCategory(category);
  const unit = getUnit(category, unitId);
  if (!unit) return { ok: false, error: 'Unknown unit.' };

  if (!cat.allowNegative && value < 0) {
    return { ok: false, error: 'Value cannot be negative for this quantity.' };
  }

  if (cat.kind === 'temperature') {
    const kelvin = toKelvin(value, unitId);
    if (!Number.isFinite(kelvin) || kelvin < 0) {
      return { ok: false, error: 'Temperature cannot be below absolute zero.' };
    }
    return { ok: true, base: kelvin };
  }

  try {
    const base = toBase(value, category, unitId);
    if (!Number.isFinite(base)) {
      return { ok: false, error: 'Result is not a finite value.' };
    }
    if (Math.abs(base) > MAX_ABS_VALUE * 1e6) {
      return { ok: false, error: 'Converted value is out of range.' };
    }
    return { ok: true, base };
  } catch {
    return { ok: false, error: 'Unable to convert this unit.' };
  }
}
