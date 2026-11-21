export type {
  HeightUnit,
  WeightUnit,
  PregnancyWeightGainFieldErrors,
  PregnancyWeightGainInput,
  PregnancyWeightGainResult,
} from '../pregnancy-weight-gain/types';

import type { PregnancyWeightGainInput } from '../pregnancy-weight-gain/types';
import { inputsEqual as baseEqual } from '../pregnancy-weight-gain/types';

/** Screenshot: blank height/weight, week 40, Twins = Yes. */
export function createDefaultInput(): PregnancyWeightGainInput {
  return {
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    week: '40',
    twins: true,
    resultWeightUnit: 'kg',
    resultGainUnit: 'kg',
    beforeOpen: true,
    duringOpen: true,
  };
}

export function createEmptyInput(): PregnancyWeightGainInput {
  return createDefaultInput();
}

export const inputsEqual = baseEqual;
