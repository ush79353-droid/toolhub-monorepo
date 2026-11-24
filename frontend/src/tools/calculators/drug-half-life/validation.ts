/**
 * Drug half-life — pure input validation (ADR-018).
 */

import { calculateDrugHalfLife, parsePositiveNumber } from './calculation';
import type {
  DrugHalfLifeFieldErrors,
  DrugHalfLifeInput,
  DrugHalfLifeResult,
} from './types';

export interface DrugHalfLifeValidation {
  errors: DrugHalfLifeFieldErrors;
  result: DrugHalfLifeResult | null;
}

export function validateDrugHalfLifeInput(
  input: DrugHalfLifeInput,
): DrugHalfLifeValidation {
  const errors: DrugHalfLifeFieldErrors = {};

  if (input.halfLifeText.trim() !== '') {
    const h = parsePositiveNumber(input.halfLifeText);
    if (h === null) {
      errors.halfLifeText = 'Enter a valid half-life.';
    } else if (!(h > 0)) {
      errors.halfLifeText = 'Half-life must be greater than zero.';
    }
  }

  if (input.dosageText.trim() !== '') {
    const d = parsePositiveNumber(input.dosageText);
    if (d === null) {
      errors.dosageText = 'Enter a valid dosage.';
    } else if (!(d > 0)) {
      errors.dosageText = 'Dosage must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: calculateDrugHalfLife(input) };
  }

  return { errors: {}, result: calculateDrugHalfLife(input) };
}
