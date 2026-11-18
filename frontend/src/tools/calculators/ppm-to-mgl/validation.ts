import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { MAX_PPM } from './types';

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
      error: 'Please enter a valid concentration.',
    };
  }
  if (value < 0) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Concentration cannot be negative.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function parsePpm(raw: string): ReturnType<typeof parseNonNegative> {
  const parsed = parseNonNegative(raw);
  if (parsed.value != null && parsed.value > MAX_PPM) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: `Mass-based ppm cannot exceed ${MAX_PPM.toLocaleString()} (mass fraction of 1).`,
    };
  }
  return parsed;
}

export function parsePositive(
  raw: string,
  label: string,
): {
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
      error: `Enter a valid ${label}.`,
    };
  }
  if (value <= 0) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: `${label} must be greater than zero.`,
    };
  }
  return { blank: false, incomplete: false, value };
}
