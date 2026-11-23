import { calculateBeeCalculator, parseNumber } from './calculation';
import type {
  BeeCalculatorFieldErrors,
  BeeCalculatorInput,
  BeeCalculatorResult,
} from './types';

export interface BeeCalculatorValidation {
  errors: BeeCalculatorFieldErrors;
  result: BeeCalculatorResult | null;
}

export function validateBeeCalculatorInput(
  input: BeeCalculatorInput,
): BeeCalculatorValidation {
  const errors: BeeCalculatorFieldErrors = {};

  if (input.ageYearsText.trim() !== '') {
    const age = parseNumber(input.ageYearsText);
    if (age === null) errors.ageYearsText = 'Enter a valid age.';
    else if (!(age >= 15 && age <= 100)) errors.ageYearsText = 'Age must be 15–100 years.';
  }

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

  return { errors: {}, result: calculateBeeCalculator(input) };
}