import { calculateTpaStroke, parseNumber } from './calculation';
import type {
  TpaStrokeFieldErrors,
  TpaStrokeInput,
  TpaStrokeResult,
} from './types';

export interface TpaStrokeValidation {
  errors: TpaStrokeFieldErrors;
  result: TpaStrokeResult | null;
}

export function validateTpaStrokeInput(
  input: TpaStrokeInput,
): TpaStrokeValidation {
  const errors: TpaStrokeFieldErrors = {};
  const trimmed = input.weightText.trim();

  if (trimmed !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) {
      errors.weightText = 'Enter a valid weight.';
    } else if (!(w > 0)) {
      errors.weightText = 'Weight must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      result: calculateTpaStroke({ ...input, weightText: '' }),
    };
  }

  try {
    return {
      errors,
      result: calculateTpaStroke(input),
    };
  } catch {
    errors.weightText = 'Weight must be greater than zero.';
    return {
      errors,
      result: calculateTpaStroke({ ...input, weightText: '' }),
    };
  }
}
