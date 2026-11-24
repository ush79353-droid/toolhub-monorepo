import { parseNumber } from '../absolute-reticulocyte-count/calculation';
import { calculateCorrectedReticulocyteCount } from './calculation';
import type {
  CorrectedReticulocyteCountFieldErrors,
  CorrectedReticulocyteCountInput,
  CorrectedReticulocyteCountResult,
} from './types';

export interface CorrectedReticulocyteCountValidation {
  isValid: boolean;
  errors: CorrectedReticulocyteCountFieldErrors;
  result: CorrectedReticulocyteCountResult | null;
}

export function validateCorrectedReticulocyteCountInput(
  input: CorrectedReticulocyteCountInput,
): CorrectedReticulocyteCountValidation {
  const errors: CorrectedReticulocyteCountFieldErrors = {};
  const hct = parseNumber(input.hematocritPercentText);
  const retic = parseNumber(input.reticulocytePercentText);

  if (input.hematocritPercentText.trim() !== '' && hct === null) {
    errors.hematocritPercentText = 'Enter a valid hematocrit percentage.';
  } else if (hct !== null && !(hct > 0 && hct <= 100)) {
    errors.hematocritPercentText = 'Hematocrit must be between 0 and 100%.';
  }

  if (input.reticulocytePercentText.trim() !== '' && retic === null) {
    errors.reticulocytePercentText = 'Enter a valid reticulocyte percentage.';
  } else if (retic !== null && !(retic >= 0 && retic <= 100)) {
    errors.reticulocytePercentText = 'Reticulocyte % must be between 0 and 100.';
  }

  if (input.useCustomReferenceHematocrit) {
    const ref = parseNumber(input.referenceHematocritPercentText);
    if (input.referenceHematocritPercentText.trim() !== '' && ref === null) {
      errors.referenceHematocritPercentText = 'Enter a valid reference hematocrit.';
    } else if (ref !== null && !(ref > 0 && ref <= 100)) {
      errors.referenceHematocritPercentText =
        'Reference hematocrit must be between 0 and 100%.';
    }
  }

  const result = calculateCorrectedReticulocyteCount(input);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    result,
  };
}