/**
 * PSA density = serum PSA (ng/mL) ÷ prostate volume (mL or cc).
 * Ellipsoid volume (prolate ellipsoid): V = L × W × H × (π/6).
 */

import type { LengthUnit, VolumeUnit } from './types';

export const ELLIPSOID_K = Math.PI / 6;

const CM_PER: Record<LengthUnit, number> = {
  cm: 1,
  mm: 0.1,
  in: 2.54,
};

export function toCm(value: number, unit: LengthUnit): number {
  return value * CM_PER[unit];
}

/** Volume in mL (1 cm³ = 1 mL). */
export function ellipsoidVolumeMl(l: number, w: number, h: number): number {
  return l * w * h * ELLIPSOID_K;
}

export function psaDensity(psaNgMl: number, volumeMl: number): number | null {
  if (!(volumeMl > 0) || !(psaNgMl >= 0)) return null;
  return psaNgMl / volumeMl;
}

/** Full numeric precision for intermediate volume (cc = mL). */
export function volumeMlFromUnit(value: number, unit: VolumeUnit): number {
  return unit === 'cm3' ? value : value;
}

/** Display volume — trim trailing zeros after up to 6 decimal places. */
export function formatVolumeMl(ml: number): string {
  const rounded = Math.round(ml * 1e6) / 1e6;
  const s = rounded.toFixed(6).replace(/\.?0+$/, '');
  return s === '' ? '0' : s;
}

/** PSA density display — 2 decimal places (screenshot fixture: 0.10). */
export function formatDensity(d: number): string {
  return (Math.round(d * 100) / 100).toFixed(2);
}