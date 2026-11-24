import { calculateGfrEstimated, parseNumber } from './calculation';
import type {
  GfrEstimatedFieldErrors,
  GfrEstimatedInput,
  GfrEstimatedResult,
} from './types';

export interface GfrEstimatedValidation {
  errors: GfrEstimatedFieldErrors;
  result: GfrEstimatedResult | null;
}

export function validateGfrEstimatedInput(
  input: GfrEstimatedInput,
): GfrEstimatedValidation {
  const errors: GfrEstimatedFieldErrors = {};

  if (input.ageYearsText.trim() !== '') {
    const age = parseNumber(input.ageYearsText);
    if (age === null) errors.ageYearsText = 'Enter a valid age in years.';
    else if (age < 18 || age > 120)
      errors.ageYearsText = 'Adult equations require age 18–120 years.';
  }

  const needsCreatinine =
    input.markerMode === 'creatinine' || input.markerMode === 'both';
  const needsCystatin =
    input.markerMode === 'cystatin' || input.markerMode === 'both';

  if (needsCreatinine && input.creatinineText.trim() !== '') {
    const c = parseNumber(input.creatinineText);
    if (c === null) errors.creatinineText = 'Enter a valid creatinine value.';
    else if (!(c > 0))
      errors.creatinineText = 'Creatinine must be greater than zero.';
  }

  if (needsCystatin && input.cystatinText.trim() !== '') {
    const c = parseNumber(input.cystatinText);
    if (c === null) errors.cystatinText = 'Enter a valid cystatin C value.';
    else if (!(c > 0))
      errors.cystatinText = 'Cystatin C must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateGfrEstimated(input),
  };
}
