/**
 * Stroke Volume validation — UI stub (engine commit wires real checks).
 */

import { calculateStrokeVolume, emptyResult } from './calculation';
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
  const result = calculateStrokeVolume(input);
  const hasAny =
    result.strokeVolumeMl != null ||
    result.bsaM2 != null ||
    result.cardiacIndex != null ||
    result.strokeVolumeIndex != null;
  return {
    isValid: hasAny,
    errors,
    result: hasAny ? result : emptyResult(),
  };
}
