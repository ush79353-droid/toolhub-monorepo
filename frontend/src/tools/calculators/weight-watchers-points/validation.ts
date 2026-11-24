/**
 * Weight Watchers Points Calculator — UI stub validation
 * (engine commit completes rules).
 */

import { calculateWeightWatchersPoints, parseNumber } from './calculation';
import type {
  WeightWatchersPointsFieldErrors,
  WeightWatchersPointsInput,
  WeightWatchersPointsResult,
} from './types';

export interface WeightWatchersPointsValidation {
  errors: WeightWatchersPointsFieldErrors;
  result: WeightWatchersPointsResult | null;
}

function validateNonNegative(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label} value.`;
  if (n < 0) return `${label} must be non-negative.`;
  return undefined;
}

export function validateWeightWatchersPointsInput(
  input: WeightWatchersPointsInput,
): WeightWatchersPointsValidation {
  const errors: WeightWatchersPointsFieldErrors = {};

  const calErr = validateNonNegative(input.caloriesText, 'calories');
  if (calErr) errors.caloriesText = calErr;

  const sugarErr = validateNonNegative(input.sugarText, 'sugar');
  if (sugarErr) errors.sugarText = sugarErr;

  const proteinErr = validateNonNegative(input.proteinText, 'protein');
  if (proteinErr) errors.proteinText = proteinErr;

  const satErr = validateNonNegative(input.saturatedFatText, 'saturated fat');
  if (satErr) errors.saturatedFatText = satErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateWeightWatchersPoints(input) };
}
