import { calculateCorrectedMagnesium, parseNumber } from './calculation';
import type {
  CorrectedMagnesiumFieldErrors,
  CorrectedMagnesiumInput,
  CorrectedMagnesiumResult,
} from './types';

export interface CorrectedMagnesiumValidation {
  errors: CorrectedMagnesiumFieldErrors;
  result: CorrectedMagnesiumResult | null;
}

export function validateCorrectedMagnesiumInput(
  input: CorrectedMagnesiumInput,
): CorrectedMagnesiumValidation {
  const errors: CorrectedMagnesiumFieldErrors = {};

  if (input.magnesiumText.trim() !== '') {
    const m = parseNumber(input.magnesiumText);
    if (m === null) errors.magnesiumText = 'Enter a valid magnesium value.';
    else if (!(m > 0))
      errors.magnesiumText = 'Magnesium must be greater than zero.';
  }

  if (input.albuminText.trim() !== '') {
    const a = parseNumber(input.albuminText);
    if (a === null) errors.albuminText = 'Enter a valid albumin value.';
    else if (!(a > 0)) errors.albuminText = 'Albumin must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateCorrectedMagnesium(input),
  };
}
