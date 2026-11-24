/**
 * Fresh Frozen Plasma Dose — UI stub validation (ADR-019 commit 1).
 */

import { calculateFreshFrozenPlasmaDose } from './calculation';
import type {
  FreshFrozenPlasmaDoseFieldErrors,
  FreshFrozenPlasmaDoseInput,
  FreshFrozenPlasmaDoseResult,
} from './types';

export interface FreshFrozenPlasmaDoseValidation {
  errors: FreshFrozenPlasmaDoseFieldErrors;
  result: FreshFrozenPlasmaDoseResult | null;
}

export function validateFreshFrozenPlasmaDoseInput(
  input: FreshFrozenPlasmaDoseInput,
): FreshFrozenPlasmaDoseValidation {
  return {
    errors: {},
    result: calculateFreshFrozenPlasmaDose(input),
  };
}
