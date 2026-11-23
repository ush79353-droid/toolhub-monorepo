export type BeeSex = 'male' | 'female';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';
export type EnergyUnit = 'kcal_day' | 'mj_day';

export type BeeActivity =
  | 'bed_rest'
  | 'light_sedentary'
  | 'moderate'
  | 'heavy';

export type BeeStress = 'none' | 'minor' | 'moderate' | 'severe';
export type BeeTemperature = 'normal' | 'fever_low' | 'fever_high';

export interface BeeCalculatorInput {
  sex: BeeSex;
  ageYearsText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  activity: BeeActivity;
  stress: BeeStress;
  temperature: BeeTemperature;
  energyUnit: EnergyUnit;
}

export interface BeeCalculatorResult {
  beeKcalPerDay: number | null;
  teeKcalPerDay: number | null;
  beeDisplay: string;
  teeDisplay: string;
  energyUnitLabel: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BeeCalculatorFieldErrors = {
  ageYearsText?: string;
  heightText?: string;
  weightText?: string;
};

export function createDefaultInput(): BeeCalculatorInput {
  return {
    sex: 'male',
    ageYearsText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    activity: 'light_sedentary',
    stress: 'none',
    temperature: 'normal',
    energyUnit: 'kcal_day',
  };
}

export function createEmptyInput(): BeeCalculatorInput {
  return createDefaultInput();
}

export function inputsEqual(a: BeeCalculatorInput, b: BeeCalculatorInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}