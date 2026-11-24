/**
 * Wells Criteria for Pulmonary Embolism — educational pretest probability
 * (Wells et al., Thromb Haemost 2000; two- and three-level cutoffs as taught).
 *
 * Published weights:
 * - Clinical signs/symptoms of DVT: 3
 * - Heart rate > 100: 1.5
 * - Immobilization ≥3 consecutive days or surgery in prior 4 weeks: 1.5
 * - Previous objectively diagnosed DVT/PE: 1.5
 * - Hemoptysis: 1
 * - Malignancy (treatment ongoing, within 6 months, or palliative): 1
 * - PE as likely as or more likely than an alternative diagnosis: 3
 *
 * Two-level: ≤4 unlikely, >4 likely.
 * Three-level: <2 low, 2–6 intermediate, >6 high.
 *
 * Incidence wording mirrors common teaching summaries of derivation/validation
 * cohorts — population context only, not an individual absolute risk or order.
 */

import type {
  ThreeLevelBand,
  TwoLevelBand,
  WellsPeInput,
  WellsPeResult,
} from './types';
import { FACTOR_OPTIONS } from './types';

export const SOURCE_LABEL =
  'Wells PS et al. Derivation of a simple clinical model to categorize patients probability of pulmonary embolism: increasing the models utility with the SimpliRED D-dimer. Thromb Haemost. 2000;83(3):416–420. Two- and three-level cutoffs as commonly taught from Wells PE criteria.';

export const DISCLAIMER =
  'Educational Wells PE pretest score only. Classifications support evaluation and cannot independently rule out PE. Not a diagnosis, imaging order, or substitute for clinical judgment. Cohort incidence figures are teaching estimates, not an individual’s absolute risk.';

/** Published criterion is strictly greater than 100 bpm (100 does not score). */
export function heartRateExceeds100(bpm: number): boolean {
  if (!Number.isFinite(bpm)) return false;
  return bpm > 100;
}

export function computeWellsPeScore(input: WellsPeInput): number {
  let score = 0;
  for (const factor of FACTOR_OPTIONS) {
    if (input[factor.key]) score += factor.points;
  }
  return score;
}

export function twoLevelForScore(score: number): TwoLevelBand {
  return score <= 4 ? 'unlikely' : 'likely';
}

export function threeLevelForScore(score: number): ThreeLevelBand {
  if (score < 2) return 'low';
  if (score <= 6) return 'intermediate';
  return 'high';
}

function formatScore(score: number): string {
  // Prefer "4.5" / "0" over noisy floats from 1.5 sums.
  if (Number.isInteger(score)) return String(score);
  return String(Math.round(score * 10) / 10);
}

function twoLevelCopy(band: TwoLevelBand): { title: string; detail: string } {
  if (band === 'unlikely') {
    return {
      title: 'Pulmonary embolism unlikely.',
      detail:
        'Proportion of patients with confirmed PE can be expected to be around 12% in this group.',
    };
  }
  return {
    title: 'Pulmonary embolism likely.',
    detail:
      'Proportion of patients with confirmed PE can be expected to be around 37% in this group.',
  };
}

function threeLevelCopy(band: ThreeLevelBand): {
  title: string;
  detail: string;
} {
  if (band === 'low') {
    return {
      title: 'Low risk of pulmonary embolism.',
      detail:
        'Proportion of patients with confirmed PE can be expected to be around 10% in this group.',
    };
  }
  if (band === 'intermediate') {
    return {
      title: 'Intermediate risk of pulmonary embolism.',
      detail:
        'Proportion of patients with confirmed PE can be expected to be around 30% in this group.',
    };
  }
  return {
    title: 'High risk of pulmonary embolism.',
    detail:
      'Proportion of patients with confirmed PE can be expected to be around 65% in this group.',
  };
}

export function calculateWellsPe(input: WellsPeInput): WellsPeResult {
  const score = computeWellsPeScore(input);
  const twoLevel = twoLevelForScore(score);
  const threeLevel = threeLevelForScore(score);
  const two = twoLevelCopy(twoLevel);
  const three = threeLevelCopy(threeLevel);

  return {
    score,
    formattedScore: formatScore(score),
    twoLevel,
    twoLevelTitle: two.title,
    twoLevelDetail: two.detail,
    threeLevel,
    threeLevelTitle: three.title,
    threeLevelDetail: three.detail,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
