import { calculateKeto } from './calculation';
import type { KetoFieldErrors, KetoInput, KetoResult } from './types';

export interface KetoValidation {
  isValid: boolean;
  errors: KetoFieldErrors;
  result: KetoResult | null;
}

/** UI commit stub — engine commit adds field checks + live calculateKeto. */
export function validateKetoInput(input: KetoInput): KetoValidation {
  const result = calculateKeto(input);
  if (!result) {
    return { isValid: false, errors: {}, result: null };
  }
  return { isValid: true, errors: {}, result };
}
