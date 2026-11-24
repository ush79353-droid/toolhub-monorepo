/**
 * Prostate TRUS/MRI volume worksheet — ellipsoid (π/6) and bullet (5π/24).
 * MacMahon et al. Radiology 2009 bullet; classic prolate ellipsoid π/6.
 */

export type VolumeModel = 'ellipsoid' | 'bullet' | 'compare';
export type LengthUnit = 'cm' | 'mm' | 'in';
export type VolumeUnit = 'mL' | 'cm3';

export interface ProstateVolumeInput {
  model: VolumeModel;
  length: string;
  lengthUnit: LengthUnit;
  height: string;
  heightUnit: LengthUnit;
  width: string;
  widthUnit: LengthUnit;
  volumeUnit: VolumeUnit;
  psaDensityOpen: boolean;
  psa: string;
  /** Which volume feeds PSA density when compare is selected. */
  psaVolumeSource: 'ellipsoid' | 'bullet';
}

export interface ProstateVolumeResult {
  ellipsoidMl: number | null;
  bulletMl: number | null;
  primaryMl: number | null;
  formattedPrimary: string;
  formattedEllipsoid: string | null;
  formattedBullet: string | null;
  psaDensity: number | null;
  formattedPsaDensity: string | null;
  disclaimer: string;
}

export type ProstateVolumeFieldErrors = {
  form?: string;
  length?: string;
  height?: string;
  width?: string;
  psa?: string;
};

export function createEmptyInput(): ProstateVolumeInput {
  return {
    model: 'ellipsoid',
    length: '',
    lengthUnit: 'cm',
    height: '',
    heightUnit: 'cm',
    width: '',
    widthUnit: 'cm',
    volumeUnit: 'mL',
    psaDensityOpen: false,
    psa: '',
    psaVolumeSource: 'ellipsoid',
  };
}

export function inputsEqual(
  a: ProstateVolumeInput,
  b: ProstateVolumeInput,
): boolean {
  return (
    a.model === b.model &&
    a.length === b.length &&
    a.lengthUnit === b.lengthUnit &&
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.width === b.width &&
    a.widthUnit === b.widthUnit &&
    a.volumeUnit === b.volumeUnit &&
    a.psaDensityOpen === b.psaDensityOpen &&
    a.psa === b.psa &&
    a.psaVolumeSource === b.psaVolumeSource
  );
}
