/**
 * Stroke Volume input validation — partial results as dependencies exist.
 */

import {
  calculateStrokeVolume,
  coToLPerMin,
  emptyResult,
  heightToCm,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  StrokeVolumeFieldErrors,
  StrokeVolumeInput,
  StrokeVolumeResult,
} from './types';

export interface StrokeVolumeValidation {
  isValid: boolean;
  errors: StrokeVolumeFieldErrors;
  result: StrokeVolumeResult;
}

export function validateStrokeVolumeInput(
  input: StrokeVolumeInput
): StrokeVolumeValidation {
  const errors: StrokeVolumeFieldErrors = {};

  let coLMin: number | null = null;
  let hrBpm: number | null = null;
  let heightCm: number | null = null;
  let weightKg: number | null = null;

  if (input.cardiacOutput.trim() !== '') {
    const raw = parseNumber(input.cardiacOutput);
    if (raw == null || raw <= 0) {
      errors.cardiacOutput = 'Enter a positive cardiac output.';
    } else {
      const converted = coToLPerMin(raw, input.coUnit);
      if (!(converted > 0)) {
        errors.cardiacOutput = 'Enter a positive cardiac output.';
      } else {
        coLMin = converted;
      }
    }
  }

  if (input.heartRateBpm.trim() !== '') {
    const raw = parseNumber(input.heartRateBpm);
    if (raw == null || raw <= 0) {
      errors.heartRateBpm = 'Enter a positive heart rate.';
    } else {
      hrBpm = raw;
    }
  }

  if (input.heightValue.trim() !== '') {
    const raw = parseNumber(input.heightValue);
    if (raw == null || raw <= 0) {
      errors.heightValue = 'Enter a positive height.';
    } else {
      const cm = heightToCm(raw, input.heightUnit);
      if (!(cm > 0)) {
        errors.heightValue = 'Enter a positive height.';
      } else {
        heightCm = cm;
      }
    }
  }

  if (input.weightValue.trim() !== '') {
    const raw = parseNumber(input.weightValue);
    if (raw == null || raw <= 0) {
      errors.weightValue = 'Enter a positive weight.';
    } else {
      const kg = weightToKg(raw, input.weightUnit);
      if (!(kg > 0)) {
        errors.weightValue = 'Enter a positive weight.';
      } else {
        weightKg = kg;
      }
    }
  }

  const result = calculateStrokeVolume(input, {
    coLMin,
    hrBpm,
    heightCm,
    weightKg,
  });

  const hasAny =
    result.strokeVolumeMl != null ||
    result.bsaM2 != null ||
    result.cardiacIndex != null ||
    result.strokeVolumeIndex != null;

  const hasFieldError = Boolean(
    errors.cardiacOutput ||
      errors.heartRateBpm ||
      errors.heightValue ||
      errors.weightValue
  );

  return {
    isValid: hasAny && !hasFieldError,
    errors,
    result: hasAny || hasFieldError ? result : emptyResult(),
  };
}
