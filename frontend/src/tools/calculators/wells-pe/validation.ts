import { calculateWellsPe } from './calculation';
import type {
  WellsPeFieldErrors,
  WellsPeInput,
  WellsPeResult,
} from './types';

export interface WellsPeValidation {
  isValid: boolean;
  errors: WellsPeFieldErrors;
  result: WellsPeResult | null;
}

/** All criteria are optional checkboxes — score always available (defaults → 0). */
export function validateWellsPeInput(input: WellsPeInput): WellsPeValidation {
  return {
    isValid: true,
    errors: {},
    result: calculateWellsPe(input),
  };
}
