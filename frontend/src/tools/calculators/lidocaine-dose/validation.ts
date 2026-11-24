import { calculateLidocaineDose, parseNumber } from './calculation';
import type {
  LidocaineDoseFieldErrors,
  LidocaineDoseInput,
  LidocaineDoseResult,
} from './types';

export interface LidocaineDoseValidation {
  errors: LidocaineDoseFieldErrors;
  result: LidocaineDoseResult | null;
}

export function validateLidocaineDoseInput(
  input: LidocaineDoseInput,
): LidocaineDoseValidation {
  const errors: LidocaineDoseFieldErrors = {};
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
      result: calculateLidocaineDose({ ...input, weightText: '' }),
    };
  }

  try {
    return {
      errors,
      result: calculateLidocaineDose(input),
    };
  } catch {
    errors.weightText = 'Weight must be greater than zero.';
    return {
      errors,
      result: calculateLidocaineDose({ ...input, weightText: '' }),
    };
  }
}
