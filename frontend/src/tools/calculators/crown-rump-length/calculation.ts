/**
 * Crown-rump Length → gestational age (educational first-trimester dating).
 *
 * Robinson HP, Fleming JE. Br J Obstet Gynaecol. 1975;82:702–710
 * candidate equation confirmed in the task brief:
 *   GA (days) = 8.052 × √(CRL_mm) + 23.73
 *
 * Total days are rounded once, then split into weeks + remainder days.
 * Scope: first-trimester CRL only (no extrapolation beyond published bounds).
 */

import type {
  CrownRumpLengthInput,
  CrownRumpLengthResult,
  CrlUnit,
  GaDisplayUnit,
} from './types';

export const SOURCE_LABEL =
  'Robinson HP, Fleming JE. A critical evaluation of sonar “crown-rump length” measurements. Br J Obstet Gynaecol. 1975;82:702–710 (GA days = 8.052×√CRL_mm + 23.73).';

export const DISCLAIMER =
  'Educational first-trimester CRL dating only. It does not replace clinical ultrasound interpretation or ACOG redating decisions. After ~14 weeks, CRL is less reliable — use biometry tools such as fetal weight percentile.';

/** Robinson–Fleming coefficients (CRL in mm → menstrual GA days). */
export const ROBINSON_SQRT_COEFF = 8.052;
export const ROBINSON_INTERCEPT = 23.73;

/** Inclusive educational CRL bounds (mm). Below: too early; above: use other biometry. */
export const MIN_CRL_MM = 5;
export const MAX_CRL_MM = 84;

export function crlToMm(value: number, unit: CrlUnit): number | null {
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

export function mmToCrlUnit(mm: number, unit: CrlUnit): number {
  switch (unit) {
    case 'cm':
      return mm / 10;
    case 'in':
      return mm / 25.4;
    default:
      return mm;
  }
}

/**
 * Robinson–Fleming continuous model. Returns null outside supported CRL range
 * (no extrapolation).
 */
export function gestationalAgeDaysFromCrlMm(crlMm: number): number | null {
  if (!Number.isFinite(crlMm)) return null;
  if (crlMm < MIN_CRL_MM || crlMm > MAX_CRL_MM) return null;
  const days =
    ROBINSON_SQRT_COEFF * Math.sqrt(crlMm) + ROBINSON_INTERCEPT;
  if (!Number.isFinite(days)) return null;
  return Math.round(days);
}

export function splitGestationalAge(totalDays: number): {
  weeks: number;
  days: number;
} {
  const clamped = Math.max(0, Math.floor(totalDays));
  return { weeks: Math.floor(clamped / 7), days: clamped % 7 };
}

export function formatGestationalAge(
  totalDays: number,
  display: GaDisplayUnit
): string {
  if (display === 'days') return `${totalDays} days`;
  const { weeks, days } = splitGestationalAge(totalDays);
  return `${weeks} wks · ${days} days`;
}

export function calculateCrownRumpLength(
  input: CrownRumpLengthInput,
  crlMm: number,
  gaDays: number
): CrownRumpLengthResult {
  const { weeks, days } = splitGestationalAge(gaDays);
  return {
    crlMm,
    gestationalAgeDays: gaDays,
    weeks,
    daysRemainder: days,
    formattedCrl: `${crlMm.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      useGrouping: false,
    })} mm`,
    formattedGestationalAge: formatGestationalAge(gaDays, input.gaDisplayUnit),
    explanation: `Robinson–Fleming: GA days = ${ROBINSON_SQRT_COEFF} × √(${crlMm} mm) + ${ROBINSON_INTERCEPT} → ${gaDays} days (${weeks} wks · ${days} days), rounded once.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
