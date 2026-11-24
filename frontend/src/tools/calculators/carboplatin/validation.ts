import { calculateCarboplatin, parseNumber } from './calculation';
import type {
  CarboplatinFieldErrors,
  CarboplatinInput,
  CarboplatinResult,
} from './types';

export interface CarboplatinValidation {
  errors: CarboplatinFieldErrors;
  result: CarboplatinResult | null;
}

export function validateCarboplatinInput(
  input: CarboplatinInput,
): CarboplatinValidation {
  const errors: CarboplatinFieldErrors = {};

  if (input.ageYearsText.trim() !== '') {
    const age = parseNumber(input.ageYearsText);
    if (age === null) errors.ageYearsText = 'Enter a valid age.';
    else if (!(age > 0 && age <= 120)) errors.ageYearsText = 'Age must be 1–120 years.';
  }

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
  }

  if (input.scrMgDlText.trim() !== '') {
    const s = parseNumber(input.scrMgDlText);
    if (s === null) errors.scrMgDlText = 'Enter valid creatinine.';
    else if (!(s > 0)) errors.scrMgDlText = 'Creatinine must be positive.';
  }

  if (input.targetAucText.trim() !== '') {
    const a = parseNumber(input.targetAucText);
    if (a === null) errors.targetAucText = 'Enter valid target AUC.';
    else if (!(a > 0)) errors.targetAucText = 'Target AUC must be positive.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateCarboplatin(input) };
}