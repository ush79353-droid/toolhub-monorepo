/**
 * PSA doubling time (serial measurements).
 *
 * For rising PSA₁ > 0, PSA₂ > PSA₁ over Δt days:
 *   DT = Δt × ln(2) / ln(PSA₂ / PSA₁)
 *
 * Optional (when enabled):
 *   absolute velocity = (PSA₂ − PSA₁) / Δt_years  (ng/mL per year)
 *   log slope = ln(PSA₂ / PSA₁) / Δt_years  (per year)
 */

import type { DoublingTimeUnit } from './types';

export const DAYS_PER_YEAR = 365.25;
export const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

export const SOURCE_LABEL =
  'Serial PSA doubling time DT = Δt·ln2/ln(PSA₂/PSA₁); optional absolute PSA velocity and natural-log slope per year (educational kinetics; not a treatment decision).';

export const DISCLAIMER =
  'Educational PSA kinetics worksheet only. It does not diagnose prostate cancer, stage disease, or replace urology follow-up. Do not use doubling-time cutoffs alone as a diagnosis.';

export function daysToDoublingUnit(days: number, unit: DoublingTimeUnit): number {
  if (unit === 'days') return days;
  if (unit === 'months') return days / DAYS_PER_MONTH;
  return days / DAYS_PER_YEAR;
}

export function formatNumber(n: number, digits = 2): string {
  return String(Number(n.toFixed(digits)));
}

export type PsaTrend = 'rising' | 'falling' | 'unchanged';

export interface PsaDoublingTimeCore {
  elapsedDays: number;
  trend: PsaTrend;
  doublingTimeDays: number | null;
  psaVelocityNgMlPerYear: number | null;
  logSlopePerYear: number | null;
}

export function calculatePsaKinetics(
  olderPsa: number,
  newerPsa: number,
  elapsedDays: number,
): PsaDoublingTimeCore | null {
  if (!(olderPsa > 0) || !Number.isFinite(newerPsa) || newerPsa < 0) return null;
  if (!Number.isFinite(elapsedDays) || elapsedDays <= 0) return null;

  let trend: PsaTrend = 'unchanged';
  if (newerPsa > olderPsa) trend = 'rising';
  else if (newerPsa < olderPsa) trend = 'falling';

  const ratio = newerPsa / olderPsa;
  const years = elapsedDays / DAYS_PER_YEAR;

  let doublingTimeDays: number | null = null;
  if (trend === 'rising' && ratio > 1) {
    doublingTimeDays = (elapsedDays * Math.LN2) / Math.log(ratio);
  }

  let psaVelocityNgMlPerYear: number | null = null;
  let logSlopePerYear: number | null = null;
  if (ratio > 0 && years > 0) {
    psaVelocityNgMlPerYear = (newerPsa - olderPsa) / years;
    if (ratio !== 1) {
      logSlopePerYear = Math.log(ratio) / years;
    } else {
      logSlopePerYear = 0;
    }
  }

  return {
    elapsedDays,
    trend,
    doublingTimeDays,
    psaVelocityNgMlPerYear,
    logSlopePerYear,
  };
}