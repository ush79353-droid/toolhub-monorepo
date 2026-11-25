import { calculatePeakFlow } from './calculation';
import type {
  PeakFlowFieldErrors,
  PeakFlowInput,
  PeakFlowResult,
} from './types';

export interface PeakFlowValidation {
  isValid: boolean;
  errors: PeakFlowFieldErrors;
  result: PeakFlowResult | null;
}

function finite(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

export function validatePeakFlowInput(
  input: PeakFlowInput,
): PeakFlowValidation {
  const errors: PeakFlowFieldErrors = {};

  if (!finite(input.ageYears)) errors.ageYears = 'Required';
  else if (input.ageYears < 8 || input.ageYears > 85)
    errors.ageYears = 'Age must be between 8 and 85 years.';

  if (!finite(input.height)) errors.height = 'Required';
  else if (input.height <= 0) errors.height = 'Height must be greater than 0.';

  if (finite(input.measuredPef) && input.measuredPef < 0)
    errors.measuredPef = 'Measured PEF cannot be negative.';
  if (finite(input.personalBest) && input.personalBest <= 0)
    errors.personalBest = 'Personal best must be greater than 0.';
  if (finite(input.pefMax) && input.pefMax < 0)
    errors.pefMax = 'PEF maximum cannot be negative.';
  if (finite(input.pefMin) && input.pefMin < 0)
    errors.pefMin = 'PEF minimum cannot be negative.';

  if (
    finite(input.pefMax) &&
    finite(input.pefMin) &&
    input.pefMin > input.pefMax
  ) {
    errors.form = 'PEF minimum cannot exceed PEF maximum.';
  }

  if (
    input.ethnicity === 'other' &&
    finite(input.ageYears) &&
    (input.ageYears < 15 || input.ageYears > 85)
  ) {
    errors.ageYears =
      'Nunn & Gregg (“Other”) equations apply to ages 15–85 years.';
  }

  if (
    input.ethnicity !== 'other' &&
    finite(input.ageYears) &&
    (input.ageYears < 8 || input.ageYears > 80)
  ) {
    errors.ageYears = 'Hankinson NHANES III equations apply to ages 8–80 years.';
  }

  if (errors.ageYears || errors.height || errors.form) {
    if (!errors.form) {
      errors.form =
        'Enter age and height to estimate predicted peak expiratory flow.';
    }
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {
      measuredPef: errors.measuredPef,
      personalBest: errors.personalBest,
      pefMax: errors.pefMax,
      pefMin: errors.pefMin,
    },
    result: calculatePeakFlow(input),
  };
}
