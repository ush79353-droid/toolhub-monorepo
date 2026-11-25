/**
 * PSA density worksheet — ellipsoid prostate volume (π/6) with optional direct volume.
 */

export type LengthUnit = 'cm' | 'mm' | 'in';
export type VolumeUnit = 'cm3' | 'mL';

export interface PsaDensityInput {
  length: string;
  lengthUnit: LengthUnit;
  width: string;
  widthUnit: LengthUnit;
  height: string;
  heightUnit: LengthUnit;
  prostateVolume: string;
  volumeUnit: VolumeUnit;
  /** User typed prostate volume instead of using computed ellipsoid only. */
  volumeManual: boolean;
  psa: string;
}

export interface PsaDensityResult {
  volumeMl: number | null;
  formattedVolume: string | null;
  volumeFromDimensions: boolean;
  psaDensity: number | null;
  formattedPsaDensity: string | null;
  disclaimer: string;
}

export type PsaDensityFieldErrors = {
  form?: string;
  length?: string;
  width?: string;
  height?: string;
  prostateVolume?: string;
  psa?: string;
};

export function createEmptyInput(): PsaDensityInput {
  return {
    length: '',
    lengthUnit: 'cm',
    width: '',
    widthUnit: 'cm',
    height: '',
    heightUnit: 'cm',
    prostateVolume: '',
    volumeUnit: 'cm3',
    volumeManual: false,
    psa: '',
  };
}

export function createExampleInput(): PsaDensityInput {
  return {
    length: '4',
    lengthUnit: 'cm',
    width: '3',
    widthUnit: 'cm',
    height: '5',
    heightUnit: 'cm',
    prostateVolume: '',
    volumeUnit: 'cm3',
    volumeManual: false,
    psa: '3.1416',
  };
}

export function inputsEqual(a: PsaDensityInput, b: PsaDensityInput): boolean {
  return (
    a.length === b.length &&
    a.lengthUnit === b.lengthUnit &&
    a.width === b.width &&
    a.widthUnit === b.widthUnit &&
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.prostateVolume === b.prostateVolume &&
    a.volumeUnit === b.volumeUnit &&
    a.volumeManual === b.volumeManual &&
    a.psa === b.psa
  );
}