import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { MAX_ABS_POWER } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseNonNegative(raw: string): {
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
      error: 'Values cannot be negative.',
    };
  }
  if (Math.abs(value) > MAX_ABS_POWER) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'This value is outside the supported range.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function parsePositiveResistance(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const base = parseNonNegative(raw);
  if (base.blank || base.incomplete || base.value == null) return base;
  if (base.value === 0) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Resistance must be greater than zero.',
    };
  }
  return base;
}

export function parsePowerFactor(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const base = parseNonNegative(raw);
  if (base.blank || base.incomplete || base.value == null) return base;
  if (base.value > 1) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Power factor must be between 0 and 1.',
    };
  }
  return base;
}
