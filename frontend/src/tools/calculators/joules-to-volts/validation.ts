import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { MAX_ABS } from './types';

export { isIncompleteNumber, parseOptionalNumber };

/** Signed finite numbers allowed (energy, charge, voltage may be negative by convention). */
export function parseSignedInput(raw: string): {
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
  if (Math.abs(value) > MAX_ABS) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'This value is outside the supported range.',
    };
  }
  return { blank: false, incomplete: false, value };
}
