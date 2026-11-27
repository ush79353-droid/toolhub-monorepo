export type Sex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb';
export type VolumeUnit = 'L' | 'mL';

export interface TotalBodyWaterInput {
  sex: Sex;
  ageText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  volumeUnit: VolumeUnit;
  massUnit: WeightUnit;
}

export interface TotalBodyWaterResult {
  tbwLiters: number | null;
  tbwKg: number | null;
  percentBodyWeight: number | null;
  formattedVolume: string;
  formattedMass: string;
  formattedPercent: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type TotalBodyWaterFieldErrors = {
  ageText?: string;
  heightText?: string;
  weightText?: string;
};

/** Screenshot defaults: Female; blank age/height/weight; cm/kg; results L/kg/%. */
export function createDefaultInput(): TotalBodyWaterInput {
  return {
    sex: 'female',
    ageText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    volumeUnit: 'L',
    massUnit: 'kg',
  };
}

export function createEmptyInput(): TotalBodyWaterInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: TotalBodyWaterInput,
  b: TotalBodyWaterInput,
): boolean {
  return (
    a.sex === b.sex &&
    a.ageText === b.ageText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.volumeUnit === b.volumeUnit &&
    a.massUnit === b.massUnit
  );
}
