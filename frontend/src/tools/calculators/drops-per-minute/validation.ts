import { calculateDropsPerMinute, parseNumber } from './calculation';
import type {
  DropsPerMinuteFieldErrors,
  DropsPerMinuteInput,
  DropsPerMinuteResult,
} from './types';

export interface DropsPerMinuteValidation {
  errors: DropsPerMinuteFieldErrors;
  result: DropsPerMinuteResult | null;
}

function checkPositive(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be greater than zero.`;
  return undefined;
}

export function validateDropsPerMinuteInput(
  input: DropsPerMinuteInput,
): DropsPerMinuteValidation {
  const errors: DropsPerMinuteFieldErrors = {};
  const v = checkPositive(input.volumeText, 'volume');
  if (v) errors.volumeText = v;
  const t = checkPositive(input.timeText, 'time');
  if (t) errors.timeText = t;
  const f = checkPositive(input.dropFactorText, 'drop factor');
  if (f) errors.dropFactorText = f;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }
  return { errors: {}, result: calculateDropsPerMinute(input) };
}
