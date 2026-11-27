import { calculateTotalBodyWater, parseNumber } from './calculation';
import type {
  TotalBodyWaterFieldErrors,
  TotalBodyWaterInput,
  TotalBodyWaterResult,
} from './types';

export interface TotalBodyWaterValidation {
  errors: TotalBodyWaterFieldErrors;
  result: TotalBodyWaterResult | null;
}

function checkPositive(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be positive.`;
  return undefined;
}

export function validateTotalBodyWaterInput(
  input: TotalBodyWaterInput,
): TotalBodyWaterValidation {
  const errors: TotalBodyWaterFieldErrors = {};

  const ageErr = checkPositive(input.ageText, 'age');
  if (ageErr) errors.ageText = ageErr;

  const hErr = checkPositive(input.heightText, 'height');
  if (hErr) errors.heightText = hErr;

  const wErr = checkPositive(input.weightText, 'weight');
  if (wErr) errors.weightText = wErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateTotalBodyWater(input),
  };
}
