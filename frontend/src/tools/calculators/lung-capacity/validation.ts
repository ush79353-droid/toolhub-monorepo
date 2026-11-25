import { calculateLungCapacity, parseNumber } from './calculation';
import type {
  LungCapacityFieldErrors,
  LungCapacityInput,
  LungCapacityResult,
} from './types';

export interface LungCapacityValidation {
  errors: LungCapacityFieldErrors;
  result: LungCapacityResult | null;
}

function checkField(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (n < 0) return `${label} must be non-negative.`;
  return undefined;
}

export function validateLungCapacityInput(
  input: LungCapacityInput,
): LungCapacityValidation {
  const errors: LungCapacityFieldErrors = {};
  const irv = checkField(input.irvText, 'IRV');
  const tv = checkField(input.tvText, 'TV');
  const erv = checkField(input.ervText, 'ERV');
  const rv = checkField(input.rvText, 'RV');
  if (irv) errors.irvText = irv;
  if (tv) errors.tvText = tv;
  if (erv) errors.ervText = erv;
  if (rv) errors.rvText = rv;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateLungCapacity(input) };
}
