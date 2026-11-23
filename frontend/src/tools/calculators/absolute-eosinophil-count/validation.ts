import { calculateAbsoluteEosinophilCount, parseNumber } from './calculation';
import type {
  AbsoluteEosinophilCountFieldErrors,
  AbsoluteEosinophilCountInput,
  AbsoluteEosinophilCountResult,
} from './types';

export interface AbsoluteEosinophilCountValidation {
  errors: AbsoluteEosinophilCountFieldErrors;
  result: AbsoluteEosinophilCountResult | null;
}

export function validateAbsoluteEosinophilCountInput(
  input: AbsoluteEosinophilCountInput,
): AbsoluteEosinophilCountValidation {
  const errors: AbsoluteEosinophilCountFieldErrors = {};

  if (input.wbcText.trim() !== '') {
    const wbc = parseNumber(input.wbcText);
    if (wbc === null) errors.wbcText = 'Enter a valid WBC.';
    else if (!(wbc > 0)) errors.wbcText = 'WBC must be positive.';
  }

  if (input.eosinophilPercentText.trim() !== '') {
    const eos = parseNumber(input.eosinophilPercentText);
    if (eos === null) errors.eosinophilPercentText = 'Enter a valid percentage.';
    else if (!(eos >= 0 && eos <= 100)) {
      errors.eosinophilPercentText =
        'Eosinophil percentage must be between 0 and 100.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAbsoluteEosinophilCount(input),
  };
}