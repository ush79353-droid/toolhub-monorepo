/**
 * LV Calculator — ASE cube-formula linear LV mass (educational).
 *
 * Convert LVEDD, IVSd, PWd to cm, then:
 *   LVM (g) = 0.8 × 1.04 × [(LVEDD+IVSd+PWd)³ − LVEDD³] + 0.6
 *   LVMI = LVM / BSA
 *   RWT = 2 × PWd / LVEDD  (same unit)
 *
 * BSA: entered m², or Mosteller √(height_cm × weight_kg / 3600).
 * Sex is used only for ASE/EACVI-style reference labeling, not the mass formula.
 *
 * Source: Lang et al. ASE chamber quantification (JASE 2015) / Devereux cube formula.
 */

import type { DimensionUnit, Sex } from './types';

export const SOURCE_LABEL =
  'ASE recommended cube formula for linear LV mass (Devereux); Mosteller BSA when height/weight used. Educational ranges only.';

export const DISCLAIMER =
  'Educational echocardiographic arithmetic only. Not a diagnosis of hypertrophy or a treatment recommendation.';

export function mostellerBsaM2(heightCm: number, weightKg: number): number {
  return Math.sqrt((heightCm * weightKg) / 3600);
}

export function toCm(value: number, unit: DimensionUnit): number {
  return unit === 'mm' ? value / 10 : value;
}

export function fromCm(cm: number, unit: DimensionUnit): number {
  return unit === 'mm' ? cm * 10 : cm;
}

/** ASE linear method; dimensions must be cm. */
export function aseLvMassG(lveddCm: number, ivsdCm: number, pwdCm: number): number {
  const cube =
    Math.pow(lveddCm + ivsdCm + pwdCm, 3) - Math.pow(lveddCm, 3);
  return 0.8 * 1.04 * cube + 0.6;
}

export function relativeWallThickness(pwd: number, lvedd: number): number {
  return (2 * pwd) / lvedd;
}

/** ASE approximate LVMI cutoffs (g/m²): women >95, men >115. */
export function lvmiCategory(lvmi: number, sex: Sex): string {
  const cut = sex === 'female' ? 95 : 115;
  if (lvmi > cut) return `Above common ASE LVMI reference (>${cut} g/m² for ${sex})`;
  return `Within common ASE LVMI reference (≤${cut} g/m² for ${sex})`;
}

/** RWT > 0.42 often labeled concentric geometry. */
export function rwtCategory(rwt: number): string {
  if (rwt > 0.42) return 'RWT > 0.42 (common concentric geometry threshold)';
  return 'RWT ≤ 0.42 (common normal / eccentric geometry threshold)';
}

export function calculateLv(params: {
  sex: Sex;
  bsaM2: number;
  lveddCm: number;
  ivsdCm: number;
  pwdCm: number;
}): {
  lvMassG: number;
  lvmiGPerM2: number;
  rwt: number;
  bsaM2: number;
  formattedMass: string;
  formattedLvmi: string;
  formattedRwt: string;
  massIndexCategory: string;
  rwtCategory: string;
  explanation: string;
  disclaimer: string;
} {
  const mass = aseLvMassG(params.lveddCm, params.ivsdCm, params.pwdCm);
  const lvmi = mass / params.bsaM2;
  const rwt = relativeWallThickness(params.pwdCm, params.lveddCm);

  const massR = Math.round(mass * 10) / 10;
  const lvmiR = Math.round(lvmi * 10) / 10;
  const rwtR = Math.round(rwt * 1000) / 1000;

  return {
    lvMassG: massR,
    lvmiGPerM2: lvmiR,
    rwt: rwtR,
    bsaM2: params.bsaM2,
    formattedMass: String(massR),
    formattedLvmi: String(lvmiR),
    formattedRwt: String(rwtR),
    massIndexCategory: lvmiCategory(lvmiR, params.sex),
    rwtCategory: rwtCategory(rwtR),
    explanation: `ASE cube LVM = 0.8×1.04×[(${params.lveddCm}+${params.ivsdCm}+${params.pwdCm})³−${params.lveddCm}³]+0.6 → ${massR} g; LVMI = ${massR}/${params.bsaM2} → ${lvmiR} g/m²; RWT = 2×${params.pwdCm}/${params.lveddCm} → ${rwtR}.`,
    disclaimer: DISCLAIMER,
  };
}
