import { calculateBodeIndex } from './calculation';
import type { BodeIndexFieldErrors, BodeIndexInput, BodeIndexResult } from './types';

export interface BodeIndexValidation {
  errors: BodeIndexFieldErrors;
  result: BodeIndexResult | null;
}

export function validateBodeIndexInput(input: BodeIndexInput): BodeIndexValidation {
  return { errors: {}, result: calculateBodeIndex(input) };
}
