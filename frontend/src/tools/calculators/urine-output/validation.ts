import { calculateUrineOutput, parseNumber } from './calculation';
import type {
  UrineOutputFieldErrors,
  UrineOutputInput,
  UrineOutputResult,
} from './types';

export interface UrineOutputValidation {
  errors: UrineOutputFieldErrors;
  result: UrineOutputResult | null;
}

export function validateUrineOutputInput(
  input: UrineOutputInput,
): UrineOutputValidation {
  const errors: UrineOutputFieldErrors = {};

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be greater than zero.';
  }

  if (input.timeText.trim() !== '') {
    const t = parseNumber(input.timeText);
    if (t === null) errors.timeText = 'Enter a valid time.';
    else if (!(t > 0)) errors.timeText = 'Time must be greater than zero.';
  }

  if (input.urineText.trim() !== '') {
    const u = parseNumber(input.urineText);
    if (u === null) errors.urineText = 'Enter a valid urine volume.';
    else if (u < 0) errors.urineText = 'Urine volume cannot be negative.';
  }

  if (input.intakeText.trim() !== '') {
    const f = parseNumber(input.intakeText);
    if (f === null) errors.intakeText = 'Enter a valid fluid intake.';
    else if (f < 0) errors.intakeText = 'Fluid intake cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateUrineOutput(input),
  };
}