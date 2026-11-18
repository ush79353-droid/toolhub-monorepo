import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toGray, toSievert } from './calculation';
import {
  MAX_ABS_DOSE,
  type AbsorbedUnit,
  type EquivalentUnit,
} from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseDoseInput(raw: string): {
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
      error: 'Dose values cannot be negative.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function grayFromUnit(
  value: number,
  unit: AbsorbedUnit,
): { ok: true; gray: number } | { ok: false; error: string } {
  const gray = toGray(value, unit);
  if (!Number.isFinite(gray)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(gray) > MAX_ABS_DOSE) {
    return { ok: false, error: 'This dose value is outside the supported range.' };
  }
  return { ok: true, gray };
}

export function sievertFromUnit(
  value: number,
  unit: EquivalentUnit,
): { ok: true; sievert: number } | { ok: false; error: string } {
  const sievert = toSievert(value, unit);
  if (!Number.isFinite(sievert)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(sievert) > MAX_ABS_DOSE) {
    return { ok: false, error: 'This dose value is outside the supported range.' };
  }
  return { ok: true, sievert };
}
