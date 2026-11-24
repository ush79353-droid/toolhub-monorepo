/**
 * Katch–McArdle Calculator — basal metabolic rate (ADR-018).
 *
 * UI commit stub — real formulas land in the engine commit.
 */

import type { KatchMcardleInput, KatchMcardleResult } from './types';

export const SOURCE_NOTE =
  'Katch–McArdle BMR = 370 + 21.6 × LBM (kg); unknown LBM uses Boer (1984). Educational estimate only.';

export const DISCLAIMER =
  'Educational resting-energy estimate — not individualized medical nutrition therapy.';

export const EQUATION_LABEL = 'Katch–McArdle (LBM-based BMR)';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: 'cm' | 'in'): number {
  return unit === 'cm' ? value : value * 2.54;
}

export function weightToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? value : value * 0.45359237;
}

export function formatBmrKcal(kcalPerDay: number | null): string {
  if (kcalPerDay == null || !Number.isFinite(kcalPerDay)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(kcalPerDay));
}

export function formatLbmKg(lbmKg: number | null): string {
  if (lbmKg == null || !Number.isFinite(lbmKg)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(lbmKg);
}

export function emptyResult(
  headline = 'Enter lean mass or anthropometrics',
  detail = 'Choose how you know lean body mass, then complete the fields to estimate BMR.',
): KatchMcardleResult {
  return {
    lbmKg: null,
    lbmDisplay: '',
    bmrKcalPerDay: null,
    bmrDisplay: '',
    statusHeadline: headline,
    statusDetail: detail,
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** Stub — engine commit implements Katch–McArdle + Boer / body-fat LBM. */
export function calculateKatchMcardle(
  _input: KatchMcardleInput,
): KatchMcardleResult {
  return emptyResult();
}
