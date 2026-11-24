import { calculateBloodVolume, parseNumber } from './calculation';
import type {
  BloodVolumeFieldErrors,
  BloodVolumeInput,
  BloodVolumeResult,
} from './types';

export interface BloodVolumeValidation {
  errors: BloodVolumeFieldErrors;
  result: BloodVolumeResult | null;
}

export function validateBloodVolumeInput(
  input: BloodVolumeInput,
): BloodVolumeValidation {
  const errors: BloodVolumeFieldErrors = {};

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be positive.';
  }

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateBloodVolume(input) };
}