import { calculateHasBled } from './calculation';
import type { HasBledFieldErrors, HasBledInput, HasBledResult } from './types';

export interface HasBledValidation {
  isValid: boolean;
  errors: HasBledFieldErrors;
  result: HasBledResult | null;
}

/** Radios always selected — score always available (defaults all No → 0). */
export function validateHasBledInput(input: HasBledInput): HasBledValidation {
  return {
    isValid: true,
    errors: {},
    result: calculateHasBled(input),
  };
}
