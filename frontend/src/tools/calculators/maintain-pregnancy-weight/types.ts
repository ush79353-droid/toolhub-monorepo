export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb';

export interface MaintainPregnancyWeightInput {
  beforeOpen: boolean;
  height: string;
  heightUnit: HeightUnit;
  weight: string;
  weightUnit: WeightUnit;
  week: string;
  twins: boolean;
}

export interface MaintainPregnancyWeightResult {
  heightMeters: number;
  prePregnancyWeightKg: number;
  bmi: number;
  formattedBmi: string;
  bmiCategoryLabel: string;
  week: number;
  twins: boolean;
  minGainKg: number;
  maxGainKg: number;
  minWeightKg: number;
  maxWeightKg: number;
  formattedMinGain: string;
  formattedMaxGain: string;
  formattedMinWeight: string;
  formattedMaxWeight: string;
  weightUnit: WeightUnit;
  guidanceNote: string;
  disclaimer: string;
  sourceNote: string;
}

export type MaintainPregnancyWeightFieldErrors = {
  form?: string;
  height?: string;
  weight?: string;
  week?: string;
};

export function createDefaultInput(): MaintainPregnancyWeightInput {
  return {
    beforeOpen: true,
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    week: '40',
    twins: false,
  };
}

export function createEmptyInput(): MaintainPregnancyWeightInput {
  return createDefaultInput();
}

/** Example: 165 cm, 60 kg, week 40, singleton → BMI ≈ 22.04, gain ~11.3–15.9 kg */
export function createExampleInput(): MaintainPregnancyWeightInput {
  return {
    beforeOpen: true,
    height: '165',
    heightUnit: 'cm',
    weight: '60',
    weightUnit: 'kg',
    week: '40',
    twins: false,
  };
}

export function inputsEqual(
  a: MaintainPregnancyWeightInput,
  b: MaintainPregnancyWeightInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
