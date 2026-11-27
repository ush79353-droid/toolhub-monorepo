import { calculateCiwa } from './calculation';
import type {
  CiwaFieldErrors,
  CiwaInput,
  CiwaItemId,
  CiwaResult,
} from './types';
import { CIWA_ITEMS } from './types';

export interface CiwaValidation {
  isValid: boolean;
  errors: CiwaFieldErrors;
  result: CiwaResult | null;
}

export function validateCiwaInput(input: CiwaInput): CiwaValidation {
  const errors: CiwaFieldErrors = {};

  for (const item of CIWA_ITEMS) {
    const v = input[item.id];
    if (v == null) continue; // Not assessed — allowed; result marked incomplete
    if (!Number.isInteger(v) || v < 0 || v > item.max) {
      errors[item.id as CiwaItemId] =
        `Choose a score from 0 to ${item.max}, or Not assessed.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateCiwa(input),
  };
}
