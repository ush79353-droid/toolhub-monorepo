import { calculateFlangeSize, diameterToMm } from './calculation';
import type {
  FlangeSizeFieldErrors,
  FlangeSizeInput,
  FlangeSizeResult,
} from './types';

export interface FlangeSizeValidation {
  isValid: boolean;
  errors: FlangeSizeFieldErrors;
  result: FlangeSizeResult | null;
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

export function validateFlangeSizeInput(
  input: FlangeSizeInput
): FlangeSizeValidation {
  const errors: FlangeSizeFieldErrors = {};
  const parsed = parseNumber(input.diameterValue);

  if (parsed.blank) {
    return { isValid: false, errors, result: null };
  }

  if (parsed.invalid || parsed.value === null || parsed.value < 0) {
    errors.diameterValue = 'Enter a valid non-negative nipple diameter.';
    return { isValid: false, errors, result: null };
  }

  const diameterMm = diameterToMm(parsed.value, input.diameterUnit);
  if (diameterMm == null) {
    errors.diameterValue = 'Enter a valid nipple diameter.';
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculateFlangeSize(input, diameterMm),
  };
}
