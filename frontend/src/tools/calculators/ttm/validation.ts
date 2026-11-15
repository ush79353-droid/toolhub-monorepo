import { calculateTtm } from './calculation';
import type { TtmFieldErrors, TtmInput, TtmResult } from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (/infinity|nan/i.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateTtmInput(input: TtmInput): {
  isValid: boolean;
  errors: TtmFieldErrors;
  result: TtmResult | null;
} {
  const errors: TtmFieldErrors = {};

  const q0 = parseField(input.quarter0);
  const q1 = parseField(input.quarter1);
  const q2 = parseField(input.quarter2);
  const q3 = parseField(input.quarter3);

  // Cascading blank: all four required before a complete TTM is shown
  if (q0 === null || q1 === null || q2 === null || q3 === null) {
    return { isValid: false, errors, result: null };
  }

  const labels = [
    ['quarter0', q0, 'last reported quarter'],
    ['quarter1', q1, 'one quarter before'],
    ['quarter2', q2, 'two quarters before'],
    ['quarter3', q3, 'three quarters before'],
  ] as const;

  for (const [key, value, label] of labels) {
    if (Number.isNaN(value)) {
      errors[key] = `Enter a valid ${label} value.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateTtm(q0, q1, q2, q3, input.currency);
  if (!result) {
    errors.form = 'Unable to calculate trailing twelve month value.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
