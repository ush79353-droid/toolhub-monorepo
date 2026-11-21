import type {
  AdderallDosageFieldErrors,
  AdderallDosageInput,
  AdderallDosageResult,
} from './types';

export interface AdderallDosageValidation {
  errors: AdderallDosageFieldErrors;
  result: AdderallDosageResult | null;
}

/** UI-shell stub — replaced by engine commit with label/tablet arithmetic. */
export function validateAdderallDosageInput(
  _input: AdderallDosageInput,
): AdderallDosageValidation {
  return { errors: {}, result: null };
}
