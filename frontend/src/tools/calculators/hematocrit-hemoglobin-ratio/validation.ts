import {
  calculateHematocritHemoglobinRatio,
  parseNumber,
} from './calculation';
import type {
  HematocritHemoglobinRatioFieldErrors,
  HematocritHemoglobinRatioInput,
  HematocritHemoglobinRatioResult,
} from './types';

export interface HematocritHemoglobinRatioValidation {
  errors: HematocritHemoglobinRatioFieldErrors;
  result: HematocritHemoglobinRatioResult | null;
}

export function validateHematocritHemoglobinRatioInput(
  input: HematocritHemoglobinRatioInput,
): HematocritHemoglobinRatioValidation {
  const errors: HematocritHemoglobinRatioFieldErrors = {};

  if (input.hematocritPercentText.trim() !== '') {
    const hct = parseNumber(input.hematocritPercentText);
    if (hct === null) {
      errors.hematocritPercentText = 'Enter a valid hematocrit.';
    } else if (!(hct > 0 && hct <= 100)) {
      errors.hematocritPercentText =
        'Hematocrit must be greater than 0 and at most 100%.';
    }
  }

  if (input.hemoglobinGdlText.trim() !== '') {
    const hgb = parseNumber(input.hemoglobinGdlText);
    if (hgb === null) {
      errors.hemoglobinGdlText = 'Enter a valid hemoglobin.';
    } else if (!(hgb > 0 && hgb <= 40)) {
      errors.hemoglobinGdlText =
        'Hemoglobin must be greater than 0 and at most 40 g/dL.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateHematocritHemoglobinRatio(input),
  };
}
