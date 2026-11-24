/**
 * Weight Watcher Points validation — field guards + engine wiring.
 */

import { calculateWeightWatcherPoints, parseNumber } from './calculation';
import type {
  WeightWatcherPointsFieldErrors,
  WeightWatcherPointsInput,
  WeightWatcherPointsResult,
} from './types';

export interface WeightWatcherPointsValidation {
  errors: WeightWatcherPointsFieldErrors;
  result: WeightWatcherPointsResult | null;
}

function validateNonNeg(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (n < 0) return `${label} cannot be negative.`;
  return undefined;
}

export function validateWeightWatcherPointsInput(
  input: WeightWatcherPointsInput,
): WeightWatcherPointsValidation {
  const errors: WeightWatcherPointsFieldErrors = {};

  const calErr = validateNonNeg(input.caloriesText, 'calories');
  if (calErr) errors.caloriesText = calErr;

  const sugarErr = validateNonNeg(input.sugarText, 'sugar');
  if (sugarErr) errors.sugarText = sugarErr;

  const proteinErr = validateNonNeg(input.proteinText, 'protein');
  if (proteinErr) errors.proteinText = proteinErr;

  const satErr = validateNonNeg(input.saturatedFatText, 'saturated fat');
  if (satErr) errors.saturatedFatText = satErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateWeightWatcherPoints(input) };
}
