import { calculateFev1Fvc } from './calculation';
import type {
  Fev1FvcFieldErrors,
  Fev1FvcInput,
  Fev1FvcResult,
} from './types';

export interface Fev1FvcValidation {
  isValid: boolean;
  errors: Fev1FvcFieldErrors;
  result: Fev1FvcResult | null;
}

function finite(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

export function validateFev1FvcInput(input: Fev1FvcInput): Fev1FvcValidation {
  const errors: Fev1FvcFieldErrors = {};

  if (input.mode === 'real') {
    if (!finite(input.fev1)) errors.fev1 = 'Required';
    else if (input.fev1 < 0) errors.fev1 = 'FEV1 cannot be negative.';

    if (!finite(input.fvc)) errors.fvc = 'Required';
    else if (input.fvc <= 0) errors.fvc = 'FVC must be greater than 0.';

    if (
      finite(input.fev1) &&
      finite(input.fvc) &&
      input.fvc > 0 &&
      input.fev1 > input.fvc
    ) {
      errors.form = 'FEV1 cannot exceed FVC for a valid ratio.';
    }

    if (errors.fev1 || errors.fvc || errors.form) {
      if (!errors.form) {
        errors.form = 'Enter FEV1 and FVC in matching units to calculate the ratio.';
      }
      return { isValid: false, errors, result: null };
    }

    return { isValid: true, errors: {}, result: calculateFev1Fvc(input) };
  }

  if (!finite(input.ageYears)) errors.ageYears = 'Required';
  else if (input.ageYears < 8 || input.ageYears > 95) {
    errors.ageYears = 'Age must be between 8 and 95 years for these equations.';
  }

  if (input.study === 'european2004') {
    if (!finite(input.heightCm)) errors.heightCm = 'Required';
    else if (input.heightCm < 100 || input.heightCm > 250) {
      errors.heightCm = 'Height must be between 100 and 250 cm.';
    }
  }

  if (errors.ageYears || errors.heightCm) {
    errors.form =
      input.study === 'american1999'
        ? 'Enter sex, age, and ethnicity for the Hankinson predicted ratio.'
        : 'Enter sex, age, and height for the Falaschetti predicted ratio.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result: calculateFev1Fvc(input) };
}
