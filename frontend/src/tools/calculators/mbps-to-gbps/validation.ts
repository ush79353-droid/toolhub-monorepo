import { parseDecimalString } from './calculation';
import { MAX_INPUT_LENGTH } from './types';

export function parseRateInput(raw: string): {
  blank: boolean;
  value: ReturnType<typeof parseDecimalString>;
  error?: string;
} {
  const trimmed = raw.trim();
  if (trimmed === '') return { blank: true, value: null };
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      blank: false,
      value: null,
      error: 'This value exceeds the supported input length.',
    };
  }
  if (/^\d+\.$/.test(trimmed) || trimmed === '.' || trimmed === '0.') {
    return { blank: false, value: null };
  }
  const parsed = parseDecimalString(trimmed);
  if (!parsed || parsed.sign < 0) {
    return {
      blank: false,
      value: null,
      error: 'Please enter a valid non-negative number.',
    };
  }
  return { blank: false, value: parsed };
}
