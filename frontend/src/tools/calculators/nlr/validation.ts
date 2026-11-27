import { calculateNlr, parseNumber } from './calculation';
import type { NlrFieldErrors, NlrInput, NlrResult } from './types';

export interface NlrValidation {
  errors: NlrFieldErrors;
  result: NlrResult | null;
}

export function validateNlrInput(input: NlrInput): NlrValidation {
  const errors: NlrFieldErrors = {};
  const isPercent = input.mode === 'percent';

  if (input.neutrophilText.trim() !== '') {
    const n = parseNumber(input.neutrophilText);
    if (n === null) {
      errors.neutrophilText = isPercent
        ? 'Enter a valid neutrophil %.'
        : 'Enter a valid ANC.';
    } else if (isPercent) {
      if (!(n >= 0 && n <= 100)) {
        errors.neutrophilText = 'Neutrophil percentage must be between 0 and 100.';
      }
    } else if (!(n >= 0)) {
      errors.neutrophilText = 'ANC must be non-negative.';
    }
  }

  if (input.lymphocyteText.trim() !== '') {
    const l = parseNumber(input.lymphocyteText);
    if (l === null) {
      errors.lymphocyteText = isPercent
        ? 'Enter a valid lymphocyte %.'
        : 'Enter a valid ALC.';
    } else if (isPercent) {
      if (!(l >= 0 && l <= 100)) {
        errors.lymphocyteText =
          'Lymphocyte percentage must be between 0 and 100.';
      } else if (!(l > 0)) {
        errors.lymphocyteText = 'Lymphocyte percentage must be greater than zero.';
      }
    } else if (!(l > 0)) {
      errors.lymphocyteText = 'ALC must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateNlr(input) };
}
