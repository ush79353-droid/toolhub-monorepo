import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toMetersPerSecond } from './calculation';
import { MAX_ABS_MPS, type SpeedUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseSpeedInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const trimmed = raw.trim();
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

export function metersPerSecondFromUnit(
  value: number,
  unit: SpeedUnit,
): { ok: true; mps: number } | { ok: false; error: string } {
  const mps = toMetersPerSecond(value, unit);
  if (!Number.isFinite(mps)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(mps) > MAX_ABS_MPS) {
    return { ok: false, error: 'This speed is outside the supported range.' };
  }
  return { ok: true, mps };
}
