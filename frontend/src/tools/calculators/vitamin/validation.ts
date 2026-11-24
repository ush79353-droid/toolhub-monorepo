/**
 * Vitamin Calculator — pure validation (ADR-018). UI stub; engine commit tightens age rules.
 */

import { calculateVitamin, parseNumber } from './calculation';
import type { VitaminFieldErrors, VitaminInput, VitaminResult } from './types';

export interface VitaminValidation {
  errors: VitaminFieldErrors;
  result: VitaminResult | null;
}

export function validateVitaminInput(input: VitaminInput): VitaminValidation {
  const errors: VitaminFieldErrors = {};

  if (input.ageText.trim() !== '') {
    const age = parseNumber(input.ageText);
    if (age === null) errors.ageText = 'Enter a valid age.';
    else if (!(age > 0)) errors.ageText = 'Age must be positive.';
    else if (input.ageUnit === 'years' && age > 120) {
      errors.ageText = 'Age must be 120 years or less.';
    } else if (input.ageUnit === 'months' && age > 120 * 12) {
      errors.ageText = 'Age must be 120 years or less.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateVitamin(input) };
}
