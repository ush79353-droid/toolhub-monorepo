import { calculateGastricSleeveWeightLoss, parseNumber } from './calculation';
import type {
  GastricSleeveWeightLossFieldErrors,
  GastricSleeveWeightLossInput,
  GastricSleeveWeightLossResult,
} from './types';

export interface GastricSleeveWeightLossValidation {
  errors: GastricSleeveWeightLossFieldErrors;
  result: GastricSleeveWeightLossResult | null;
}

export function validateGastricSleeveWeightLossInput(
  input: GastricSleeveWeightLossInput,
): GastricSleeveWeightLossValidation {
  const errors: GastricSleeveWeightLossFieldErrors = {};

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be positive.';
  }

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
  }

  if (input.surgeryType !== '' && input.surgeryType !== 'gastric_sleeve') {
    errors.surgeryType = 'Only gastric sleeve is supported.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateGastricSleeveWeightLoss(input) };
}
