import { calculateEcgBoxesToSeconds } from './calculation';
import type {
  EcgBoxesToSecondsFieldErrors,
  EcgBoxesToSecondsInput,
  EcgBoxesToSecondsResult,
} from './types';

export interface EcgBoxesToSecondsValidation {
  isValid: boolean;
  errors: EcgBoxesToSecondsFieldErrors;
  result: EcgBoxesToSecondsResult | null;
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
 * Duration stays blank until box count is a valid non-negative number.
 * Zero boxes → 0 duration (valid).
 */
export function validateEcgBoxesToSecondsInput(
  input: EcgBoxesToSecondsInput
): EcgBoxesToSecondsValidation {
  const errors: EcgBoxesToSecondsFieldErrors = {};
  const parsed = parseNumber(input.boxCount);

  if (parsed.blank) {
    return { isValid: false, errors, result: null };
  }

  if (parsed.invalid || parsed.value === null || parsed.value < 0) {
    errors.boxCount = 'Enter a valid non-negative number of boxes.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateEcgBoxesToSeconds(input, parsed.value);
  if (!result) {
    errors.boxCount = 'Unable to compute duration for these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
