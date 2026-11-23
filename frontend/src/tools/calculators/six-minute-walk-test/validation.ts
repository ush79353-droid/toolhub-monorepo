import {
  calculateSixMinuteWalkTest,
  distanceToMeters,
  heightToCm,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  SixMinuteWalkTestFieldErrors,
  SixMinuteWalkTestInput,
  SixMinuteWalkTestResult,
} from './types';

export interface SixMinuteWalkTestValidation {
  isValid: boolean;
  errors: SixMinuteWalkTestFieldErrors;
  result: SixMinuteWalkTestResult | null;
}

/**
 * Predicted 6MWD stays blank until age, height, and weight are valid.
 * Percent of expected needs a valid prediction plus a non-blank observed
 * distance (including zero). Out-of-domain ages suppress prediction.
 */
export function validateSixMinuteWalkTestInput(
  input: SixMinuteWalkTestInput,
): SixMinuteWalkTestValidation {
  const errors: SixMinuteWalkTestFieldErrors = {};

  const ageRaw = input.ageYears.trim();
  const heightRaw = input.heightValue.trim();
  const weightRaw = input.weightValue.trim();
  const observedRaw = input.observedDistance.trim();

  const anthropometryBlank =
    ageRaw === '' && heightRaw === '' && weightRaw === '';

  if (anthropometryBlank) {
    // No prediction yet; still validate observed if typed alone.
    if (observedRaw !== '') {
      const obs = parseNumber(observedRaw);
      if (obs === null || obs < 0) {
        errors.observedDistance = 'Enter a valid non-negative distance.';
        return { isValid: false, errors, result: null };
      }
      const observedMeters = distanceToMeters(obs, input.observedUnit);
      if (observedMeters == null) {
        errors.observedDistance = 'Enter a valid distance.';
        return { isValid: false, errors, result: null };
      }
    }
    return { isValid: false, errors, result: null };
  }

  const age = parseNumber(input.ageYears);
  if (ageRaw === '' || age === null) {
    errors.ageYears = 'Enter age in years.';
  } else if (age < 0 || age > 120) {
    errors.ageYears = 'Enter a realistic age in years.';
  }

  const heightNum = parseNumber(input.heightValue);
  if (heightRaw === '' || heightNum === null) {
    errors.heightValue = 'Enter height.';
  }
  const heightCm =
    heightNum != null ? heightToCm(heightNum, input.heightUnit) : null;
  if (heightRaw !== '' && heightNum != null && heightCm == null) {
    errors.heightValue = 'Enter a positive height.';
  }

  const weightNum = parseNumber(input.weightValue);
  if (weightRaw === '' || weightNum === null) {
    errors.weightValue = 'Enter weight.';
  }
  const weightKg =
    weightNum != null ? weightToKg(weightNum, input.weightUnit) : null;
  if (weightRaw !== '' && weightNum != null && weightKg == null) {
    errors.weightValue = 'Enter a positive weight.';
  }

  let observedMeters: number | null = null;
  if (observedRaw !== '') {
    const obs = parseNumber(observedRaw);
    if (obs === null || obs < 0) {
      errors.observedDistance = 'Enter a valid non-negative distance.';
    } else {
      observedMeters = distanceToMeters(obs, input.observedUnit);
      if (observedMeters == null) {
        errors.observedDistance = 'Enter a valid distance.';
      }
    }
  }

  if (
    errors.ageYears ||
    errors.heightValue ||
    errors.weightValue ||
    errors.observedDistance
  ) {
    return { isValid: false, errors, result: null };
  }

  if (age == null || heightCm == null || weightKg == null) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateSixMinuteWalkTest(
    input,
    age,
    heightCm,
    weightKg,
    observedMeters,
  );

  // Domain suppression is a valid educational outcome (blank prediction).
  return {
    isValid: result.domainOk,
    errors,
    result,
  };
}
