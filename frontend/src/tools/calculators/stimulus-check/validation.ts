import type {
  StimulusCheckFieldErrors,
  StimulusCheckInput,
  StimulusCheckResult,
} from './types';

export interface StimulusCheckValidation {
  isValid: boolean;
  errors: StimulusCheckFieldErrors;
  result: StimulusCheckResult | null;
}

/** UI shell stub — replaced by verified EIP1 validation in the engine commit. */
export function validateStimulusCheckInput(
  _input: StimulusCheckInput
): StimulusCheckValidation {
  return { isValid: false, errors: {}, result: null };
}
