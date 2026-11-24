/**
 * Wells PE Criteria — UI stub (engine commit replaces with published math).
 * Point weights and band cutoffs land in the engine phase.
 */

import type { WellsPeInput, WellsPeResult } from './types';

export const SOURCE_LABEL =
  'Wells PS et al. Derivation of a simple clinical model to categorize patients probability of pulmonary embolism: increasing the models utility with the SimpliRED D-dimer. Thromb Haemost. 2000;83(3):416–420. Two- and three-level cutoffs as commonly taught from Wells PE criteria.';

export const DISCLAIMER =
  'Educational Wells PE pretest score only. Classifications support evaluation and cannot independently rule out PE. Not a diagnosis, imaging order, or substitute for clinical judgment. Cohort incidence figures are teaching estimates, not an individual’s absolute risk.';

/** UI stub — always 0 until engine commit. */
export function calculateWellsPe(_input: WellsPeInput): WellsPeResult {
  return {
    score: 0,
    formattedScore: '0',
    twoLevel: 'unlikely',
    twoLevelTitle: 'Pulmonary embolism unlikely.',
    twoLevelDetail:
      'Proportion of patients with confirmed PE can be expected to be around 12% in this group.',
    threeLevel: 'low',
    threeLevelTitle: 'Low risk of pulmonary embolism.',
    threeLevelDetail:
      'Proportion of patients with confirmed PE can be expected to be around 10% in this group.',
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
