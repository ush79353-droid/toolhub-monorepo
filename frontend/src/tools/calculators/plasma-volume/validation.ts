import { calculatePlasmaVolume, parseNumber } from './calculation';
import type {
  PlasmaVolumeFieldErrors,
  PlasmaVolumeInput,
  PlasmaVolumeResult,
} from './types';

export interface PlasmaVolumeValidation {
  errors: PlasmaVolumeFieldErrors;
  result: PlasmaVolumeResult | null;
}

export function validatePlasmaVolumeInput(
  input: PlasmaVolumeInput,
): PlasmaVolumeValidation {
  const errors: PlasmaVolumeFieldErrors = {};

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
  }

  if (input.hematocritText.trim() !== '') {
    const h = parseNumber(input.hematocritText);
    if (h === null) errors.hematocritText = 'Enter a valid hematocrit.';
    else if (h < 0 || h >= 100) {
      errors.hematocritText = 'Hematocrit must be ≥ 0 and < 100%.';
    }
  }

  if (input.heightText.trim() !== '') {
    const ht = parseNumber(input.heightText);
    if (ht === null) errors.heightText = 'Enter a valid height.';
    else if (!(ht > 0)) errors.heightText = 'Height must be positive.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculatePlasmaVolume(input) };
}
