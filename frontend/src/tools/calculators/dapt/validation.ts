import { calculateDaptScore } from './calculation';
import type { DaptFieldErrors, DaptInput, DaptResult } from './types';

export interface DaptValidation {
  isValid: boolean;
  errors: DaptFieldErrors;
  result: DaptResult | null;
}

/**
 * Age radio always selected; checkboxes are boolean. Score is always defined.
 */
export function validateDaptInput(input: DaptInput): DaptValidation {
  if (
    input.ageBand !== 'under65' &&
    input.ageBand !== 'age65to74' &&
    input.ageBand !== 'age75plus'
  ) {
    return {
      isValid: false,
      errors: { form: 'Select an age band.' },
      result: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateDaptScore(input),
  };
}
