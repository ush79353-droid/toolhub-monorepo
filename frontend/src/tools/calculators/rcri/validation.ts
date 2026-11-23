import { calculateRcri } from './calculation';
import type { RcriFieldErrors, RcriInput, RcriResult } from './types';

export interface RcriValidation {
  isValid: boolean;
  errors: RcriFieldErrors;
  result: RcriResult | null;
}

/** Radios always selected; result always available. */
export function validateRcriInput(input: RcriInput): RcriValidation {
  return {
    isValid: true,
    errors: {},
    result: calculateRcri(input),
  };
}
