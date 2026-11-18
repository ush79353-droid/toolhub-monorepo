import { parseDecimalString } from './calculation';
import { MAX_INPUT_LENGTH } from './types';

export function parseTimeInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: ReturnType<typeof parseDecimalString>;
  error?: string;
} {
  const trimmed = raw.trim();
  if (trimmed === '') {
    return { blank: true, incomplete: false, value: null };
  }
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'This value exceeds the supported input length.',
    };
  }
  if (
    trimmed === '-' ||
    trimmed === '+' ||
    trimmed === '.' ||
    trimmed === '-.' ||
    trimmed === '+.' ||
    /^[+-]?\d+\.$/.test(trimmed) ||
    /^[+-]?(?:\d+\.?\d*|\.\d+)[eE][+-]?$/.test(trimmed)
  ) {
    return { blank: false, incomplete: true, value: null };
  }
  const parsed = parseDecimalString(trimmed);
  if (!parsed) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Please enter a valid finite number.',
    };
  }
  return { blank: false, incomplete: false, value: parsed };
}
