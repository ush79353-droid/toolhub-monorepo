/**
 * INR validation — UI shell (engine commit adds field guards + math).
 */

import { calculateInr } from './calculation';
import type { InrFieldErrors, InrInput, InrResult } from './types';

export interface InrValidation {
  errors: InrFieldErrors;
  result: InrResult | null;
}

export function validateInrInput(input: InrInput): InrValidation {
  return {
    errors: {},
    result: calculateInr(input),
  };
}
