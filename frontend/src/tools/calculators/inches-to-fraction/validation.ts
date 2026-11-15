import { parseLengthInput } from './calculation';
import {
  MAX_ABS_VALUE,
  type FractionPrecision,
  type InchesToFractionFieldErrors,
} from './types';

export function validateInchesToFraction(rawDistance: string): {
  isValid: boolean;
  errors: InchesToFractionFieldErrors;
  parsedInches: number | null;
} {
  const errors: InchesToFractionFieldErrors = {};
  const parsed = parseLengthInput(rawDistance);

  if (parsed.kind === 'incomplete') {
    return { isValid: false, errors, parsedInches: null };
  }

  if (parsed.kind === 'invalid') {
    errors.inches = parsed.message;
    return { isValid: false, errors, parsedInches: null };
  }

  if (Math.abs(parsed.value) > MAX_ABS_VALUE) {
    errors.inches = 'Enter a smaller measurement.';
    return { isValid: false, errors, parsedInches: null };
  }

  return {
    isValid: true,
    errors,
    parsedInches: parsed.value,
  };
}

export function isValidPrecision(value: number): value is FractionPrecision {
  return (
    value === 2 ||
    value === 4 ||
    value === 8 ||
    value === 16 ||
    value === 32 ||
    value === 64 ||
    value === 128 ||
    value === 256
  );
}
