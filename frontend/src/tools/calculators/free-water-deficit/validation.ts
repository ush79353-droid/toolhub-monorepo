import { calculateFreeWaterDeficit, parseNumber } from './calculation';
import type {
  FreeWaterDeficitFieldErrors,
  FreeWaterDeficitInput,
  FreeWaterDeficitResult,
} from './types';

export interface FreeWaterDeficitValidation {
  errors: FreeWaterDeficitFieldErrors;
  result: FreeWaterDeficitResult | null;
}

export function validateFreeWaterDeficitInput(
  input: FreeWaterDeficitInput,
): FreeWaterDeficitValidation {
  const errors: FreeWaterDeficitFieldErrors = {};

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be greater than zero.';
  }

  if (input.sodiumText.trim() !== '') {
    const s = parseNumber(input.sodiumText);
    if (s === null) errors.sodiumText = 'Enter a valid sodium level.';
    else if (!(s > 0))
      errors.sodiumText = 'Sodium must be greater than zero.';
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
    result: calculateFreeWaterDeficit(input),
  };
}
