import { calculateRevisedGeneva } from './calculation';
import type {
  RevisedGenevaFieldErrors,
  RevisedGenevaInput,
  RevisedGenevaResult,
} from './types';

export interface RevisedGenevaValidation {
  isValid: boolean;
  errors: RevisedGenevaFieldErrors;
  result: RevisedGenevaResult | null;
}

/** All controls always selected — score always available (defaults → 0). */
export function validateRevisedGenevaInput(
  input: RevisedGenevaInput,
): RevisedGenevaValidation {
  return {
    isValid: true,
    errors: {},
    result: calculateRevisedGeneva(input),
  };
}
