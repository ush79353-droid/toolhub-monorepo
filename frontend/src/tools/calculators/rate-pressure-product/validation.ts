import { calculateRatePressureProduct, parseNumber } from './calculation';
import type {
  RatePressureProductFieldErrors,
  RatePressureProductInput,
  RatePressureProductResult,
} from './types';

export interface RatePressureProductValidation {
  errors: RatePressureProductFieldErrors;
  result: RatePressureProductResult | null;
}

export function validateRatePressureProductInput(
  input: RatePressureProductInput,
): RatePressureProductValidation {
  const errors: RatePressureProductFieldErrors = {};

  if (input.heartRateText.trim() !== '') {
    const hr = parseNumber(input.heartRateText);
    if (hr === null) errors.heartRateText = 'Enter a valid heart rate.';
    else if (!(hr > 0))
      errors.heartRateText = 'Heart rate must be positive.';
  }

  if (input.systolicBpText.trim() !== '') {
    const sbp = parseNumber(input.systolicBpText);
    if (sbp === null) errors.systolicBpText = 'Enter a valid systolic BP.';
    else if (!(sbp > 0))
      errors.systolicBpText = 'Systolic BP must be positive.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateRatePressureProduct(input) };
}
