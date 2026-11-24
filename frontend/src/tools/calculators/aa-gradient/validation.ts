import type {
  AaGradientFieldErrors,
  AaGradientInput,
  AaGradientResult,
} from './types';

export interface AaGradientValidation {
  isValid: boolean;
  errors: AaGradientFieldErrors;
  result: AaGradientResult | null;
}

/** UI-commit stub — replaced by real validation in the engine commit. */
export function validateAaGradientInput(
  _input: AaGradientInput,
): AaGradientValidation {
  return {
    isValid: false,
    errors: {
      form: 'Enter FiO₂, PaCO₂, PaO₂, and atmospheric pressure to see the A–a gradient.',
    },
    result: null,
  };
}
