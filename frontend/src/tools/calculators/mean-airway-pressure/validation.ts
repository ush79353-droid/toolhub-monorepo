import {
  calculateMeanAirwayPressure,
  toSeconds,
} from './calculation';
import type {
  MeanAirwayPressureFieldErrors,
  MeanAirwayPressureInput,
  MeanAirwayPressureResult,
} from './types';

export interface MeanAirwayPressureValidation {
  isValid: boolean;
  errors: MeanAirwayPressureFieldErrors;
  result: MeanAirwayPressureResult | null;
}

function finite(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

export function validateMeanAirwayPressureInput(
  input: MeanAirwayPressureInput,
): MeanAirwayPressureValidation {
  const errors: MeanAirwayPressureFieldErrors = {};

  if (input.mode === 'totalCycleTime') {
    if (!finite(input.totalCycleTime)) errors.totalCycleTime = 'Required';
    else if (input.totalCycleTime <= 0)
      errors.totalCycleTime = 'Total cycle time must be greater than 0.';
  } else {
    if (!finite(input.frequency)) errors.frequency = 'Required';
    else if (input.frequency <= 0)
      errors.frequency = 'Frequency must be greater than 0.';
  }

  if (!finite(input.inspiratoryTime)) errors.inspiratoryTime = 'Required';
  else if (input.inspiratoryTime < 0)
    errors.inspiratoryTime = 'Inspiratory time cannot be negative.';

  if (!finite(input.k)) errors.k = 'Required';
  else if (input.k < 0) errors.k = 'K cannot be negative.';

  if (!finite(input.peep)) errors.peep = 'Required';
  if (!finite(input.pip)) errors.pip = 'Required';

  if (
    finite(input.inspiratoryTime) &&
    ((input.mode === 'totalCycleTime' && finite(input.totalCycleTime)) ||
      (input.mode === 'frequency' && finite(input.frequency)))
  ) {
    const tiSec = toSeconds(input.inspiratoryTime, input.timeUnit);
    const ttotSec =
      input.mode === 'frequency'
        ? 60 / (input.frequency as number)
        : toSeconds(input.totalCycleTime as number, input.timeUnit);
    if (ttotSec > 0 && tiSec > ttotSec) {
      errors.inspiratoryTime =
        'Inspiratory time cannot exceed total cycle time (Ti > Ttot).';
    }
  }

  if (
    errors.totalCycleTime ||
    errors.frequency ||
    errors.inspiratoryTime ||
    errors.k ||
    errors.peep ||
    errors.pip
  ) {
    errors.form =
      'Enter timing, k, PEEP, and PIP to calculate mean airway pressure.';
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateMeanAirwayPressure(input),
  };
}
