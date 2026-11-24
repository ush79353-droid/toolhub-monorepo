import { calculateSteroidConversion, parseNumber } from './calculation';
import { STEROID_DRUGS } from './drug-data';
import type {
  SteroidConversionInput,
  SteroidConversionResult,
  SteroidFieldErrors,
} from './types';

export interface SteroidValidation {
  errors: SteroidFieldErrors;
  result: SteroidConversionResult | null;
}

export function validateSteroidConversionInput(
  input: SteroidConversionInput,
): SteroidValidation {
  const errors: SteroidFieldErrors = {};
  for (const drug of STEROID_DRUGS) {
    const raw = input.doses[drug.id];
    if (raw.trim() === '') continue;
    const mg = parseNumber(raw);
    if (mg === null) errors[drug.id] = 'Enter a valid dose.';
    else if (mg < 0) errors[drug.id] = 'Dose cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateSteroidConversion(input),
  };
}
