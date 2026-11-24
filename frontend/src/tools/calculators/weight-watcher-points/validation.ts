/**
 * Weight Watcher Points validation — UI stub.
 * Engine commit adds full field guards and wires calculateWeightWatcherPoints.
 */

import { calculateWeightWatcherPoints } from './calculation';
import type {
  WeightWatcherPointsFieldErrors,
  WeightWatcherPointsInput,
  WeightWatcherPointsResult,
} from './types';

export interface WeightWatcherPointsValidation {
  errors: WeightWatcherPointsFieldErrors;
  result: WeightWatcherPointsResult | null;
}

export function validateWeightWatcherPointsInput(
  input: WeightWatcherPointsInput,
): WeightWatcherPointsValidation {
  return {
    errors: {},
    result: calculateWeightWatcherPoints(input),
  };
}
