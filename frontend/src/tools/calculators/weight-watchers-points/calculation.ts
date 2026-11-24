/**
 * Weight Watchers Points Calculator — UI stub
 * (engine commit replaces with published SmartPoints 2015–2021 math).
 */

import type {
  MassUnit,
  WeightWatchersPointsInput,
  WeightWatchersPointsResult,
} from './types';

export const SOURCE_NOTE =
  'Educational SmartPoints (2015–2021) estimate from calories, sugar, saturated fat, and protein — engine wiring pending.';

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

export function calculateWeightWatchersPoints(
  _input: WeightWatchersPointsInput,
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
  };
}
