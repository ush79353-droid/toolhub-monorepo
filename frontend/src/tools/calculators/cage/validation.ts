import { calculateCage } from './calculation';
import type { CageFieldErrors, CageInput, CageResult } from './types';

export interface CageValidation {
  errors: CageFieldErrors;
  result: CageResult | null;
}

export function validateCageInput(input: CageInput): CageValidation {
  return { errors: {}, result: calculateCage(input) };
}
