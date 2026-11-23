import { calculatePaduaScore } from './calculation';
import type { PaduaFieldErrors, PaduaInput, PaduaResult } from './types';

export interface PaduaValidation {
  isValid: boolean;
  errors: PaduaFieldErrors;
  result: PaduaResult | null;
}

/** All factors are booleans; score is always defined (default 0). */
export function validatePaduaInput(input: PaduaInput): PaduaValidation {
  return {
    isValid: true,
    errors: {},
    result: calculatePaduaScore(input),
  };
}
