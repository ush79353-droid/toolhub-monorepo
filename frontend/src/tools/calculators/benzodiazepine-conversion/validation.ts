import { calculateBenzodiazepineConversion, parseNumber } from './calculation';
import { BENZODIAZEPINE_DRUGS } from './drug-data';
import type {
  BenzodiazepineConversionInput,
  BenzodiazepineConversionResult,
  BenzodiazepineFieldErrors,
} from './types';

export interface BenzodiazepineValidation {
  errors: BenzodiazepineFieldErrors;
  result: BenzodiazepineConversionResult | null;
}

export function validateBenzodiazepineConversionInput(
  input: BenzodiazepineConversionInput,
): BenzodiazepineValidation {
  const errors: BenzodiazepineFieldErrors = {};
  for (const drug of BENZODIAZEPINE_DRUGS) {
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
    result: calculateBenzodiazepineConversion(input),
  };
}