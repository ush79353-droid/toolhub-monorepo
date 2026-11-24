/**
 * Vitamin D Calculator — pure input validation (ADR-018).
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
    if (age === null) {
      errors.ageText = 'Enter a valid age.';
    } else if (!(age >= 0)) {
      errors.ageText = 'Age must be zero or greater.';
    } else if (input.ageUnit === 'yrs' && age > 120) {
      errors.ageText = 'Age must be 120 years or less.';
    } else if (input.ageUnit === 'mo' && age > 1440) {
      errors.ageText = 'Age must be 1440 months (120 years) or less.';
    }
  }

  if (input.serumKnown === 'yes' && input.serumValueText.trim() !== '') {
    const serum = parseNumber(input.serumValueText);
    if (serum === null) {
      errors.serumValueText = 'Enter a valid serum value.';
    } else if (!(serum >= 0)) {
      errors.serumValueText = 'Serum value must be zero or greater.';
    } else if (serum > 1e6) {
      errors.serumValueText = 'Serum value is unrealistically large.';
    }
  }

  if (input.serumAnalyte !== '25ohd') {
    errors.serumValueText =
      errors.serumValueText ?? 'Analyte must be 25(OH)D.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateVitaminD(input) };
}
