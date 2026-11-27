import {
  calculateHealthyWeight,
  heightInputToMeters,
  parseNumber,
} from './calculation';
import type {
  HealthyWeightFieldErrors,
  HealthyWeightInput,
  HealthyWeightResult,
} from './types';

export interface HealthyWeightValidation {
  errors: HealthyWeightFieldErrors;
  result: HealthyWeightResult | null;
}

export function validateHealthyWeightInput(
  input: HealthyWeightInput,
  opts: { requireComplete?: boolean } = {},
): HealthyWeightValidation {
  const errors: HealthyWeightFieldErrors = {};
  const requireComplete = opts.requireComplete ?? false;

  if (input.unitSystem === 'metric') {
    const filled = input.heightCm.trim() !== '';
    if (filled || requireComplete) {
      const cm = parseNumber(input.heightCm);
      if (cm === null) errors.height = 'Enter a valid height in cm.';
      else if (!(cm > 0)) errors.height = 'Height must be greater than zero.';
      else if (cm < 50 || cm > 300)
        errors.height = 'Enter an adult height between 50 and 300 cm.';
    }
  } else {
    const any =
      input.heightFt.trim() !== '' || input.heightIn.trim() !== '';
    if (any || requireComplete) {
      const ft = parseNumber(input.heightFt);
      const inches = parseNumber(input.heightIn);
      if (
        (input.heightFt.trim() !== '' && ft === null) ||
        (input.heightIn.trim() !== '' && inches === null)
      ) {
        errors.height = 'Enter a valid height in feet and inches.';
      } else {
        const f = ft ?? 0;
        const i = inches ?? 0;
        if (!(f >= 0) || !(i >= 0) || (f === 0 && i === 0 && requireComplete)) {
          errors.height = 'Enter a height greater than zero.';
        } else if (i >= 12) {
          errors.height = 'Inches must be less than 12.';
        } else {
          const m = heightInputToMeters(input);
          if (m === null || !(m > 0))
            errors.height = 'Enter a height greater than zero.';
          else if (m < 0.5 || m > 3)
            errors.height = 'Enter an adult height in a plausible range.';
        }
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  if (!requireComplete && heightInputToMeters(input) === null) {
    return { errors: {}, result: null };
  }

  return {
    errors: {},
    result: calculateHealthyWeight(input),
  };
}
