import { calculateAbsoluteReticulocyteCount, parseNumber } from './calculation';
import type {
  AbsoluteReticulocyteCountFieldErrors,
  AbsoluteReticulocyteCountInput,
  AbsoluteReticulocyteCountResult,
} from './types';

export interface AbsoluteReticulocyteCountValidation {
  errors: AbsoluteReticulocyteCountFieldErrors;
  result: AbsoluteReticulocyteCountResult | null;
}

export function validateAbsoluteReticulocyteCountInput(
  input: AbsoluteReticulocyteCountInput,
): AbsoluteReticulocyteCountValidation {
  const errors: AbsoluteReticulocyteCountFieldErrors = {};

  if (input.hematocritPercentText.trim() !== '') {
    const hct = parseNumber(input.hematocritPercentText);
    if (hct === null) errors.hematocritPercentText = 'Enter a valid hematocrit.';
    else if (!(hct > 0 && hct <= 100)) {
      errors.hematocritPercentText =
        'Hematocrit must be greater than 0 and at most 100%.';
    }
  }

  if (input.referenceHematocritPercentText.trim() !== '') {
    const ref = parseNumber(input.referenceHematocritPercentText);
    if (ref === null) {
      errors.referenceHematocritPercentText = 'Enter a valid reference hematocrit.';
    } else if (!(ref > 0 && ref <= 100)) {
      errors.referenceHematocritPercentText =
        'Reference hematocrit must be greater than 0 and at most 100%.';
    }
  }

  if (input.reticulocytePercentText.trim() !== '') {
    const retic = parseNumber(input.reticulocytePercentText);
    if (retic === null) {
      errors.reticulocytePercentText = 'Enter a valid percentage.';
    } else if (!(retic >= 0 && retic <= 100)) {
      errors.reticulocytePercentText =
        'Reticulocyte percentage must be between 0 and 100.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAbsoluteReticulocyteCount(input),
  };
}