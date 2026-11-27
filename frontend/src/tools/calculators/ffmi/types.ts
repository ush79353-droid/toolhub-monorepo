/** FFMI (Fat-Free Mass Index) — screenshot-first (ADR-023). */

export type Sex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';
export type MassUnit = 'kg' | 'lb';

export interface FfmiInput {
  sex: Sex;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  bodyFatText: string;
  ffmUnit: MassUnit;
  fatMassUnit: MassUnit;
}

export interface FfmiResult {
  ffmi: number | null;
  normalizedFfmi: number | null;
  fatFreeMassKg: number | null;
  fatMassKg: number | null;
  formattedFfmi: string;
  formattedNormalizedFfmi: string;
  formattedFfm: string;
  formattedFatMass: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type FfmiFieldErrors = {
  heightText?: string;
  weightText?: string;
  bodyFatText?: string;
};

export function createDefaultInput(): FfmiInput {
  return {
    sex: 'female',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    bodyFatText: '',
    ffmUnit: 'kg',
    fatMassUnit: 'kg',
  };
}

export function createEmptyInput(): FfmiInput {
  return createDefaultInput();
}

export function inputsEqual(a: FfmiInput, b: FfmiInput): boolean {
  return (
    a.sex === b.sex &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.bodyFatText === b.bodyFatText &&
    a.ffmUnit === b.ffmUnit &&
    a.fatMassUnit === b.fatMassUnit
  );
}
