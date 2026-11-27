import { calculateCorrectedCalcium, parseNumber } from './calculation';
import type {
  CorrectedCalciumFieldErrors,
  CorrectedCalciumInput,
  CorrectedCalciumResult,
} from './types';

export interface CorrectedCalciumValidation {
  errors: CorrectedCalciumFieldErrors;
  result: CorrectedCalciumResult | null;
}

export function validateCorrectedCalciumInput(
  input: CorrectedCalciumInput,
): CorrectedCalciumValidation {
  const errors: CorrectedCalciumFieldErrors = {};

  if (input.calciumText.trim() !== '') {
    const c = parseNumber(input.calciumText);
    if (c === null) errors.calciumText = 'Enter a valid calcium value.';
    else if (!(c > 0)) errors.calciumText = 'Calcium must be greater than zero.';
  }

  if (input.albuminText.trim() !== '') {
    const a = parseNumber(input.albuminText);
    if (a === null) errors.albuminText = 'Enter a valid albumin value.';
    else if (!(a > 0)) errors.albuminText = 'Albumin must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateCorrectedCalcium(input),
  };
}
