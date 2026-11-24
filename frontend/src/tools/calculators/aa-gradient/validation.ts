import { calculateAaGradient, R_QUOTIENT } from './calculation';
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

function isFiniteNumber(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

export function validateAaGradientInput(
  input: AaGradientInput,
): AaGradientValidation {
  const errors: AaGradientFieldErrors = {};

  if (input.ageYears != null) {
    if (!Number.isFinite(input.ageYears) || input.ageYears < 0 || input.ageYears > 120) {
      errors.ageYears = 'Enter age 0–120 years, or leave blank.';
    }
  }

  if (!isFiniteNumber(input.fio2Percent)) {
    errors.fio2Percent = 'Required';
  } else if (input.fio2Percent <= 0 || input.fio2Percent > 100) {
    errors.fio2Percent = 'FiO₂ must be greater than 0 and at most 100%.';
  }

  if (!isFiniteNumber(input.paco2)) {
    errors.paco2 = 'Required';
  } else if (input.paco2 < 0) {
    errors.paco2 = 'PaCO₂ cannot be negative.';
  }

  if (!isFiniteNumber(input.pao2)) {
    errors.pao2 = 'Required';
  } else if (input.pao2 < 0) {
    errors.pao2 = 'PaO₂ cannot be negative.';
  }

  if (!isFiniteNumber(input.atmPressure)) {
    errors.atmPressure = 'Required';
  } else if (input.atmPressure <= 0) {
    errors.atmPressure = 'Atmospheric pressure must be greater than 0.';
  }

  // Guard zero R (constant) and impossible inspired dry pressure.
  if (R_QUOTIENT === 0) {
    errors.form = 'Respiratory quotient R is invalid.';
  }

  const blocking =
    errors.fio2Percent ||
    errors.paco2 ||
    errors.pao2 ||
    errors.atmPressure ||
    errors.form;

  if (blocking) {
    if (!errors.form) {
      errors.form =
        'Enter FiO₂, PaCO₂, PaO₂, and atmospheric pressure to see the A–a gradient.';
    }
    return { isValid: false, errors, result: null };
  }

  if (errors.ageYears) {
    // Age invalid but gases OK — still compute gradient without expected.
    const cleaned: AaGradientInput = { ...input, ageYears: null };
    return {
      isValid: false,
      errors,
      result: calculateAaGradient(cleaned),
    };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateAaGradient(input),
  };
}
