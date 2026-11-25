import { calculateIdealWeight, parseNumber } from './calculation';
import type {
  IdealWeightFieldErrors,
  IdealWeightInput,
  IdealWeightResult,
} from './types';

export interface IdealWeightValidation {
  errors: IdealWeightFieldErrors;
  result: IdealWeightResult | null;
}

export function validateIdealWeightInput(
  input: IdealWeightInput,
): IdealWeightValidation {
  const errors: IdealWeightFieldErrors = {};

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be greater than zero.';
  }

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateIdealWeight(input),
  };
}
