/** Educational tidal volume + Chula Ideal ETT depth worksheet (ADR-023). */

export type Sex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in';
export type DepthUnit = 'cm' | 'in';
export type VolumeUnit = 'mL' | 'L';

export interface TidalVolumeInput {
  height: number | null;
  heightUnit: HeightUnit;
  sex: Sex;
  depthUnit: DepthUnit;
  volumeUnit: VolumeUnit;
}

export interface TidalVolumeResult {
  heightCm: number | null;
  ibwKg: number | null;
  vtMinMl: number | null;
  vtMaxMl: number | null;
  ettDepthCm: number | null;
  formattedIbw: string;
  formattedVtMin: string;
  formattedVtMax: string;
  formattedEttDepth: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type TidalVolumeFieldErrors = {
  form?: string;
  height?: string;
};

export function createDefaultInput(): TidalVolumeInput {
  return {
    height: null,
    heightUnit: 'cm',
    sex: 'female',
    depthUnit: 'cm',
    volumeUnit: 'mL',
  };
}

export function createEmptyInput(): TidalVolumeInput {
  return createDefaultInput();
}

/** Omni fixture: female 167 cm → ETT 20.7 cm · IBW ≈58.73 kg · VT ≈352–470 mL. */
export function createExampleInput(): TidalVolumeInput {
  return {
    height: 167,
    heightUnit: 'cm',
    sex: 'female',
    depthUnit: 'cm',
    volumeUnit: 'mL',
  };
}

export function inputsEqual(a: TidalVolumeInput, b: TidalVolumeInput): boolean {
  return (
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.sex === b.sex &&
    a.depthUnit === b.depthUnit &&
    a.volumeUnit === b.volumeUnit
  );
}
