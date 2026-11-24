import type { DriFieldErrors, DriInput, DriResult } from './types';

export interface DriValidation {
  errors: DriFieldErrors;
  result: DriResult | null;
}

/** UI-phase stub — replaced by the engine commit with pure calculation wiring. */
export function validateDriInput(_input: DriInput): DriValidation {
  return { errors: {}, result: null };
}
