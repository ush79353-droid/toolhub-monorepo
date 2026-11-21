import {
  MAX_WEEK,
  MIN_WEEK,
  calculateMaintainPregnancyWeight,
  heightToMeters,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  MaintainPregnancyWeightFieldErrors,
  MaintainPregnancyWeightInput,
  MaintainPregnancyWeightResult,
} from './types';

export interface MaintainPregnancyWeightValidation {
  isValid: boolean;
  errors: MaintainPregnancyWeightFieldErrors;
  result: MaintainPregnancyWeightResult | null;
}

export function collectFieldErrors(
  input: MaintainPregnancyWeightInput,
): MaintainPregnancyWeightFieldErrors {
  const errors: MaintainPregnancyWeightFieldErrors = {};
  const h = parseNumber(input.height);
  const w = parseNumber(input.weight);
  const week = parseNumber(input.week);

  if (input.height.trim() === '') errors.height = 'Enter pre-pregnancy height.';
  else if (h == null || h <= 0) errors.height = 'Enter a valid height.';
  else if (!(heightToMeters(h, input.heightUnit) > 0))
    errors.height = 'Height is out of range.';

  if (input.weight.trim() === '')
    errors.weight = 'Enter pre-pregnancy weight.';
  else if (w == null || w <= 0) errors.weight = 'Enter a valid weight.';
  else if (!(weightToKg(w, input.weightUnit) > 0))
    errors.weight = 'Weight is out of range.';

  if (input.week.trim() === '') errors.week = 'Enter pregnancy week.';
  else if (week == null) errors.week = 'Enter a valid week.';
  else if (week < MIN_WEEK || week > MAX_WEEK)
    errors.week = `Week must be between ${MIN_WEEK} and ${MAX_WEEK}.`;

  return errors;
}

export function validateMaintainPregnancyWeightInput(
  input: MaintainPregnancyWeightInput,
): MaintainPregnancyWeightValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateMaintainPregnancyWeight(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
