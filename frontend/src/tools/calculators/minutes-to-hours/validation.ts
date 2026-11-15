import { isComponentBelow60, parseDecimalString } from './calculation';
import { MAX_INPUT_LENGTH } from './types';

export function parseDurationInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: ReturnType<typeof parseDecimalString>;
  error?: string;
} {
  const trimmed = raw.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '+') {
    return { blank: trimmed === '', incomplete: trimmed !== '', value: null };
  }
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'This value exceeds the supported input length.',
    };
  }
  if (/^[+-]?\d+\.$/.test(trimmed) || trimmed === '.' || trimmed === '-.' || trimmed === '0.') {
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

export function parseHmsComponent(
  raw: string,
  kind: 'hours' | 'minutes' | 'seconds',
): ReturnType<typeof parseDurationInput> {
  const parsed = parseDurationInput(raw);
  if (parsed.blank || parsed.incomplete || !parsed.value) return parsed;
  if (kind !== 'hours' && !isComponentBelow60(parsed.value)) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Minutes and seconds in HH:MM:SS must be 0–59.',
    };
  }
  return parsed;
}
