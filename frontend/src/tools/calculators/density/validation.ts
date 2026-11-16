import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toKgPerM3 } from './calculation';
import { MAX_ABS_DENSITY, type DensityUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseDensityInput(raw: string): {
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
  if (value < 0) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Density cannot be negative.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function kgPerM3FromUnit(
  value: number,
  unit: DensityUnit,
): { ok: true; kgPerM3: number } | { ok: false; error: string } {
  if (value < 0) {
    return { ok: false, error: 'Density cannot be negative.' };
  }
  const kgPerM3 = toKgPerM3(value, unit);
  if (!Number.isFinite(kgPerM3)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(kgPerM3) > MAX_ABS_DENSITY) {
    return { ok: false, error: 'This density is outside the supported range.' };
  }
  return { ok: true, kgPerM3 };
}
