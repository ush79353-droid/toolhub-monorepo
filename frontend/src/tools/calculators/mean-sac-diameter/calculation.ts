/**
 * Mean Sac Diameter — early intrauterine sac sizing (educational).
 *
 * MSD = (length + width + height) / 3 in mm (inner fluid–fluid diameters).
 * Approximate menstrual GA (days) ≈ MSD_mm + 30 (Hellman / Nyberg teaching).
 *
 * Age output is enabled only while MSD is in the early educational window
 * commonly cited before CRL dating takes over (SOGC: MSD less reliable when
 * MSD exceeds ~14 mm or an embryo is visible). Label as approximate — does
 * not infer viability or set a clinical due date.
 *
 * Sources: Hellman et al. early sac dating summaries; Nyberg DA et al.
 * Ultrasonographic dating of very early pregnancy (MSD≤15 mm teaching);
 * SOGC No. 303 (2014) on MSD limits vs CRL.
 */

import type {
  GaDisplayUnit,
  MeanSacDiameterInput,
  MeanSacDiameterResult,
  SacDimUnit,
} from './types';

export const SOURCE_LABEL =
  'MSD = (L+W+H)/3 mm; approximate GA days ≈ MSD + 30 (Hellman/Nyberg early-pregnancy teaching). Age gated to early MSD window per SOGC guidance that MSD is less reliable once >~14 mm or CRL is visible.';

export const DISCLAIMER =
  'Educational early gestational-sac sizing only. Approximate dating — not a viability assessment and not a clinical due date. Prefer crown–rump length once an embryo is measurable.';

/** Inclusive educational window for enabling MSD+30 age (mm). */
export const MIN_MSD_FOR_AGE_MM = 2;
/** Nyberg early-pregnancy teaching used MSD ≤15 mm; SOGC notes declining reliability beyond ~14 mm. */
export const MAX_MSD_FOR_AGE_MM = 15;

export function dimToMm(value: number, unit: SacDimUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  switch (unit) {
    case 'mm':
      return value;
    case 'cm':
      return value * 10;
    case 'in':
      return value * 25.4;
    default:
      return null;
  }
}

export function mmToDimUnit(mm: number, unit: SacDimUnit): number {
  switch (unit) {
    case 'cm':
      return mm / 10;
    case 'in':
      return mm / 25.4;
    default:
      return mm;
  }
}

export function meanSacDiameterMm(
  lengthMm: number,
  widthMm: number,
  heightMm: number
): number | null {
  if (
    !Number.isFinite(lengthMm) ||
    !Number.isFinite(widthMm) ||
    !Number.isFinite(heightMm)
  ) {
    return null;
  }
  if (lengthMm < 0 || widthMm < 0 || heightMm < 0) return null;
  return (lengthMm + widthMm + heightMm) / 3;
}

/** Hellman/Nyberg teaching: GA_days ≈ MSD_mm + 30. */
export function approximateGaDaysFromMsdMm(msdMm: number): number | null {
  if (!Number.isFinite(msdMm)) return null;
  if (msdMm < MIN_MSD_FOR_AGE_MM || msdMm > MAX_MSD_FOR_AGE_MM) return null;
  return Math.round(msdMm + 30);
}

export function splitGestationalAge(totalDays: number): {
  weeks: number;
  days: number;
} {
  const clamped = Math.max(0, Math.floor(totalDays));
  return { weeks: Math.floor(clamped / 7), days: clamped % 7 };
}

export function formatGa(
  totalDays: number,
  unit: GaDisplayUnit
): string {
  if (unit === 'days') return String(totalDays);
  const { weeks, days } = splitGestationalAge(totalDays);
  return `${weeks}w ${days}d`;
}

export function calculateMeanSacDiameter(
  input: Pick<MeanSacDiameterInput, 'msdDisplayUnit' | 'gaDisplayUnit'>,
  lengthMm: number,
  widthMm: number,
  heightMm: number
): MeanSacDiameterResult | null {
  const msdMm = meanSacDiameterMm(lengthMm, widthMm, heightMm);
  if (msdMm == null) return null;

  const msdDisplay = mmToDimUnit(msdMm, input.msdDisplayUnit);
  const gaDays = approximateGaDaysFromMsdMm(msdMm);
  const ageInRange = gaDays != null;
  const split = gaDays != null ? splitGestationalAge(gaDays) : null;

  const fmtMsd = String(
    Number(msdDisplay.toFixed(input.msdDisplayUnit === 'mm' ? 2 : 4))
  );

  return {
    lengthMm,
    widthMm,
    heightMm,
    msdMm,
    msdDisplay,
    gestationalAgeDays: gaDays,
    weeks: split?.weeks ?? null,
    daysRemainder: split?.days ?? null,
    ageInRange,
    formattedMsd: fmtMsd,
    formattedGestationalAge:
      gaDays != null ? formatGa(gaDays, input.gaDisplayUnit) : '',
    explanation: ageInRange
      ? `MSD = (${fmtDim(lengthMm)} + ${fmtDim(widthMm)} + ${fmtDim(heightMm)}) / 3 = ${fmtDim(msdMm)} mm. Approximate menstrual age ≈ MSD + 30 → ${gaDays} days (educational; ± several days).`
      : `MSD = ${fmtDim(msdMm)} mm. Approximate age (MSD + 30) is withheld outside the early educational window (${MIN_MSD_FOR_AGE_MM}–${MAX_MSD_FOR_AGE_MM} mm); use CRL dating once an embryo is measurable.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}

function fmtDim(mm: number): string {
  return String(Number(mm.toFixed(2)));
}
