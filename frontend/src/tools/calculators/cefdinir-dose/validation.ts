import { calculateCefdinirDose, parseWeightKg } from './calculation';
import { indicationValidForAgeGroup } from './types';
import type {
  CefdinirAgeGroup,
  CefdinirDoseFieldErrors,
  CefdinirDoseInput,
  CefdinirDoseResult,
  CefdinirIndicationId,
} from './types';

export interface CefdinirDoseValidation {
  errors: CefdinirDoseFieldErrors;
  result: CefdinirDoseResult | null;
}

export function validateCefdinirDoseInput(
  input: CefdinirDoseInput,
): CefdinirDoseValidation {
  const errors: CefdinirDoseFieldErrors = {};

  if (!input.ageGroup) {
    errors.ageGroup = 'Select a patient age group.';
  }

  if (input.ageGroup && !input.indication) {
    errors.indication = 'Select an indication.';
  }

  if (
    input.ageGroup &&
    input.indication &&
    !indicationValidForAgeGroup(
      input.ageGroup as CefdinirAgeGroup,
      input.indication as CefdinirIndicationId,
    )
  ) {
    errors.indication =
      'This indication is not FDA-labeled for the selected age group.';
  }

  if (input.ageGroup === 'pediatric' && input.indication) {
    if (input.weightKgText.trim() === '') {
      errors.weightKgText = 'Enter weight in kg for pediatric dosing.';
    } else {
      const w = parseWeightKg(input.weightKgText);
      if (w === null) errors.weightKgText = 'Enter a valid weight.';
      else if (w <= 0) errors.weightKgText = 'Weight must be positive.';
    }
  }

  return {
    errors,
    result: calculateCefdinirDose(input),
  };
}