import { calculateOpioidConversion, parseNumber } from './calculation';
import { OPIOID_DRUGS } from './drug-data';
import type {
  OpioidConversionInput,
  OpioidConversionResult,
  OpioidFieldErrors,
} from './types';

export interface OpioidValidation {
  errors: OpioidFieldErrors;
  result: OpioidConversionResult | null;
}

export function validateOpioidConversionInput(
  input: OpioidConversionInput,
): OpioidValidation {
  const errors: OpioidFieldErrors = {};

  const ictRaw = input.crossToleranceText.trim();
  if (ictRaw === '') {
    errors.crossToleranceText = 'Enter incomplete cross-tolerance (0–100).';
  } else {
    const ict = parseNumber(input.crossToleranceText);
    if (ict === null) errors.crossToleranceText = 'Enter a valid percent.';
    else if (ict < 0 || ict > 100) {
      errors.crossToleranceText = 'Use 0–100%.';
    }
  }

  for (const drug of OPIOID_DRUGS) {
    const raw = input.doses[drug.id];
    if (raw.trim() === '') continue;
    const amount = parseNumber(raw);
    if (amount === null) errors[drug.id] = 'Enter a valid dose.';
    else if (amount < 0) errors[drug.id] = 'Dose cannot be negative.';
    else if (!drug.units.includes(input.units[drug.id])) {
      errors[drug.id] = 'Unsupported unit for this opioid/route.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateOpioidConversion(input),
  };
}
