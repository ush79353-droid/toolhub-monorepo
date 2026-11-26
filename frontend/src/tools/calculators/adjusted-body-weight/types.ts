export type Sex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

export interface AdjustedBodyWeightInput {
  sex: Sex;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  /** Display unit for IBW / AdjBW results (denomination only). */
  resultWeightUnit: WeightUnit;
}

export interface AdjustedBodyWeightResult {
  heightInches: number | null;
  actualWeightKg: number | null;
  ibwKg: number | null;
  adjBwKg: number | null;
  formattedIbw: string;
  formattedAdjBw: string;
  adjustmentApplied: boolean;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AdjustedBodyWeightFieldErrors = {
  heightText?: string;
  weightText?: string;
};

/** Screenshot defaults: Female; blank height cm; blank actual weight kg. */
export function createDefaultInput(): AdjustedBodyWeightInput {
  return {
    sex: 'female',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    resultWeightUnit: 'kg',
  };
}

export function createEmptyInput(): AdjustedBodyWeightInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: AdjustedBodyWeightInput,
  b: AdjustedBodyWeightInput,
): boolean {
  return (
    a.sex === b.sex &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.resultWeightUnit === b.resultWeightUnit
  );
}
