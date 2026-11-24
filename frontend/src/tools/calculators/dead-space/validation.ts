import { calculateDeadSpace } from './calculation';
import type {
  DeadSpaceFieldErrors,
  DeadSpaceInput,
  DeadSpaceResult,
} from './types';

export interface DeadSpaceValidation {
  isValid: boolean;
  errors: DeadSpaceFieldErrors;
  result: DeadSpaceResult | null;
}

function finite(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

export function validateDeadSpaceInput(
  input: DeadSpaceInput,
): DeadSpaceValidation {
  const errors: DeadSpaceFieldErrors = {};
  if (!finite(input.alveolarCo2)) errors.alveolarCo2 = 'Required';
  else if (input.alveolarCo2 <= 0)
    errors.alveolarCo2 = 'PACO₂ must be greater than 0 (zero denominator).';

  if (!finite(input.exhaledCo2)) errors.exhaledCo2 = 'Required';
  else if (input.exhaledCo2 < 0) errors.exhaledCo2 = 'PECO₂ cannot be negative.';

  if (!finite(input.tidalVolume)) errors.tidalVolume = 'Required';
  else if (input.tidalVolume <= 0)
    errors.tidalVolume = 'Tidal volume must be greater than 0.';

  if (
    finite(input.alveolarCo2) &&
    finite(input.exhaledCo2) &&
    input.exhaledCo2 > input.alveolarCo2
  ) {
    errors.form = 'PECO₂ cannot exceed PACO₂ for a valid Bohr fraction.';
  }

  if (
    errors.alveolarCo2 ||
    errors.exhaledCo2 ||
    errors.tidalVolume ||
    errors.form
  ) {
    if (!errors.form) {
      errors.form =
        'Enter alveolar CO₂, mixed-expired CO₂, and tidal volume to calculate dead space.';
    }
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateDeadSpace(input),
  };
}
