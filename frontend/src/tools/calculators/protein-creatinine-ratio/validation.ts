import {
  calculateProteinCreatinineRatio,
  parseNumber,
} from './calculation';
import type {
  ProteinCreatinineRatioFieldErrors,
  ProteinCreatinineRatioInput,
  ProteinCreatinineRatioResult,
} from './types';

export interface ProteinCreatinineRatioValidation {
  errors: ProteinCreatinineRatioFieldErrors;
  result: ProteinCreatinineRatioResult | null;
}

export function validateProteinCreatinineRatioInput(
  input: ProteinCreatinineRatioInput,
): ProteinCreatinineRatioValidation {
  const errors: ProteinCreatinineRatioFieldErrors = {};

  if (input.proteinText.trim() !== '') {
    const p = parseNumber(input.proteinText);
    if (p === null) {
      errors.proteinText = 'Enter a valid urine protein.';
    } else if (!(p >= 0 && p <= 5000)) {
      errors.proteinText = 'Urine protein must be between 0 and 5000 mg/dL.';
    }
  }

  if (input.creatinineText.trim() !== '') {
    const c = parseNumber(input.creatinineText);
    if (c === null) {
      errors.creatinineText = 'Enter a valid urine creatinine.';
    } else if (!(c > 0 && c <= 5000)) {
      errors.creatinineText =
        'Urine creatinine must be greater than 0 and at most 5000 in the selected unit.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateProteinCreatinineRatio(input),
  };
}
