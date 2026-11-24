/**
 * Bladder ultrasound volume worksheet (Bih et al. 1998 shape coefficients;
 * Omni-style shape list including geometric prolate ellipsoid 0.52).
 */

export type BladderShape =
  | 'ellipsoid'
  | 'cuboid'
  | 'triangular_prism'
  | 'prolate_ellipsoid'
  | 'unknown'
  | 'custom';

export type LengthUnit = 'cm' | 'mm' | 'in';
export type VolumeUnit = 'mL' | 'cm3' | 'L';

export interface BladderVolumeInput {
  shape: BladderShape;
  /** Used when shape === 'custom'; otherwise derived from shape. */
  customCoefficient: string;
  dim1: string;
  dim1Unit: LengthUnit;
  dim2: string;
  dim2Unit: LengthUnit;
  dim3: string;
  dim3Unit: LengthUnit;
  volumeUnit: VolumeUnit;
}

export interface BladderVolumeResult {
  coefficient: number;
  volumeMl: number;
  formattedVolume: string;
  meanErrorNote: string;
  disclaimer: string;
}

export type BladderVolumeFieldErrors = {
  form?: string;
  dim1?: string;
  dim2?: string;
  dim3?: string;
  customCoefficient?: string;
};

/** Screenshot defaults: Ellipsoid → 0.81; blank dimensions; cm; mL. */
export function createEmptyInput(): BladderVolumeInput {
  return {
    shape: 'ellipsoid',
    customCoefficient: '0.7',
    dim1: '',
    dim1Unit: 'cm',
    dim2: '',
    dim2Unit: 'cm',
    dim3: '',
    dim3Unit: 'cm',
    volumeUnit: 'mL',
  };
}

export function inputsEqual(a: BladderVolumeInput, b: BladderVolumeInput): boolean {
  return (
    a.shape === b.shape &&
    a.customCoefficient === b.customCoefficient &&
    a.dim1 === b.dim1 &&
    a.dim1Unit === b.dim1Unit &&
    a.dim2 === b.dim2 &&
    a.dim2Unit === b.dim2Unit &&
    a.dim3 === b.dim3 &&
    a.dim3Unit === b.dim3Unit &&
    a.volumeUnit === b.volumeUnit
  );
}

export const SHAPE_OPTIONS: { value: BladderShape; label: string }[] = [
  { value: 'ellipsoid', label: 'Ellipsoid' },
  { value: 'cuboid', label: 'Cuboid' },
  { value: 'triangular_prism', label: 'Triangular prism' },
  { value: 'prolate_ellipsoid', label: 'Prolate ellipsoid' },
  { value: 'unknown', label: "I don't know" },
  { value: 'custom', label: 'Custom coefficient' },
];
