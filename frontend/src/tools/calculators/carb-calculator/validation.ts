import { calculateCarbCalculator, parseNumber } from './calculation';
import type {
  CarbCalculatorFieldErrors,
  CarbCalculatorInput,
  CarbCalculatorResult,
} from './types';

export interface CarbCalculatorValidation {
  errors: CarbCalculatorFieldErrors;
  result: CarbCalculatorResult | null;
}

export function validateCarbCalculatorInput(
  input: CarbCalculatorInput,
): CarbCalculatorValidation {
  const errors: CarbCalculatorFieldErrors = {};

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

  if (input.totalKcalText.trim() !== '') {
    const k = parseNumber(input.totalKcalText);
    if (k === null) errors.totalKcalText = 'Enter valid calories.';
    else if (!(k > 0)) errors.totalKcalText = 'Calories must be positive.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateCarbCalculator(input) };
}