import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { dmsToRadians, toRadians } from './calculation';
import { MAX_ABS_RADIANS, type AngleUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseAngleField(raw: string): {
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

export function radiansFromUnit(
  value: number,
  unit: Exclude<AngleUnit, 'dms'>,
): { ok: true; radians: number } | { ok: false; error: string } {
  const radians = toRadians(value, unit);
  if (!Number.isFinite(radians)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(radians) > MAX_ABS_RADIANS) {
    return { ok: false, error: 'This angle is outside the supported range.' };
  }
  return { ok: true, radians };
}

export function parseDmsComponents(degreesRaw: string, minutesRaw: string, secondsRaw: string): {
  blank: boolean;
  incomplete: boolean;
  radians: number | null;
  errors: Partial<Record<'dmsDegrees' | 'dmsMinutes' | 'dmsSeconds', string>>;
} {
  const deg = degreesRaw.trim();
  const min = minutesRaw.trim();
  const sec = secondsRaw.trim();
  const errors: Partial<Record<'dmsDegrees' | 'dmsMinutes' | 'dmsSeconds', string>> = {};

  if (deg === '' && min === '' && sec === '') {
    return { blank: true, incomplete: false, radians: null, errors };
  }

  if (
    deg === '-' ||
    deg === '-.' ||
    deg === '.' ||
    isIncompleteNumber(deg) ||
    isIncompleteNumber(min) ||
    isIncompleteNumber(sec)
  ) {
    return { blank: false, incomplete: true, radians: null, errors };
  }

  const negative = deg.startsWith('-');
  const degValue = deg === '' ? 0 : Number(deg);
  if (!Number.isFinite(degValue)) {
    errors.dmsDegrees = 'Enter a valid number of degrees.';
  }
  const magnitude = Math.abs(degValue);

  const minutes = min === '' ? 0 : Number(min);
  const seconds = sec === '' ? 0 : Number(sec);
  if (!Number.isFinite(minutes) || minutes < 0 || minutes >= 60) {
    errors.dmsMinutes = 'Minutes must be from 0 (inclusive) to 60 (exclusive).';
  }
  if (!Number.isFinite(seconds) || seconds < 0 || seconds >= 60) {
    errors.dmsSeconds = 'Seconds must be from 0 (inclusive) to 60 (exclusive).';
  }
  if (Object.keys(errors).length > 0) {
    return { blank: false, incomplete: false, radians: null, errors };
  }

  const radians = dmsToRadians(magnitude, minutes, seconds, negative ? -1 : 1);
  if (!Number.isFinite(radians) || Math.abs(radians) > MAX_ABS_RADIANS) {
    errors.dmsDegrees = 'This angle is outside the supported range.';
    return { blank: false, incomplete: false, radians: null, errors };
  }
  return { blank: false, incomplete: false, radians, errors };
}
