/**
 * Micronutrient Calculator — UI stub validation (ADR-019 commit 1).
 */

import { calculateMicronutrient, parseNumber } from './calculation';
import type {
  MicronutrientFieldErrors,
  MicronutrientInput,
  MicronutrientResult,
} from './types';

export interface MicronutrientValidation {
  errors: MicronutrientFieldErrors;
  result: MicronutrientResult | null;
}

export function validateMicronutrientInput(
  input: MicronutrientInput,
): MicronutrientValidation {
  const errors: MicronutrientFieldErrors = {};

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

  return { errors: {}, result: calculateMicronutrient(input) };
}
