/**
 * Daugirdas second-generation single-pool Kt/V (1993/1995):
 *   R = Cpost / Cpre
 *   Kt/V = −ln(R − 0.008×t) + (4 − 3.5×R) × (UF / W)
 *   URR% = 100 × (1 − R)
 * t in hours, UF in liters, W post-dialysis weight in kg.
 * BUN may be entered as mg/dL or mmol/L (urea); ratio R is unitless when both match.
 */

import type { BunUnit, DurationUnit, KtvDaugirdasResult, VolumeUnit, WeightUnit } from './types';

/** Urea: 1 mmol/L ≈ 2.8011 mg/dL BUN (atomic N × 2). */
const MGDL_PER_MMOL = 2.8011;

export function bunToMgDl(value: number, unit: BunUnit): number {
  return unit === 'mmol/L' ? value * MGDL_PER_MMOL : value;
}

export function durationToHours(value: number, unit: DurationUnit): number {
  return unit === 'min' ? value / 60 : value;
}

export function volumeToLiters(value: number, unit: VolumeUnit): number {
  return unit === 'mL' ? value / 1000 : value;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * 0.45359237 : value;
}

export function urrPercentFromR(r: number): number {
  return 100 * (1 - r);
}

/**
 * Returns null when ln argument is non-positive (R − 0.008t ≤ 0).
 */
export function daugirdasKtv(
  r: number,
  tHours: number,
  ufLiters: number,
  weightKg: number,
): number | null {
  const arg = r - 0.008 * tHours;
  if (!(arg > 0) || !(weightKg > 0)) return null;
  return -Math.log(arg) + (4 - 3.5 * r) * (ufLiters / weightKg);
}

export function formatKtv(ktv: number): string {
  return ktv.toFixed(2);
}

export function formatUrr(urr: number): string {
  return urr.toFixed(1).replace(/\.0$/, '');
}

export function buildResult(
  r: number,
  ktv: number,
  urrPercent: number,
): KtvDaugirdasResult {
  return {
    r,
    ktv,
    urrPercent,
    formattedKtv: formatKtv(ktv),
    formattedUrr: formatUrr(urrPercent),
    disclaimer:
      'Educational single-pool second-generation Daugirdas Kt/V and URR only — not a dialysis prescription.',
  };
}
