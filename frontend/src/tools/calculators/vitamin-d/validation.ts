/**
 * Vitamin D Calculator — UI stub validation (engine commit completes rules).
 */

import { calculateVitaminD, parseNumber } from './calculation';
import type {
  VitaminDFieldErrors,
  VitaminDInput,
  VitaminDResult,
} from './types';

export interface VitaminDValidation {
  errors: VitaminDFieldErrors;
  result: VitaminDResult | null;
}

export function validateVitaminDInput(input: VitaminDInput): VitaminDValidation {
  const errors: VitaminDFieldErrors = {};

  if (input.ageText.trim() !== '') {
    const age = parseNumber(input.ageText);
    if (age === null) errors.ageText = 'Enter a valid age.';
    else if (!(age >= 0)) errors.ageText = 'Age must be zero or greater.';
  }

  if (input.serumKnown === 'yes' && input.serumValueText.trim() !== '') {
    const serum = parseNumber(input.serumValueText);
    if (serum === null) errors.serumValueText = 'Enter a valid serum value.';
    else if (!(serum >= 0)) {
      errors.serumValueText = 'Serum value must be zero or greater.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateVitaminD(input) };
}
