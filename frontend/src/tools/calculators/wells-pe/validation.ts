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

/** Checkbox form always valid; UI stub result until engine commit. */
export function validateWellsPeInput(input: WellsPeInput): WellsPeValidation {
  return {
    isValid: true,
    errors: {},
    result: calculateWellsPe(input),
  };
}
