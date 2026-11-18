import { toMeters } from './calculation';
import { MAX_ABS_VALUE, type LengthUnit } from './types';

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

export function parseLengthInput(raw: string): ParseResult {
  const cleaned = raw.trim();
  if (cleaned === '') return { blank: true };
  if (isIncompleteNumber(cleaned)) return { incomplete: true };
  const value = parseOptionalNumber(cleaned);
  if (value === null || !Number.isFinite(value)) {
    return { value: null, error: 'Enter a valid finite number.' };
  }
  if (value < 0) {
    return { value: null, error: 'Enter a non-negative length.' };
  }
  if (Math.abs(value) > MAX_ABS_VALUE) {
    return { value: null, error: 'Enter a smaller finite value.' };
  }
  return { value };
}

export function metersFromField(
  value: number,
  unit: LengthUnit,
): { ok: true; meters: number } | { ok: false; error: string } {
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (value < 0) {
    return { ok: false, error: 'Enter a non-negative length.' };
  }
  if (Math.abs(value) > MAX_ABS_VALUE) {
    return { ok: false, error: 'Enter a smaller finite value.' };
  }
  const meters = toMeters(value, unit);
  if (!Number.isFinite(meters)) {
    return { ok: false, error: 'Result is not a finite length.' };
  }
  return { ok: true, meters };
}
