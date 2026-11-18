import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toKmPerLiter } from './calculation';
import { MAX_ABS_KM_PER_L, type FuelEconomyUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseFuelInput(raw: string): {
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
      error: 'Fuel economy values cannot be negative.',
    };
  }
  if (value === 0) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Fuel economy must be greater than zero for a finite conversion result.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function kmPerLiterFromUnit(
  value: number,
  unit: FuelEconomyUnit,
): { ok: true; kmPerLiter: number } | { ok: false; error: string } {
  if (value <= 0) {
    return {
      ok: false,
      error: 'Fuel economy must be greater than zero for a finite conversion result.',
    };
  }
  const kmPerLiter = toKmPerLiter(value, unit);
  if (!Number.isFinite(kmPerLiter)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(kmPerLiter) > MAX_ABS_KM_PER_L) {
    return { ok: false, error: 'This value is outside the supported range.' };
  }
  return { ok: true, kmPerLiter };
}
