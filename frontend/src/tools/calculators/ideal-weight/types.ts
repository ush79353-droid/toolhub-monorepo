export type Sex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

export type IbwFormulaId = 'devine' | 'robinson' | 'miller' | 'hamwi';

export interface IdealWeightInput {
  sex: Sex;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
}

export interface IbwEstimate {
  id: IbwFormulaId;
  label: string;
  kg: number;
  formattedKg: string;
  formattedDisplay: string;
}

export interface IdealWeightResult {
  heightCm: number | null;
  heightInches: number | null;
  currentWeightKg: number | null;
  estimates: IbwEstimate[];
  inchesOverFiveFeet: number | null;
  belowFiveFeet: boolean;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type IdealWeightFieldErrors = {
  heightText?: string;
  weightText?: string;
};

/** Screenshot defaults: Female; blank height cm; blank weight kg. */
export function createDefaultInput(): IdealWeightInput {
  return {
    sex: 'female',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
  };
}

export function createEmptyInput(): IdealWeightInput {
  return createDefaultInput();
}

export function inputsEqual(a: IdealWeightInput, b: IdealWeightInput): boolean {
  return (
    a.sex === b.sex &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit
  );
}
