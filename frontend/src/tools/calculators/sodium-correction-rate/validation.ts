import { calculateSodiumCorrectionRate, parseNumber } from './calculation';
import type {
  SodiumCorrectionRateFieldErrors,
  SodiumCorrectionRateInput,
  SodiumCorrectionRateResult,
} from './types';

export interface SodiumCorrectionRateValidation {
  errors: SodiumCorrectionRateFieldErrors;
  result: SodiumCorrectionRateResult | null;
}

export function validateSodiumCorrectionRateInput(
  input: SodiumCorrectionRateInput,
): SodiumCorrectionRateValidation {
  const errors: SodiumCorrectionRateFieldErrors = {};

  const weightRaw = parseNumber(input.weightText);
  if (input.weightText.trim() !== '' && weightRaw === null) {
    errors.weightText = 'Enter a valid number';
  } else if (weightRaw !== null && !(weightRaw > 0)) {
    errors.weightText = 'Weight must be greater than zero';
  }

  const sodiumRaw = parseNumber(input.sodiumText);
  if (input.sodiumText.trim() !== '' && sodiumRaw === null) {
    errors.sodiumText = 'Enter a valid number';
  } else if (sodiumRaw !== null && (!(sodiumRaw > 0) || sodiumRaw > 300)) {
    errors.sodiumText = 'Enter a plausible serum sodium';
  }

  const aimedRaw = parseNumber(input.aimedChangeText);
  if (input.aimedChangeText.trim() !== '' && aimedRaw === null) {
    errors.aimedChangeText = 'Enter a valid number';
  } else if (aimedRaw !== null && aimedRaw === 0) {
    errors.aimedChangeText = 'Aimed change cannot be zero';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateSodiumCorrectionRate(input) };
}
