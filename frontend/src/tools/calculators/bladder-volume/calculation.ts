/**
 * Ultrasonic bladder volume = L × W × H × k (dimensions in cm → mL ≡ cm³).
 *
 * Shape coefficients (Bih LI et al., Arch Phys Med Rehabil 1998; Omni list):
 * - Ellipsoid 0.81, Cuboid 0.89, Triangular prism 0.66 (Bih regressions)
 * - Prolate ellipsoid 0.52 ≈ π/6 geometric ellipsoid
 * - I don't know 0.77 (Omni irregular / unknown-shape factor)
 * Custom coefficient is user-supplied.
 */

import type {
  BladderShape,
  BladderVolumeInput,
  BladderVolumeResult,
  LengthUnit,
  VolumeUnit,
} from './types';

export const SHAPE_COEFFICIENT: Record<Exclude<BladderShape, 'custom'>, number> =
  {
    ellipsoid: 0.81,
    cuboid: 0.89,
    triangular_prism: 0.66,
    prolate_ellipsoid: 0.52,
    unknown: 0.77,
  };

const CM_PER: Record<LengthUnit, number> = {
  cm: 1,
  mm: 0.1,
  in: 2.54,
};

export function toCm(value: number, unit: LengthUnit): number {
  return value * CM_PER[unit];
}

export function coefficientForShape(
  shape: BladderShape,
  customCoefficient: number | null,
): number | null {
  if (shape === 'custom') {
    if (customCoefficient == null || !Number.isFinite(customCoefficient)) {
      return null;
    }
    return customCoefficient;
  }
  return SHAPE_COEFFICIENT[shape];
}

export function volumeMlFromCm(
  dim1Cm: number,
  dim2Cm: number,
  dim3Cm: number,
  coefficient: number,
): number {
  return dim1Cm * dim2Cm * dim3Cm * coefficient;
}

export function mlToDisplay(ml: number, unit: VolumeUnit): number {
  if (unit === 'L') return ml / 1000;
  // mL and cm³ are numerically identical for water-like volume labeling.
  return ml;
}

export function formatVolume(ml: number, unit: VolumeUnit): string {
  const v = mlToDisplay(ml, unit);
  const abs = Math.abs(v);
  const digits = abs >= 100 ? 1 : abs >= 10 ? 2 : 3;
  return v.toFixed(digits).replace(/\.?0+$/, '') || '0';
}

export function calculateBladderVolume(
  input: BladderVolumeInput,
  dimsCm: [number, number, number],
  coefficient: number,
): BladderVolumeResult {
  const volumeMl = volumeMlFromCm(dimsCm[0], dimsCm[1], dimsCm[2], coefficient);
  return {
    coefficient,
    volumeMl,
    formattedVolume: formatVolume(volumeMl, input.volumeUnit),
    meanErrorNote:
      'Shape-specific ultrasonic estimates in Bih et al. had ~12.7% mean error when the matching coefficient was used.',
    disclaimer:
      'Educational ultrasound volume worksheet only — not a diagnosis or treatment plan.',
  };
}
