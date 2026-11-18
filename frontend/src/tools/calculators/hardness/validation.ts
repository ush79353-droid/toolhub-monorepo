import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';

export { isIncompleteNumber, parseOptionalNumber };

export function parseHardnessInput(raw: string): {
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
      error: 'Hardness values cannot be negative.',
    };
  }
  if (value === 0) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Enter a positive hardness value within a supported reference range.',
    };
  }
  return { blank: false, incomplete: false, value };
}
