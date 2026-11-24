import { calculateIronDeficiency, parseNumber, weightToKg } from './calculation';
import type {
  IronDeficiencyFieldErrors,
  IronDeficiencyInput,
  IronDeficiencyResult,
} from './types';

export interface IronDeficiencyValidation {
  errors: IronDeficiencyFieldErrors;
  result: IronDeficiencyResult | null;
}

export function validateIronDeficiencyInput(
  input: IronDeficiencyInput,
): IronDeficiencyValidation {
  const errors: IronDeficiencyFieldErrors = {};

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
    else if (!(weightToKg(w, input.weightUnit) > 0)) {
      errors.weightText = 'Weight must be positive.';
    }
  }

  if (input.actualHemoglobinText.trim() !== '') {
    const a = parseNumber(input.actualHemoglobinText);
    if (a === null) errors.actualHemoglobinText = 'Enter a valid hemoglobin.';
    else if (a < 0) {
      errors.actualHemoglobinText = 'Hemoglobin must be non-negative.';
    }
  }

  if (input.targetHemoglobinText.trim() !== '') {
    const t = parseNumber(input.targetHemoglobinText);
    if (t === null) errors.targetHemoglobinText = 'Enter a valid hemoglobin.';
    else if (t < 0) {
      errors.targetHemoglobinText = 'Hemoglobin must be non-negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateIronDeficiency(input),
  };
}
