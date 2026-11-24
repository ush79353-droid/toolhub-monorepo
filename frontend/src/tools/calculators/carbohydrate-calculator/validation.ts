import { calculateCarbohydrateCalculator, parseNumber } from './calculation';
import type {
  CarbohydrateCalculatorFieldErrors,
  CarbohydrateCalculatorInput,
  CarbohydrateCalculatorResult,
} from './types';

export interface CarbohydrateCalculatorValidation {
  errors: CarbohydrateCalculatorFieldErrors;
  isValid: boolean;
  result: CarbohydrateCalculatorResult | null;
}

export function validateCarbohydrateCalculatorInput(
  input: CarbohydrateCalculatorInput,
): CarbohydrateCalculatorValidation {
  const errors: CarbohydrateCalculatorFieldErrors = {};

  if (input.isSubmitted) {
    const age = parseNumber(input.ageYearsText);
    if (age === null) errors.ageYearsText = 'Enter a valid age.';
    else if (!(age >= 18 && age <= 80)) errors.ageYearsText = 'Age must be 18–80 years.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, isValid: false, result: null };
  }

  const result = calculateCarbohydrateCalculator(input);
  const hasNumbers =
    input.isSubmitted && result.maintenanceKcalPerDay != null && result.carbRows.length > 0;

  return {
    errors: {},
    isValid: hasNumbers,
    result,
  };
}