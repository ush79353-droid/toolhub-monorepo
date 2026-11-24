import {
  calculateFreshFrozenPlasmaDose,
  parseNumber,
} from './calculation';
import type {
  FreshFrozenPlasmaDoseFieldErrors,
  FreshFrozenPlasmaDoseInput,
  FreshFrozenPlasmaDoseResult,
} from './types';

export interface FreshFrozenPlasmaDoseValidation {
  errors: FreshFrozenPlasmaDoseFieldErrors;
  result: FreshFrozenPlasmaDoseResult | null;
}

export function validateFreshFrozenPlasmaDoseInput(
  input: FreshFrozenPlasmaDoseInput,
): FreshFrozenPlasmaDoseValidation {
  const errors: FreshFrozenPlasmaDoseFieldErrors = {};

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
  }

  if (input.unitVolumeText.trim() !== '') {
    const v = parseNumber(input.unitVolumeText);
    if (v === null) errors.unitVolumeText = 'Enter a valid unit volume.';
    else if (!(v > 0)) {
      errors.unitVolumeText =
        'Unit volume must be greater than zero.';
    }
  } else {
    errors.unitVolumeText = 'Unit volume is required.';
  }

  if (input.doseMlPerKgText.trim() !== '') {
    const d = parseNumber(input.doseMlPerKgText);
    if (d === null) errors.doseMlPerKgText = 'Enter a valid dose.';
    else if (!(d > 0)) errors.doseMlPerKgText = 'Dose must be positive.';
  } else {
    errors.doseMlPerKgText = 'Dose (mL/kg) is required.';
  }

  const hasBlockingNumericError =
    Boolean(errors.weightText) ||
    Boolean(errors.unitVolumeText && input.unitVolumeText.trim() !== '') ||
    Boolean(errors.doseMlPerKgText && input.doseMlPerKgText.trim() !== '');

  if (hasBlockingNumericError) {
    return { errors, result: null };
  }

  return { errors, result: calculateFreshFrozenPlasmaDose(input) };
}
