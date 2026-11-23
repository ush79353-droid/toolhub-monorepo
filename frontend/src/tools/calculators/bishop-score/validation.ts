import {
  calculateBishopScore,
  dilationToCm,
  scoreDilationCm,
  MAX_DILATION_CM,
} from './calculation';
import type {
  BishopScoreFieldErrors,
  BishopScoreInput,
  BishopScoreResult,
} from './types';

export interface BishopScoreValidation {
  isValid: boolean;
  errors: BishopScoreFieldErrors;
  result: BishopScoreResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

/**
 * Score is inactive until dilation is a valid non-blank entry (all five
 * findings then present). Radios always carry a selected band.
 */
export function validateBishopScoreInput(
  input: BishopScoreInput
): BishopScoreValidation {
  const errors: BishopScoreFieldErrors = {};
  const parsed = parseNumber(input.dilationValue);

  if (parsed.blank) {
    return { isValid: false, errors, result: null };
  }

  if (parsed.invalid || parsed.value === null || parsed.value < 0) {
    errors.dilationValue = 'Enter a valid non-negative dilation.';
    return { isValid: false, errors, result: null };
  }

  const dilationCm = dilationToCm(parsed.value, input.dilationUnit);
  if (dilationCm == null) {
    errors.dilationValue = 'Enter a valid dilation.';
    return { isValid: false, errors, result: null };
  }

  if (dilationCm > MAX_DILATION_CM) {
    errors.dilationValue = `Dilation above ${MAX_DILATION_CM} cm is outside the supported Bishop range.`;
    return { isValid: false, errors, result: null };
  }

  const dilationPoints = scoreDilationCm(dilationCm);
  if (dilationPoints == null) {
    errors.dilationValue = 'Dilation cannot be scored.';
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculateBishopScore(input, dilationCm, dilationPoints),
  };
}
