/**
 * Weight Watcher Points — educational SmartPoints food score (ADR-018).
 *
 * Stub for UI commit: returns incomplete empty-state only.
 * Engine commit replaces with published SmartPoints (2015–2021) coefficients.
 */

import type {
  WeightWatcherPointsInput,
  WeightWatcherPointsResult,
} from './types';

export const SOURCE_NOTE =
  'Educational worksheet only. SmartPoints food scoring is wired in the engine commit from the publicly documented 2015–2021 coefficients.';

export const DISCLAIMER =
  'Educational nutrition worksheet — not affiliated with WW International, not medical advice, and not a substitute for the official WW app.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
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

/** UI stub — engine commit implements SmartPoints scoring. */
export function calculateWeightWatcherPoints(
  _input: WeightWatcherPointsInput,
): WeightWatcherPointsResult {
  return emptyIncomplete(
    'Enter calories, sugar, protein, and saturated fat. Smart points appear after the engine formula is wired.',
  );
}
