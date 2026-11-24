/**
 * Weight Watchers Points Calculator — pure engine (ADR-018).
 *
 * Educational SmartPoints food value (publicly documented 2015–2021 edition):
 *   raw = (calories × 0.0305) + (satFat_g × 0.275) + (sugar_g × 0.12) − (protein_g × 0.098)
 *   SmartPoints = max(0, round(raw))
 *
 * Screenshot nutrients match this edition (calories, sugar, protein, saturated fat).
 * Post-2021 WW algorithms are proprietary/unpublished and are not implemented.
 *
 * Serving basis: whatever amounts the user enters (single food, meal, or day totals).
 * Sources: publicly mirrored SmartPoints coefficients (e.g. exercise4weightloss /
 * Wikipedia GFDL mirrors of the pre-2022 formula). Not affiliated with WW International.
 */

import type {
  MassUnit,
  WeightWatchersPointsInput,
  WeightWatchersPointsResult,
} from './types';

/** Calories coefficient (kcal → points). */
export const COEF_CALORIES = 0.0305;
/** Saturated fat coefficient (g → points). */
export const COEF_SAT_FAT = 0.275;
/** Sugar coefficient (g → points). */
export const COEF_SUGAR = 0.12;
/** Protein coefficient (g → points); subtracted. */
export const COEF_PROTEIN = 0.098;

export const SOURCE_NOTE =
  'Educational SmartPoints (2015–2021) food formula: (kcal × 0.0305) + (sat fat g × 0.275) + (sugar g × 0.12) − (protein g × 0.098), rounded to nearest whole number, minimum 0. Later WW editions are unpublished and not used here.';

export const DISCLAIMER =
  'Educational nutrition worksheet only — not affiliated with WW International, not medical advice, and not a substitute for the official WW app.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatAmount(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const fixed = value.toFixed(digits).replace(/\.?0+$/, '');
  return fixed === '-0' ? '0' : fixed;
}

/** Convert entered mass to grams. */
export function toGrams(amount: number, unit: MassUnit): number {
  return unit === 'mg' ? amount / 1000 : amount;
}

/** Convert grams to display unit. */
export function fromGrams(grams: number, unit: MassUnit): number {
  return unit === 'mg' ? grams * 1000 : grams;
}

/**
 * Core SmartPoints arithmetic on grams + kcal.
 * Returns unrounded raw and max(0, round(raw)).
 */
export function computeSmartPoints(args: {
  caloriesKcal: number;
  sugarG: number;
  proteinG: number;
  saturatedFatG: number;
}): { raw: number; smartPoints: number } {
  const raw =
    args.caloriesKcal * COEF_CALORIES +
    args.saturatedFatG * COEF_SAT_FAT +
    args.sugarG * COEF_SUGAR -
    args.proteinG * COEF_PROTEIN;
  return {
    raw,
    smartPoints: Math.max(0, Math.round(raw)),
  };
}

function emptyResult(
  partial?: Partial<WeightWatchersPointsResult>,
): WeightWatchersPointsResult {
  return {
    smartPoints: null,
    rawPoints: null,
    caloriesKcal: null,
    sugarG: null,
    proteinG: null,
    saturatedFatG: null,
    statusHeadline: 'Enter calories',
    statusDetail:
      'Enter calories (kcal) plus sugar, protein, and saturated fat from a nutrition label to estimate SmartPoints.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateWeightWatchersPoints(
  input: WeightWatchersPointsInput,
): WeightWatchersPointsResult {
  const calories = parseNumber(input.caloriesText);
  if (calories === null) {
    return emptyResult();
  }

  const sugarRaw = parseNumber(input.sugarText);
  const proteinRaw = parseNumber(input.proteinText);
  const satRaw = parseNumber(input.saturatedFatText);

  // Blank optional macros treat as 0 so a calories-only estimate still works.
  const sugarG = sugarRaw === null ? 0 : toGrams(sugarRaw, input.sugarUnit);
  const proteinG =
    proteinRaw === null ? 0 : toGrams(proteinRaw, input.proteinUnit);
  const saturatedFatG =
    satRaw === null ? 0 : toGrams(satRaw, input.saturatedFatUnit);

  const { raw, smartPoints } = computeSmartPoints({
    caloriesKcal: calories,
    sugarG,
    proteinG,
    saturatedFatG,
  });

  return {
    smartPoints,
    rawPoints: raw,
    caloriesKcal: calories,
    sugarG,
    proteinG,
    saturatedFatG,
    statusHeadline: 'Smart points',
    statusDetail: `Educational SmartPoints ≈ ${smartPoints} (raw ${formatAmount(raw, 3)}).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
