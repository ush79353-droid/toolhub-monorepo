import { MAX_ABS_VALUE, type AreaUnit } from './types';
import { toSquareMeters } from './calculation';

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

export function squareMetersFromField(
  value: number,
  unit: AreaUnit,
): { ok: true; squareMeters: number } | { ok: false; error: string } {
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid finite area.' };
  }
  if (value < 0) {
    return { ok: false, error: 'Area cannot be negative.' };
  }
  if (value > MAX_ABS_VALUE) {
    return { ok: false, error: 'Enter a smaller area.' };
  }
  try {
    const squareMeters = toSquareMeters(value, unit);
    if (!Number.isFinite(squareMeters)) {
      return { ok: false, error: 'Conversion result is out of range.' };
    }
    return { ok: true, squareMeters };
  } catch {
    return { ok: false, error: 'Unable to convert this area.' };
  }
}

export function parseField(
  raw: string,
): { blank: true } | { incomplete: true } | { value: number } | { error: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { blank: true };
  if (isIncompleteNumber(cleaned)) return { incomplete: true };
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { error: 'Enter a valid finite area.' };
  return { value };
}
