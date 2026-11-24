/**
 * BUN / creatinine ratio — pure engine (ADR-018).
 *
 * ratio = BUN_mg/dL ÷ creatinine_mg/dL (dimensionless)
 *
 * Unit conversions (before ratio):
 * - BUN already mg/dL nitrogen → unchanged
 * - urea mmol/L → BUN mg/dL: × 2.8  (≡ ÷ 0.357; Acute Care Testing)
 * - urea mg/dL (whole molecule) → BUN mg/dL: × (28/60)
 * - creatinine µmol/L → mg/dL: ÷ 88.4
 *
 * Fixture: BUN 20 mg/dL, creatinine 1 mg/dL → 20.
 */

import type {
  BunCreatinineRatioInput,
  BunCreatinineRatioResult,
  BunUnit,
  CreatinineUnit,
} from './types';

export const SOURCE_NOTE =
  'BUN/creatinine ratio = BUN (mg/dL) ÷ serum creatinine (mg/dL). Urea mmol/L → BUN mg/dL ×2.8; urea mg/dL → BUN ×28/60; creatinine µmol/L → mg/dL ÷88.4. Educational bands ≈10–20 (Acute Care Testing / common textbook cut-off 20).';

export const DISCLAIMER =
  'Educational worksheet only — not a laboratory report, AKI diagnosis, or treatment recommendation. Confirm with clinical context and your laboratory.';

/** Conventional factor: urea mmol/L × 2.8 = BUN mg/dL. */
export const UREA_MMOL_L_TO_BUN_MG_DL = 2.8;

/** Nitrogen mass / urea mass = 28/60. */
export const UREA_MG_DL_TO_BUN_MG_DL = 28 / 60;

/** µmol/L → mg/dL creatinine. */
export const CREATININE_UMOL_L_PER_MG_DL = 88.4;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function bunToMgDl(value: number, unit: BunUnit): number {
  if (unit === 'mmol_l_urea') return value * UREA_MMOL_L_TO_BUN_MG_DL;
  if (unit === 'mg_dl_urea') return value * UREA_MG_DL_TO_BUN_MG_DL;
  return value;
}

export function bunFromMgDl(mgDl: number, unit: BunUnit): number {
  if (unit === 'mmol_l_urea') return mgDl / UREA_MMOL_L_TO_BUN_MG_DL;
  if (unit === 'mg_dl_urea') return mgDl / UREA_MG_DL_TO_BUN_MG_DL;
  return mgDl;
}

export function creatinineToMgDl(
  value: number,
  unit: CreatinineUnit,
): number {
  return unit === 'umol_l' ? value / CREATININE_UMOL_L_PER_MG_DL : value;
}

export function creatinineFromMgDl(
  mgDl: number,
  unit: CreatinineUnit,
): number {
  return unit === 'umol_l' ? mgDl * CREATININE_UMOL_L_PER_MG_DL : mgDl;
}

export function bunCreatinineRatio(
  bunMgDl: number,
  creatinineMgDl: number,
): number {
  if (!(creatinineMgDl > 0)) {
    throw new Error('Creatinine must be greater than zero.');
  }
  return bunMgDl / creatinineMgDl;
}

/** Educational adult teaching bands; not diagnostic. */
export function interpretRatio(ratio: number): string {
  if (ratio < 10) return 'Low (<10)';
  if (ratio <= 20) return 'Typical (10–20)';
  return 'High (>20)';
}

export function formatMeasure(value: number | null, digits = 4): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatRatio(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function calculateBunCreatinineRatio(
  input: BunCreatinineRatioInput,
): BunCreatinineRatioResult {
  const empty = {
    bunMgDl: null,
    creatinineMgDl: null,
    ratio: null,
    bandLabel: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const bunRaw = parseNumber(input.bunText);
  const crRaw = parseNumber(input.creatinineText);

  if (bunRaw === null && crRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter BUN and serum creatinine',
      statusDetail:
        'Enter both values. Units convert to mg/dL before the ratio is computed.',
    };
  }

  if (bunRaw === null || crRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter both lab values',
      statusDetail:
        'BUN/urea and serum creatinine are both required. Missing values leave the ratio blank.',
    };
  }

  if (!(bunRaw >= 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid BUN',
      statusDetail: 'BUN/urea must be non-negative.',
    };
  }

  if (!(crRaw >= 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid creatinine',
      statusDetail: 'Serum creatinine must be non-negative.',
    };
  }

  const bunMgDl = bunToMgDl(bunRaw, input.bunUnit);
  const creatinineMgDl = creatinineToMgDl(crRaw, input.creatinineUnit);

  if (!(creatinineMgDl > 0)) {
    return {
      bunMgDl,
      creatinineMgDl,
      ratio: null,
      bandLabel: null,
      statusHeadline: 'Ratio undefined',
      statusDetail:
        'Creatinine is zero after unit conversion — the ratio denominator must be greater than zero (distinct from a missing value).',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const ratio = bunCreatinineRatio(bunMgDl, creatinineMgDl);
  const rounded = Math.round(ratio * 100) / 100;
  const band = interpretRatio(rounded);

  return {
    bunMgDl,
    creatinineMgDl,
    ratio: rounded,
    bandLabel: band,
    statusHeadline: 'BUN creatinine ratio',
    statusDetail: `BUN ${formatMeasure(bunMgDl, 2)} mg/dL ÷ creatinine ${formatMeasure(creatinineMgDl, 2)} mg/dL = ${formatRatio(rounded)} (${band}). Educational only.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
