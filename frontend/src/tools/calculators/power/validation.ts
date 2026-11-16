import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toWatts } from './calculation';
import { MAX_ABS_WATTS, type PowerUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parsePowerInput(raw: string): {
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

export function wattsFromUnit(
  value: number,
  unit: PowerUnit,
): { ok: true; watts: number } | { ok: false; error: string } {
  const watts = toWatts(value, unit);
  if (!Number.isFinite(watts)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(watts) > MAX_ABS_WATTS) {
    return { ok: false, error: 'This power value is outside the supported range.' };
  }
  return { ok: true, watts };
}
