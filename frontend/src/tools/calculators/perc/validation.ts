import { calculatePerc } from './calculation';
import type { PercFieldErrors, PercInput, PercResult } from './types';

export interface PercValidation {
  isValid: boolean;
  errors: PercFieldErrors;
  result: PercResult;
}

export function validatePercInput(input: PercInput): PercValidation {
  return {
    isValid: true,
    errors: {},
    result: calculatePerc(input),
  };
}