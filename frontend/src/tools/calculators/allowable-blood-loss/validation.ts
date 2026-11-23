import { calculateAllowableBloodLoss, parseNumber } from './calculation';
import type {
  AllowableBloodLossFieldErrors,
  AllowableBloodLossInput,
  AllowableBloodLossResult,
} from './types';

export interface AllowableBloodLossValidation {
  errors: AllowableBloodLossFieldErrors;
  result: AllowableBloodLossResult | null;
}

export function validateAllowableBloodLossInput(
  input: AllowableBloodLossInput,
): AllowableBloodLossValidation {
  const errors: AllowableBloodLossFieldErrors = {};

  if (input.weightKgText.trim() !== '') {
    const w = parseNumber(input.weightKgText);
    if (w === null) errors.weightKgText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightKgText = 'Weight must be positive.';
  }

  if (input.initialHemoglobinGPerDlText.trim() !== '') {
    const hb = parseNumber(input.initialHemoglobinGPerDlText);
    if (hb === null) {
      errors.initialHemoglobinGPerDlText = 'Enter a valid hemoglobin.';
    } else if (!(hb > 0)) {
      errors.initialHemoglobinGPerDlText = 'Initial hemoglobin must be positive.';
    }
  }

  if (input.lowestAcceptableHemoglobinGPerDlText.trim() !== '') {
    const low = parseNumber(input.lowestAcceptableHemoglobinGPerDlText);
    if (low === null) {
      errors.lowestAcceptableHemoglobinGPerDlText =
        'Enter a valid hemoglobin threshold.';
    } else if (!(low > 0)) {
      errors.lowestAcceptableHemoglobinGPerDlText =
        'Lowest acceptable hemoglobin must be positive.';
    } else {
      const initial = parseNumber(input.initialHemoglobinGPerDlText);
      if (initial != null && initial > 0 && low > initial) {
        errors.lowestAcceptableHemoglobinGPerDlText =
          'Lowest Hb cannot exceed initial Hb.';
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAllowableBloodLoss(input),
  };
}