import type {
  CaresActUnemploymentBenefitFieldErrors,
  CaresActUnemploymentBenefitInput,
  CaresActUnemploymentBenefitResult,
} from './types';

export interface CaresActUnemploymentBenefitValidation {
  isValid: boolean;
  errors: CaresActUnemploymentBenefitFieldErrors;
  result: CaresActUnemploymentBenefitResult | null;
}

/** UI commit placeholder — always-valid notice validation lands in the guidance commit. */
export function validateCaresActUnemploymentBenefitInput(
  _input: CaresActUnemploymentBenefitInput
): CaresActUnemploymentBenefitValidation {
  return { isValid: false, errors: {}, result: null };
}
