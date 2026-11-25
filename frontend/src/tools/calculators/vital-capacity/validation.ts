import {
  calculateVitalCapacity,
  heightToCm,
  MAX_AGE_YEARS,
  MAX_HEIGHT_CM,
  MIN_AGE_YEARS,
  MIN_HEIGHT_CM,
} from './calculation';
import type {
  VitalCapacityFieldErrors,
  VitalCapacityInput,
  VitalCapacityResult,
} from './types';

export interface VitalCapacityValidation {
  errors: VitalCapacityFieldErrors;
  result: VitalCapacityResult | null;
}

export function validateVitalCapacityInput(
  input: VitalCapacityInput,
): VitalCapacityValidation {
  const errors: VitalCapacityFieldErrors = {};

  if (input.ageYears != null) {
    if (!Number.isFinite(input.ageYears)) {
      errors.ageYears = 'Enter a valid age.';
    } else if (input.ageYears < MIN_AGE_YEARS || input.ageYears > MAX_AGE_YEARS) {
      errors.ageYears = `Age must be between ${MIN_AGE_YEARS} and ${MAX_AGE_YEARS} years.`;
    }
  }

  if (input.height != null) {
    if (!Number.isFinite(input.height)) {
      errors.height = 'Enter a valid height.';
    } else {
      const cm = heightToCm(input.height, input.heightUnit);
      if (cm < MIN_HEIGHT_CM || cm > MAX_HEIGHT_CM) {
        errors.height = `Height must be between ${MIN_HEIGHT_CM} and ${MAX_HEIGHT_CM} cm (or equivalent).`;
      }
    }
  }

  const ready =
    input.ageYears != null &&
    input.height != null &&
    !errors.ageYears &&
    !errors.height;

  if (!ready) {
    if (input.ageYears != null || input.height != null) {
      errors.form = 'Enter age and height to estimate predicted vital capacity.';
    }
    return { errors, result: calculateVitalCapacity(input) };
  }

  return { errors: {}, result: calculateVitalCapacity(input) };
}