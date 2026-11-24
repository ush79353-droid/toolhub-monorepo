export type CarboplatinSex = 'male' | 'female';
export type WeightUnit = 'kg' | 'lb';

export interface CarboplatinInput {
  sex: CarboplatinSex;
  ageYearsText: string;
  weightText: string;
  weightUnit: WeightUnit;
  scrMgDlText: string;
  targetAucText: string;
}

export interface CarboplatinResult {
  gfrMlMin: number | null;
  carboplatinDoseMg: number | null;
  maximumDoseMg: number | null;
  gfrUsedForMax: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type CarboplatinFieldErrors = {
  ageYearsText?: string;
  weightText?: string;
  scrMgDlText?: string;
  targetAucText?: string;
};

export function createDefaultInput(): CarboplatinInput {
  return {
    sex: 'male',
    ageYearsText: '',
    weightText: '',
    weightUnit: 'kg',
    scrMgDlText: '',
    targetAucText: '',
  };
}

export function createEmptyInput(): CarboplatinInput {
  return createDefaultInput();
}

export function inputsEqual(a: CarboplatinInput, b: CarboplatinInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}