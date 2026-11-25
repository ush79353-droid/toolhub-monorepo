import { calculateUrr, parseNumber, ureaToMgDl } from './calculation';
import type { UrrFieldErrors, UrrInput, UrrResult } from './types';

export interface UrrValidation {
  errors: UrrFieldErrors;
  result: UrrResult | null;
}

function checkNonNeg(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label} value.`;
  if (n < 0) return `${label} must be non-negative.`;
  return undefined;
}

export function validateUrrInput(input: UrrInput): UrrValidation {
  const errors: UrrFieldErrors = {};

  const preErr = checkNonNeg(input.preUreaText, 'pre-dialysis urea');
  if (preErr) errors.preUreaText = preErr;
  const postErr = checkNonNeg(input.postUreaText, 'post-dialysis urea');
  if (postErr) errors.postUreaText = postErr;

  const preRaw = parseNumber(input.preUreaText);
  if (
    input.preUreaText.trim() !== '' &&
    preRaw !== null &&
    !errors.preUreaText
  ) {
    const preMgDl = ureaToMgDl(preRaw, input.preUnit);
    if (!(preMgDl > 0)) {
      errors.preUreaText = 'Pre-dialysis urea must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateUrr(input) };
}
