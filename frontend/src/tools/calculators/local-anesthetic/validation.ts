import { calculateLocalAnesthetic, parseNumber } from './calculation';
import { limitFor } from './labeling-data';
import type {
  LocalAnestheticFieldErrors,
  LocalAnestheticInput,
  LocalAnestheticResult,
} from './types';

export interface LocalAnestheticValidation {
  errors: LocalAnestheticFieldErrors;
  result: LocalAnestheticResult | null;
}

export function validateLocalAnestheticInput(
  input: LocalAnestheticInput,
): LocalAnestheticValidation {
  const errors: LocalAnestheticFieldErrors = {};
  const lim = limitFor(input.drug);

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0 && w < 500)) errors.weightText = 'Weight must be greater than 0.';
  }

  if (input.concentrationPercentText.trim() !== '') {
    const c = parseNumber(input.concentrationPercentText);
    if (c === null) {
      errors.concentrationPercentText = 'Enter a valid concentration.';
    } else if (!lim.concentrationsPercent.includes(c)) {
      errors.concentrationPercentText = 'Select a listed concentration.';
    }
  }

  if (Object.keys(errors).length > 0) return { errors, result: null };

  try {
    return { errors: {}, result: calculateLocalAnesthetic(input) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid input.';
    return { errors: { weightText: msg }, result: null };
  }
}
