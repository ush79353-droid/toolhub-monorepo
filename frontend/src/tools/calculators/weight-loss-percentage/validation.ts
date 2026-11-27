import { calculateWeightLoss, parseNumber } from './calculation';
import type { WlpFieldErrors, WlpInput, WlpResult } from './types';

export interface WlpValidation {
  errors: WlpFieldErrors;
  result: WlpResult | null;
}

export function validateWlpInput(input: WlpInput): WlpValidation {
  const errors: WlpFieldErrors = {};

  if (input.pastText.trim() !== '') {
    const p = parseNumber(input.pastText);
    if (p === null) errors.pastText = 'Enter a valid past weight.';
    else if (!(p > 0)) errors.pastText = 'Past weight must be greater than zero.';
  }

  if (input.currentText.trim() !== '') {
    const c = parseNumber(input.currentText);
    if (c === null) errors.currentText = 'Enter a valid current weight.';
    else if (!(c >= 0))
      errors.currentText = 'Current weight cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateWeightLoss(input) };
}
