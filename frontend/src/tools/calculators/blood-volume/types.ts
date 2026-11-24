export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';

export interface BloodVolumeInput {
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
}

export interface BloodVolumeResult {
  nadlerFemaleMl: number | null;
  nadlerMaleMl: number | null;
  lbbFemaleMl: number | null;
  lbbMaleMl: number | null;
  weightFemaleMl: number | null;
  weightMaleMl: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BloodVolumeFieldErrors = {
  heightText?: string;
  weightText?: string;
};

export function createDefaultInput(): BloodVolumeInput {
  return {
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
  };
}

export function createEmptyInput(): BloodVolumeInput {
  return createDefaultInput();
}

export function inputsEqual(a: BloodVolumeInput, b: BloodVolumeInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}