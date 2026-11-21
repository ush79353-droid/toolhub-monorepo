export type {
  HeightUnit,
  WeightUnit,
  PregnancyWeightGainFieldErrors,
  PregnancyWeightGainInput,
  PregnancyWeightGainResult,
} from '../pregnancy-weight-gain/types';

import type { PregnancyWeightGainInput } from '../pregnancy-weight-gain/types';
import { inputsEqual as baseEqual } from '../pregnancy-weight-gain/types';

/** Screenshot: blank height/weight, week 40, Twins = No. */
export function createDefaultInput(): PregnancyWeightGainInput {
  return {
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    week: '40',
    twins: false,
    resultWeightUnit: 'kg',
    resultGainUnit: 'kg',
    beforeOpen: true,
    duringOpen: true,
  };
}

export function createEmptyInput(): PregnancyWeightGainInput {
  return createDefaultInput();
}

/** Fixture: 165 cm · 60 kg · week 40 · singleton → normal BMI ≈ 22.04. */
export function createExampleInput(): PregnancyWeightGainInput {
  return {
    ...createDefaultInput(),
    height: '165',
    weight: '60',
  };
}

export const inputsEqual = baseEqual;
