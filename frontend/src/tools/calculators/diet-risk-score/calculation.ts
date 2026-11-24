/**
 * Diet Risk Score (DRS) — Johnston et al., BMJ Nutr Prev Health 2020 (ADR-018).
 *
 * Nine food-frequency items, 0–27 total; tertiles: 0–8 low, 9–18 moderate, 19–27 high.
 */

import { DRS_SCORE_MATRIX } from './scoring-data';
import type {
  DietRiskBand,
  DietRiskItemId,
  DietRiskScoreInput,
  DietRiskScoreResult,
} from './types';
import { DIET_RISK_ITEMS } from './types';

export const DRS_MIN = 0;
export const DRS_MAX = 27;

export const SOURCE_NOTE =
  'Nine-item Diet Risk Score (Johnston KP et al. BMJ Nutr Prev Health 2020;3:e001094). Range 0 (low) to 27 (high cardiometabolic dietary risk). Tertiles: 0–8 low, 9–18 moderate, 19–27 high.';

export const DISCLAIMER =
  'Educational diet screener — not medical nutrition therapy or a clinical diagnosis.';

const ITEM_IDS = DIET_RISK_ITEMS.map((i) => i.id);

export function scoreForItem(
  item: DietRiskItemId,
  frequency: NonNullable<DietRiskScoreInput[DietRiskItemId]>,
): number {
  return DRS_SCORE_MATRIX[item][frequency];
}

export function riskBandForTotal(total: number): DietRiskBand {
  if (total <= 8) return 'low';
  if (total <= 18) return 'moderate';
  return 'high';
}

export function riskLabelForBand(band: DietRiskBand): string {
  switch (band) {
    case 'low':
      return 'Low dietary risk (0–8)';
    case 'moderate':
      return 'Moderate dietary risk (9–18)';
    case 'high':
      return 'High dietary risk (19–27)';
    default:
      return '';
  }
}

export function calculateDietRiskScore(input: DietRiskScoreInput): DietRiskScoreResult {
  const unanswered: DietRiskItemId[] = [];
  const itemScores: Partial<Record<DietRiskItemId, number>> = {};
  let total = 0;

  for (const id of ITEM_IDS) {
    const freq = input[id];
    if (freq === null) {
      unanswered.push(id);
      continue;
    }
    const pts = scoreForItem(id, freq);
    itemScores[id] = pts;
    total += pts;
  }

  const complete = unanswered.length === 0;

  if (!complete) {
    return {
      totalScore: null,
      formattedScore: '',
      riskBand: null,
      riskLabel: '',
      complete: false,
      unansweredItems: unanswered,
      itemScores,
      statusHeadline: 'Answer all questions',
      statusDetail: 'Select a frequency for each food group to calculate the Diet Risk Score.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const band = riskBandForTotal(total);

  return {
    totalScore: total,
    formattedScore: String(total),
    riskBand: band,
    riskLabel: riskLabelForBand(band),
    complete: true,
    unansweredItems: [],
    itemScores,
    statusHeadline: riskLabelForBand(band),
    statusDetail: `Total Diet Risk Score = ${total} of ${DRS_MAX} (range ${DRS_MIN}–${DRS_MAX}).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

const RISK_ITEM_IDS: DietRiskItemId[] = [
  'fast_food',
  'breads',
  'snacks',
  'processed_meats',
  'sweet_drinks',
];
const BENEFICIAL_ITEM_IDS: DietRiskItemId[] = [
  'nuts',
  'fish',
  'vegetables',
  'fruit',
];

/** Published profile bounds for tests (worst / best dietary pattern). */
export function minimumDrsTotal(): number {
  const riskNever = RISK_ITEM_IDS.reduce(
    (sum, id) => sum + DRS_SCORE_MATRIX[id].never,
    0,
  );
  const beneficialDaily = BENEFICIAL_ITEM_IDS.reduce(
    (sum, id) => sum + DRS_SCORE_MATRIX[id].daily,
    0,
  );
  return riskNever + beneficialDaily;
}

export function maximumDrsTotal(): number {
  const riskDaily = RISK_ITEM_IDS.reduce(
    (sum, id) => sum + DRS_SCORE_MATRIX[id].daily,
    0,
  );
  const beneficialNever = BENEFICIAL_ITEM_IDS.reduce(
    (sum, id) => sum + DRS_SCORE_MATRIX[id].never,
    0,
  );
  return riskDaily + beneficialNever;
}