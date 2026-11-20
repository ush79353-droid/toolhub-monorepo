import type {
  CanadaGstQstFieldErrors,
  CanadaGstQstInput,
  CanadaGstQstResult,
} from './types';

export interface CanadaGstQstValidation {
  isValid: boolean;
  errors: CanadaGstQstFieldErrors;
  result: CanadaGstQstResult | null;
}

/** UI-shell stub — replaced in the engine commit. */
export function validateCanadaGstQstInput(
  _input: CanadaGstQstInput
): CanadaGstQstValidation {
  return { isValid: false, errors: {}, result: null };
}
