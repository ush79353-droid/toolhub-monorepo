/**
 * Drug half-life validation — UI stub (ADR-019 commit 1).
 */

import { calculateDrugHalfLife } from './calculation';
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
  return {
    errors: {},
    result: calculateDrugHalfLife(input),
  };
}
