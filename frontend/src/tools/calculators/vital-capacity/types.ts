/** Predicted vital capacity from age, sex, and height (ADR-023). */

export type Sex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in';
export type VolumeUnit = 'L' | 'mL';

export interface VitalCapacityInput {
  sex: Sex;
  ageYears: number | null;
  height: number | null;
  heightUnit: HeightUnit;
  volumeUnit: VolumeUnit;
}

export interface VitalCapacityResult {
  heightCm: number | null;
  vcLiters: number | null;
  formattedVc: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type VitalCapacityFieldErrors = {
  form?: string;
  ageYears?: string;
  height?: string;
};

export function createDefaultInput(): VitalCapacityInput {
  return {
    sex: 'female',
    ageYears: null,
    height: null,
    heightUnit: 'cm',
    volumeUnit: 'L',
  };
}

export function createEmptyInput(): VitalCapacityInput {
  return createDefaultInput();
}

/** Female 30 y · 167 cm → VC ≈ 3.13 L (Baldwin anthropometric form). */
export function createExampleInput(): VitalCapacityInput {
  return {
    sex: 'female',
    ageYears: 30,
    height: 167,
    heightUnit: 'cm',
    volumeUnit: 'L',
  };
}

export function inputsEqual(a: VitalCapacityInput, b: VitalCapacityInput): boolean {
  return (
    a.sex === b.sex &&
    a.ageYears === b.ageYears &&
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.volumeUnit === b.volumeUnit
  );
}