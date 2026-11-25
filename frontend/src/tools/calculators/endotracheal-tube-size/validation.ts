import { calculateEndotrachealTubeSize, parseNumber } from './calculation';
import type {
  EndotrachealTubeSizeFieldErrors,
  EndotrachealTubeSizeInput,
  EndotrachealTubeSizeResult,
} from './types';

export interface EndotrachealTubeSizeValidation {
  errors: EndotrachealTubeSizeFieldErrors;
  result: EndotrachealTubeSizeResult | null;
}

export function validateEndotrachealTubeSizeInput(
  input: EndotrachealTubeSizeInput,
): EndotrachealTubeSizeValidation {
  const errors: EndotrachealTubeSizeFieldErrors = {};

  if (input.ageText.trim() !== '') {
    const n = parseNumber(input.ageText);
    if (n === null) errors.ageText = 'Enter a valid age.';
    else if (n < 0) errors.ageText = 'Age must be non-negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateEndotrachealTubeSize(input) };
}
