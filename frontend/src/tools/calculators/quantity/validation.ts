import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toUnits } from './calculation';
import { MAX_ABS_UNITS, type QuantityUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseQuantityInput(raw: string): {
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
      error: 'Quantity counts cannot be negative.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function unitsFromQuantity(
  value: number,
  unit: QuantityUnit,
): { ok: true; units: number } | { ok: false; error: string } {
  if (value < 0) {
    return { ok: false, error: 'Quantity counts cannot be negative.' };
  }
  const units = toUnits(value, unit);
  if (!Number.isFinite(units)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(units) > MAX_ABS_UNITS) {
    return { ok: false, error: 'This quantity is outside the supported range.' };
  }
  return { ok: true, units };
}
