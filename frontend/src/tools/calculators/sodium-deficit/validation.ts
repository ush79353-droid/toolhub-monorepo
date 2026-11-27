import { calculateSodiumDeficit, parseNumber } from './calculation';
import type {
  SodiumDeficitFieldErrors,
  SodiumDeficitInput,
  SodiumDeficitResult,
} from './types';

export interface SodiumDeficitValidation {
  errors: SodiumDeficitFieldErrors;
  result: SodiumDeficitResult | null;
}

export function validateSodiumDeficitInput(
  input: SodiumDeficitInput,
): SodiumDeficitValidation {
  const errors: SodiumDeficitFieldErrors = {};

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be greater than zero.';
  }

  if (input.sodiumText.trim() !== '') {
    const s = parseNumber(input.sodiumText);
    if (s === null) errors.sodiumText = 'Enter a valid serum sodium.';
    else if (!(s > 0))
      errors.sodiumText = 'Serum sodium must be greater than zero.';
  }

  if (input.desiredSodiumText.trim() !== '') {
    const d = parseNumber(input.desiredSodiumText);
    if (d === null) errors.desiredSodiumText = 'Enter a valid desired sodium.';
    else if (!(d > 0))
      errors.desiredSodiumText = 'Desired sodium must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateSodiumDeficit(input),
  };
}
