/**
 * Revised Geneva Score — educational PE pretest probability (Le Gal et al. 2006).
 *
 * Weights (original revised Geneva):
 * - Age >65: 1
 * - Surgery or fracture within 1 month: 2
 * - Active malignancy: 2
 * - Previous DVT/PE: 3
 * - Heart rate 75–94: 3; ≥95: 5
 * - Unilateral lower-limb pain: 3
 * - Pain on lower-limb deep venous palpation AND unilateral edema: 4
 * - Hemoptysis: 2
 *
 * Two-level: ≤5 unlikely, ≥6 likely.
 * Three-level: 0–3 low, 4–10 intermediate, ≥11 high.
 *
 * Incidence wording mirrors common teaching summaries of derivation/validation
 * cohorts (Le Gal Ann Intern Med 2006; Klok and related validations) — population
 * context only, not an individual absolute risk or treatment order.
 */

import type {
  HeartRateBand,
  RevisedGenevaInput,
  RevisedGenevaResult,
  ThreeLevelBand,
  TwoLevelBand,
  YesNo,
} from './types';

export const SOURCE_LABEL =
  'Le Gal G et al. Prediction of pulmonary embolism in the emergency department: the revised Geneva score. Ann Intern Med. 2006;144(3):165–171. Two- and three-level cutoffs as commonly taught from that score.';

export const DISCLAIMER =
  'Educational revised Geneva pretest probability only. It does not diagnose or exclude PE, order imaging, or replace clinical judgment. Incidence figures are cohort estimates, not an individual’s absolute risk.';

function yn(v: YesNo): boolean {
  return v === 'yes';
}

export function heartRatePoints(band: HeartRateBand): number {
  if (band === '75to94') return 3;
  if (band === 'ge95') return 5;
  return 0;
}

/** Map a measured pulse (beats/min) onto the published HR bands (for tests). */
export function heartRateBandFromPulse(pulse: number): HeartRateBand | null {
  if (!Number.isFinite(pulse) || pulse <= 0) return null;
  if (pulse < 75) return 'under75';
  if (pulse <= 94) return '75to94';
  return 'ge95';
}

export function computeRevisedGenevaScore(input: RevisedGenevaInput): number {
  let score = 0;
  if (input.ageOver65) score += 1;
  if (input.surgeryOrFractureLastMonth) score += 2;
  if (input.activeMalignancy) score += 2;
  if (yn(input.priorDvtOrPe)) score += 3;
  score += heartRatePoints(input.heartRateBand);
  if (yn(input.unilateralLowerLimbPain)) score += 3;
  if (yn(input.deepVenousPainAndUnilateralEdema)) score += 4;
  if (yn(input.hemoptysis)) score += 2;
  return score;
}

export function twoLevelForScore(score: number): TwoLevelBand {
  return score <= 5 ? 'unlikely' : 'likely';
}

export function threeLevelForScore(score: number): ThreeLevelBand {
  if (score <= 3) return 'low';
  if (score <= 10) return 'intermediate';
  return 'high';
}

function twoLevelCopy(band: TwoLevelBand): { title: string; detail: string } {
  if (band === 'unlikely') {
    return {
      title: 'Pulmonary embolism unlikely.',
      detail:
        'The incidence of PE in this group can be expected to be around 10%. Check the D-dimer level.',
    };
  }
  return {
    title: 'Pulmonary embolism likely.',
    detail:
      'The incidence of PE in this group can be expected to be around 30%. Consider definitive imaging per local pathways.',
  };
}

function threeLevelCopy(band: ThreeLevelBand): {
  title: string;
  detail: string;
} {
  if (band === 'low') {
    return {
      title: 'The clinical probability of pulmonary embolism is low.',
      detail:
        'The incidence of PE in this group can be expected to be around 8–10%. Check the D-dimer level.',
    };
  }
  if (band === 'intermediate') {
    return {
      title: 'The clinical probability of pulmonary embolism is intermediate.',
      detail:
        'The incidence of PE in this group can be expected to be around 20–30%. Use D-dimer and/or imaging per local pathways.',
    };
  }
  return {
    title: 'The clinical probability of pulmonary embolism is high.',
    detail:
      'The incidence of PE in this group can be expected to be around 60% or higher. Imaging is typically prioritized over D-dimer alone.',
  };
}

export function calculateRevisedGeneva(
  input: RevisedGenevaInput,
): RevisedGenevaResult {
  const score = computeRevisedGenevaScore(input);
  const twoLevel = twoLevelForScore(score);
  const threeLevel = threeLevelForScore(score);
  const two = twoLevelCopy(twoLevel);
  const three = threeLevelCopy(threeLevel);

  return {
    score,
    formattedScore: String(score),
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
