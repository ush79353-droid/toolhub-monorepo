import { calculateBicarbonateDeficit, parseNumber } from './calculation';
import type {
  BicarbonateDeficitFieldErrors,
  BicarbonateDeficitInput,
  BicarbonateDeficitResult,
} from './types';

export interface BicarbonateDeficitValidation {
  errors: BicarbonateDeficitFieldErrors;
  result: BicarbonateDeficitResult | null;
}

export function validateBicarbonateDeficitInput(
  input: BicarbonateDeficitInput,
): BicarbonateDeficitValidation {
  const errors: BicarbonateDeficitFieldErrors = {};

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be greater than zero.';
  }

  if (input.actualBicarbText.trim() !== '') {
    const a = parseNumber(input.actualBicarbText);
    if (a === null) errors.actualBicarbText = 'Enter a valid actual bicarbonate.';
    else if (!(a > 0))
      errors.actualBicarbText = 'Actual bicarbonate must be greater than zero.';
  }

  if (input.desiredBicarbText.trim() !== '') {
    const d = parseNumber(input.desiredBicarbText);
    if (d === null)
      errors.desiredBicarbText = 'Enter a valid desired bicarbonate.';
    else if (!(d > 0))
      errors.desiredBicarbText =
        'Desired bicarbonate must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateBicarbonateDeficit(input),
  };
}
