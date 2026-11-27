import { calculateParkland, parseNumber } from './calculation';
import type {
  ParklandFieldErrors,
  ParklandInput,
  ParklandResult,
} from './types';

export interface ParklandValidation {
  errors: ParklandFieldErrors;
  result: ParklandResult | null;
}

export function validateParklandInput(input: ParklandInput): ParklandValidation {
  const errors: ParklandFieldErrors = {};
  const raw = input.weightText.trim();
  if (raw !== '') {
    const n = parseNumber(input.weightText);
    if (n === null) {
      errors.weightText = 'Enter a valid number.';
    } else if (!(n > 0)) {
      errors.weightText = 'Weight must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }
  return { errors: {}, result: calculateParkland(input) };
}

export function hasFieldErrors(errors: ParklandFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
