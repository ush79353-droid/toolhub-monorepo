/**
 * TIMI UA/NSTEMI validation — binary Yes/No factors always form a valid score.
 */

import { calculateTimiUanstemi } from './calculation';
import type {
  TimiUanstemiFieldErrors,
  TimiUanstemiInput,
  TimiUanstemiResult,
} from './types';

export interface TimiUanstemiValidation {
  isValid: boolean;
  errors: TimiUanstemiFieldErrors;
  result: TimiUanstemiResult;
}

export function validateTimiUanstemiInput(
  input: TimiUanstemiInput,
): TimiUanstemiValidation {
  return {
    isValid: true,
    errors: {},
    result: calculateTimiUanstemi(input),
  };
}
