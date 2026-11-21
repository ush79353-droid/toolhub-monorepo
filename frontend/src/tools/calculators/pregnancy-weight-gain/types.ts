export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';

export type BmiCategoryId =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese';

export interface PregnancyWeightGainInput {
  height: string;
  heightUnit: HeightUnit;
  weight: string;
  weightUnit: WeightUnit;
  week: string;
  twins: boolean;
  /** Display unit for min/max weight results. */
  resultWeightUnit: WeightUnit;
  /** Display unit for min/max gain results. */
  resultGainUnit: WeightUnit;
  beforeOpen: boolean;
  duringOpen: boolean;
}

export interface GainBandKg {
  minKg: number;
  maxKg: number;
}

export type PregnancyWeightGainAvailability =
  | 'ok'
  | 'twins_underweight_unavailable'
  | 'twins_midpregnancy_unavailable';

export interface PregnancyWeightGainResult {
  bmi: number;
  formattedBmi: string;
  bmiCategory: BmiCategoryId;
  bmiCategoryLabel: string;
  week: number;
  twins: boolean;
  availability: PregnancyWeightGainAvailability;
  unavailableMessage: string | null;
  /** Recommended gestational gain bounds in kg (null when unavailable). */
  minGainKg: number | null;
  maxGainKg: number | null;
  minWeightKg: number | null;
  maxWeightKg: number | null;
  formattedMinGain: string;
  formattedMaxGain: string;
  formattedMinWeight: string;
  formattedMaxWeight: string;
  sourceLabel: string;
  disclaimer: string;
}

export type PregnancyWeightGainFieldErrors = {
  form?: string;
  height?: string;
  weight?: string;
  week?: string;
};

/**
 * Screenshot defaults: blank height/weight (do not seed medical values),
 * week 40, twins unchecked, cm/kg units, both sections open.
 */
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
    week: '40',
    twins: false,
  };
}

export function inputsEqual(
  a: PregnancyWeightGainInput,
  b: PregnancyWeightGainInput,
): boolean {
  return (
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.week === b.week &&
    a.twins === b.twins &&
    a.resultWeightUnit === b.resultWeightUnit &&
    a.resultGainUnit === b.resultGainUnit &&
    a.beforeOpen === b.beforeOpen &&
    a.duringOpen === b.duringOpen
  );
}
