import { parseDecimalString } from './calculation';
import { MAX_INPUT_LENGTH } from './types';

export function parseCapacitanceInput(raw: string): {
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
      error: 'This number exceeds the supported precision or input length.',
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
      error: 'Please enter a valid non-negative capacitance value.',
    };
  }
  return { blank: false, value: parsed };
}
