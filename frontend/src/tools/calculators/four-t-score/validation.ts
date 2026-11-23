import { calculateFourTScore } from './calculation';
import type {
  FourTScoreFieldErrors,
  FourTScoreInput,
  FourTScoreResult,
} from './types';

export interface FourTScoreValidation {
  isValid: boolean;
  errors: FourTScoreFieldErrors;
  result: FourTScoreResult | null;
}

/** All fields always selected — score always available from defaults. */
export function validateFourTScoreInput(
  input: FourTScoreInput,
): FourTScoreValidation {
  return {
    isValid: true,
    errors: {},
    result: calculateFourTScore(input),
  };
}