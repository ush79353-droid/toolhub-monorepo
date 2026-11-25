export type Sex = 'female' | 'male';

export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';
export type WaistUnit = 'cm' | 'm' | 'in';

export interface AbsiInput {
  sex: Sex;
  ageText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  waistText: string;
  waistUnit: WaistUnit;
}

export interface AbsiResult {
  bmiKgM2: number | null;
  absi: number | null;
  absiZScore: number | null;
  formattedAbsi: string;
  formattedZScore: string;
  referenceMean: number | null;
  referenceSd: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AbsiFieldErrors = {
  ageText?: string;
  heightText?: string;
  weightText?: string;
  waistText?: string;
};

/** Screenshot defaults: Female selected; blank anthropometrics; metric units. */
export function createDefaultInput(): AbsiInput {
  return {
    sex: 'female',
    ageText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    waistText: '',
    waistUnit: 'cm',
  };
}

export function createEmptyInput(): AbsiInput {
  return createDefaultInput();
}

export function inputsEqual(a: AbsiInput, b: AbsiInput): boolean {
  return (
    a.sex === b.sex &&
    a.ageText === b.ageText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.waistText === b.waistText &&
    a.waistUnit === b.waistUnit
  );
}
