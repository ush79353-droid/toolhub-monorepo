/**
 * TIMI UA/NSTEMI validation — UI stub (engine commit wires real checks).
 */

import { calculateTimiUanstemi, emptyResult } from './calculation';
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
  const result = calculateTimiUanstemi(input);
  const ready = result.formattedScore !== '';
  return {
    isValid: ready,
    errors: {},
    result: ready ? result : emptyResult(),
  };
}
