export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'm' | 'in';
export type VolumeUnit = 'mL' | 'L';

export interface PlasmaVolumeInput {
  weightText: string;
  weightUnit: WeightUnit;
  hematocritText: string;
  heightText: string;
  heightUnit: HeightUnit;
  volumeUnit: VolumeUnit;
}

export interface PlasmaVolumeResult {
  femaleWeightOnlyMl: number | null;
  maleWeightOnlyMl: number | null;
  femaleNadlerMl: number | null;
  maleNadlerMl: number | null;
  femaleLemmensMl: number | null;
  maleLemmensMl: number | null;
  formattedFemale: string;
  formattedMale: string;
  formattedFemaleNadler: string;
  formattedMaleNadler: string;
  formattedFemaleLemmens: string;
  formattedMaleLemmens: string;
  hasHeightMethods: boolean;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type PlasmaVolumeFieldErrors = {
  weightText?: string;
  hematocritText?: string;
  heightText?: string;
};

export function createDefaultInput(): PlasmaVolumeInput {
  return {
    weightText: '',
    weightUnit: 'kg',
    hematocritText: '',
    heightText: '',
    heightUnit: 'cm',
    volumeUnit: 'mL',
  };
}

export function createEmptyInput(): PlasmaVolumeInput {
  return createDefaultInput();
}

export function inputsEqual(a: PlasmaVolumeInput, b: PlasmaVolumeInput): boolean {
  return (
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.hematocritText === b.hematocritText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.volumeUnit === b.volumeUnit
  );
}
