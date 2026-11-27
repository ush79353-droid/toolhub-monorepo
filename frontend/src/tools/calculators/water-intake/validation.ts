import { calculateWaterIntake, parseNumber } from './calculation';
import type {
  WaterIntakeFieldErrors,
  WaterIntakeInput,
  WaterIntakeResult,
} from './types';

export interface WaterIntakeValidation {
  errors: WaterIntakeFieldErrors;
  result: WaterIntakeResult | null;
}

export function validateWaterIntakeInput(
  input: WaterIntakeInput,
): WaterIntakeValidation {
  const errors: WaterIntakeFieldErrors = {};

  if (input.mode === 'child' && input.ageText.trim() !== '') {
    const age = parseNumber(input.ageText);
    if (age === null) errors.ageText = 'Enter a valid age.';
    else if (!(age >= 0)) errors.ageText = 'Age must be zero or greater.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateWaterIntake(input) };
}
