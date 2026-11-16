import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { paceToMetersPerSecond, toMetersPerSecond } from './calculation';
import {
  MAX_ABS_MPS,
  isPaceUnit,
  type PaceUnit,
  type SpeedField,
  type SpeedUnit,
} from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseSpeedInput(raw: string): {
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
      error: 'Speed and pace values cannot be negative.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function mpsFromField(
  value: number,
  field: SpeedField,
): { ok: true; mps: number } | { ok: false; error: string } {
  if (isPaceUnit(field)) {
    if (value === 0) {
      return {
        ok: false,
        error: 'Pace must be greater than zero (zero pace is undefined).',
      };
    }
    const mps = paceToMetersPerSecond(value, field as PaceUnit);
    if (mps == null || !Number.isFinite(mps)) {
      return { ok: false, error: 'Enter a valid finite pace greater than zero.' };
    }
    if (mps > MAX_ABS_MPS) {
      return { ok: false, error: 'This pace implies a speed outside the supported range.' };
    }
    return { ok: true, mps };
  }

  const mps = toMetersPerSecond(value, field as SpeedUnit);
  if (!Number.isFinite(mps)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(mps) > MAX_ABS_MPS) {
    return { ok: false, error: 'This speed is outside the supported range.' };
  }
  return { ok: true, mps };
}
