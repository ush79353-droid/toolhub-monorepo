import type {
  RefinanceFieldErrors,
  RefinanceInput,
  RefinanceResult,
} from './types';

export interface RefinanceValidation {
  isValid: boolean;
  errors: RefinanceFieldErrors;
  result: RefinanceResult | null;
}

/** UI-phase stub — replaced in the engine commit. */
export function validateRefinanceInput(
  _input: RefinanceInput
): RefinanceValidation {
  return { isValid: false, errors: {}, result: null };
}
