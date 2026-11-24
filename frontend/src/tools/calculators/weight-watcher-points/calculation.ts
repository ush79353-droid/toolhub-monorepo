/**
 * Weight Watcher Points — educational SmartPoints food score (ADR-018).
 *
 * Edition: historical SmartPoints food formula (≈ Dec 2015 – Nov 2021).
 * Not PersonalPoints / current WW app scoring (proprietary, personalized).
 *
 *   raw = 0.0305×kcal + 0.275×satFat_g + 0.12×sugar_g − 0.098×protein_g
 *   smartPoints = max(0, round(raw))
 *
 * Serving basis: one label serving (or the portion entered). Mass inputs are
 * normalized to grams before scoring. Round only at presentation (whole points).
 *
 * Not affiliated with WW International, Inc.
 */

import type {
  MassUnit,
  WeightWatcherPointsInput,
  WeightWatcherPointsResult,
} from './types';

/** Publicly documented SmartPoints food coefficients (2015–2021). */
export const COEF_KCAL = 0.0305;
export const COEF_SAT_FAT = 0.275;
export const COEF_SUGAR = 0.12;
export const COEF_PROTEIN = 0.098;

/** Avoirdupois ounce → grams. */
export const G_PER_OZ = 28.349523125;

export const SOURCE_NOTE =
  'Educational historical SmartPoints (2015–2021) food formula: points = round(0.0305×kcal + 0.275×sat fat g + 0.12×sugar g − 0.098×protein g), minimum 0. Not affiliated with WW; not PersonalPoints.';

export const DISCLAIMER =
  'Educational nutrition worksheet — not affiliated with WW International, not medical advice, and not a substitute for the official WW app.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toGrams(amount: number, unit: MassUnit): number {
  if (unit === 'g') return amount;
  if (unit === 'mg') return amount / 1000;
  return amount * G_PER_OZ;
}

export function fromGrams(grams: number, unit: MassUnit): number {
  if (unit === 'g') return grams;
  if (unit === 'mg') return grams * 1000;
  return grams / G_PER_OZ;
}

/**
 * Core SmartPoints arithmetic on already-normalized gram masses.
 * Returns unrounded raw and whole points floored at 0.
 */
export function computeSmartPoints(args: {
  caloriesKcal: number;
  sugarG: number;
  proteinG: number;
  saturatedFatG: number;
}): { rawPoints: number; smartPoints: number } {
  const rawPoints =
    COEF_KCAL * args.caloriesKcal +
    COEF_SAT_FAT * args.saturatedFatG +
    COEF_SUGAR * args.sugarG -
    COEF_PROTEIN * args.proteinG;
  const smartPoints = Math.max(0, Math.round(rawPoints));
  return { rawPoints, smartPoints };
}

function emptyIncomplete(detail: string): WeightWatcherPointsResult {
  return {
    caloriesKcal: null,
    sugarG: null,
    proteinG: null,
    saturatedFatG: null,
    rawPoints: null,
    smartPoints: null,
    statusHeadline: 'Enter nutrition facts',
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function calculateWeightWatcherPoints(
  input: WeightWatcherPointsInput,
): WeightWatcherPointsResult {
  const calories = parseNumber(input.caloriesText);
  const sugarRaw = parseNumber(input.sugarText);
  const proteinRaw = parseNumber(input.proteinText);
  const satRaw = parseNumber(input.saturatedFatText);

  if (
    calories === null ||
    sugarRaw === null ||
    proteinRaw === null ||
    satRaw === null
  ) {
    return emptyIncomplete(
      'Enter calories, sugar, protein, and saturated fat for one serving. Smart points stay blank until all four fields are filled.',
    );
  }

  const sugarG = toGrams(sugarRaw, input.sugarUnit);
  const proteinG = toGrams(proteinRaw, input.proteinUnit);
  const saturatedFatG = toGrams(satRaw, input.saturatedFatUnit);

  const { rawPoints, smartPoints } = computeSmartPoints({
    caloriesKcal: calories,
    sugarG,
    proteinG,
    saturatedFatG,
  });

  return {
    caloriesKcal: calories,
    sugarG,
    proteinG,
    saturatedFatG,
    rawPoints,
    smartPoints,
    statusHeadline: 'Smart points',
    statusDetail: `Historical SmartPoints for this serving: ${smartPoints} (unrounded ${rawPoints.toFixed(3)}).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
