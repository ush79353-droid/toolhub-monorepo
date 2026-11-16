import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toCps } from './calculation';
import { MAX_ABS_CPS, type CpsUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseCpsInput(raw: string): {
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
      error: 'Frequency cannot be negative.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function cpsFromUnit(
  value: number,
  unit: CpsUnit,
): { ok: true; cps: number } | { ok: false; error: string } {
  const cps = toCps(value, unit);
  if (!Number.isFinite(cps)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (cps > MAX_ABS_CPS) {
    return { ok: false, error: 'This frequency is outside the supported range.' };
  }
  return { ok: true, cps };
}
