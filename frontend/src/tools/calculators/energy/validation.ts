import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toJoules } from './calculation';
import { MAX_ABS_JOULES, type EnergyUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseEnergyInput(raw: string): {
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

export function joulesFromUnit(
  value: number,
  unit: EnergyUnit,
): { ok: true; joules: number } | { ok: false; error: string } {
  const joules = toJoules(value, unit);
  if (!Number.isFinite(joules)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(joules) > MAX_ABS_JOULES) {
    return { ok: false, error: 'This energy value is outside the supported range.' };
  }
  return { ok: true, joules };
}
