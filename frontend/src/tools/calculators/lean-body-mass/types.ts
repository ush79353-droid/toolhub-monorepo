export type Sex = 'male' | 'female';
export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';

export interface LbmInput {
  sex: Sex;
  weightText: string;
  weightUnit: WeightUnit;
  heightText: string;
  heightUnit: HeightUnit;
  resultUnit: WeightUnit;
}

export interface LbmResult {
  weightKg: number | null;
  heightCm: number | null;
  leanKg: number | null;
  formattedLean: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type LbmFieldErrors = {
  weightText?: string;
  heightText?: string;
};

/** Screenshot defaults: Male; blank kg/cm; result kg. */
export function createDefaultInput(): LbmInput {
  return {
    sex: 'male',
    weightText: '',
    weightUnit: 'kg',
    heightText: '',
    heightUnit: 'cm',
    resultUnit: 'kg',
  };
}

export function createEmptyInput(): LbmInput {
  return createDefaultInput();
}

export function inputsEqual(a: LbmInput, b: LbmInput): boolean {
  return (
    a.sex === b.sex &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.resultUnit === b.resultUnit
  );
}
