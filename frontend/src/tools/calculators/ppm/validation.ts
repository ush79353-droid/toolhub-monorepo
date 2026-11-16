import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toRatio } from './calculation';
import { MAX_ABS_RATIO, type PpmUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parsePpmInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '').replace(/%/g, '').replace(/‰/g, '');
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
      error: 'Concentration values cannot be negative.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function ratioFromUnit(
  value: number,
  unit: PpmUnit,
): { ok: true; ratio: number } | { ok: false; error: string } {
  if (value < 0) {
    return { ok: false, error: 'Concentration values cannot be negative.' };
  }
  const ratio = toRatio(value, unit);
  if (!Number.isFinite(ratio)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(ratio) > MAX_ABS_RATIO) {
    return { ok: false, error: 'This value is outside the supported range.' };
  }
  return { ok: true, ratio };
}
