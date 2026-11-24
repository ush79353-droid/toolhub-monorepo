/**
 * Ellipsoid: V = L×H×W×(π/6)
 * Bullet:    V = L×H×W×(5π/24)  [= π/4.8]  (MacMahon et al. 2009)
 * PSA density = serum PSA (ng/mL) / volume (mL) → ng/mL²
 */

import type { LengthUnit, VolumeUnit } from './types';

export const ELLIPSOID_K = Math.PI / 6;
export const BULLET_K = (5 * Math.PI) / 24;

const CM_PER: Record<LengthUnit, number> = {
  cm: 1,
  mm: 0.1,
  in: 2.54,
};

export function toCm(value: number, unit: LengthUnit): number {
  return value * CM_PER[unit];
}

export function ellipsoidVolumeMl(l: number, h: number, w: number): number {
  return l * h * w * ELLIPSOID_K;
}

export function bulletVolumeMl(l: number, h: number, w: number): number {
  return l * h * w * BULLET_K;
}

export function psaDensity(psaNgMl: number, volumeMl: number): number | null {
  if (!(volumeMl > 0) || !(psaNgMl >= 0)) return null;
  return psaNgMl / volumeMl;
}

export function formatVolume(ml: number, unit: VolumeUnit): string {
  const v = unit === 'cm3' ? ml : ml;
  return v.toFixed(2);
}

export function formatDensity(d: number): string {
  return d.toFixed(3);
}
