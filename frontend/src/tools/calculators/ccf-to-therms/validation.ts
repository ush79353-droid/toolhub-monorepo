import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { MAX_ABS_VALUE } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseAmountInput(raw: string): {
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

export function validateNonNegative(value: number): string | null {
  if (value < 0) return 'Enter zero or a positive value.';
  return null;
}

export function validatePositive(value: number): string | null {
  if (!(value > 0)) return 'Enter a value greater than zero.';
  return null;
}
