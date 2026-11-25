import { calculatePfRatio, toFraction } from './calculation';
import type {
  PfRatioFieldErrors,
  PfRatioInput,
  PfRatioResult,
} from './types';

export interface PfRatioValidation {
  isValid: boolean;
  errors: PfRatioFieldErrors;
  result: PfRatioResult | null;
}

function finite(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

export function validatePfRatioInput(input: PfRatioInput): PfRatioValidation {
  const errors: PfRatioFieldErrors = {};

  if (!finite(input.pao2)) errors.pao2 = 'Required';
  else if (input.pao2 < 0) errors.pao2 = 'PaO₂ cannot be negative.';

  if (!finite(input.fio2)) errors.fio2 = 'Required';
  else {
    const frac = toFraction(input.fio2, input.fio2Unit);
    if (frac <= 0) errors.fio2 = 'FiO₂ must be greater than 0 (zero denominator).';
    else if (frac > 1) errors.fio2 = 'FiO₂ cannot exceed 100% (fraction 1.0).';
  }

  if (errors.pao2 || errors.fio2) {
    errors.form = 'Enter PaO₂ and FiO₂ to calculate the PaO₂/FiO₂ ratio.';
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculatePfRatio(input),
  };
}
