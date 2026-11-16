import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toPixels } from './calculation';
import { MAX_ABS_VALUE, type SizeUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseSizeInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '').replace(/%/g, '');
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
      error: 'Size values cannot be negative.',
    };
  }
  if (Math.abs(value) > MAX_ABS_VALUE) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'This value is outside the supported range.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function parseBaseInput(raw: string): {
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
  if (value <= 0) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Base font size must be greater than zero.',
    };
  }
  if (value > MAX_ABS_VALUE) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'This value is outside the supported range.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function pixelsFromUnit(
  value: number,
  unit: SizeUnit,
  basePx: number,
): { ok: true; px: number } | { ok: false; error: string } {
  if (basePx <= 0) {
    return { ok: false, error: 'Base font size must be greater than zero.' };
  }
  if (value < 0) {
    return { ok: false, error: 'Size values cannot be negative.' };
  }
  const px = toPixels(value, unit, basePx);
  if (!Number.isFinite(px)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(px) > MAX_ABS_VALUE) {
    return { ok: false, error: 'This value is outside the supported range.' };
  }
  return { ok: true, px };
}
