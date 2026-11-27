import { calculateBri, parseNumber } from './calculation';
import type { BriFieldErrors, BriInput, BriResult } from './types';

export interface BriValidation {
  errors: BriFieldErrors;
  result: BriResult | null;
}

function checkPositive(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be positive.`;
  return undefined;
}

export function validateBriInput(input: BriInput): BriValidation {
  const errors: BriFieldErrors = {};

  const hErr = checkPositive(input.heightText, 'height');
  if (hErr) errors.heightText = hErr;

  const wErr = checkPositive(input.waistText, 'waist');
  if (wErr) errors.waistText = wErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateBri(input),
  };
}
