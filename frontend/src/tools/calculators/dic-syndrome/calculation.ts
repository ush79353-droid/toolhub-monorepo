/**
 * ISTH overt DIC score — educational (ADR-018).
 *
 * Source: Taylor FB Jr et al. Towards definition, clinical and laboratory criteria,
 * and a scoring system for disseminated intravascular coagulation. Thromb Haemost.
 * 2001;86(5):1327–1330 (ISTH overt DIC algorithm).
 *
 * Score ≥ 5 in a patient with an underlying disorder compatible with DIC
 * suggests overt DIC — not exclusion when lower.
 */

import type {
  DicSyndromeInput,
  DicSyndromeResult,
  FibrinMarkerBand,
  FibrinogenBand,
  PlateletBand,
  PtProlongationBand,
} from './types';

export const OVERT_DIC_THRESHOLD = 5;

export const SOURCE_NOTE =
  'ISTH overt DIC score (Taylor et al., Thromb Haemost 2001): platelets, fibrin-related markers, PT prolongation vs control, and fibrinogen. Total ≥ 5 suggests overt DIC in an appropriate clinical setting — a lower score does not exclude DIC.';

export const DISCLAIMER =
  'Educational coagulation score only. Does not diagnose DIC, trigger treatment, or replace hematology consultation.';

export function plateletPoints(band: PlateletBand): number {
  switch (band) {
    case 'gt100':
      return 0;
    case '50to100':
      return 1;
    case 'lt50':
      return 2;
    default:
      return 0;
  }
}

export function fibrinMarkerPoints(band: FibrinMarkerBand): number {
  switch (band) {
    case 'no_increase':
      return 0;
    case 'moderate_increase':
      return 2;
    case 'strong_increase':
      return 3;
    default:
      return 0;
  }
}

export function ptProlongationPoints(band: PtProlongationBand): number {
  switch (band) {
    case 'lt3':
      return 0;
    case '3to6':
      return 1;
    case 'gt6':
      return 2;
    default:
      return 0;
  }
}

export function fibrinogenPoints(band: FibrinogenBand): number {
  return band === 'lt1' ? 1 : 0;
}

export function computeIsthDicScore(input: DicSyndromeInput): number {
  return (
    plateletPoints(input.platelets) +
    fibrinMarkerPoints(input.fibrinMarkers) +
    ptProlongationPoints(input.ptProlongation) +
    fibrinogenPoints(input.fibrinogen)
  );
}

export function calculateDicSyndrome(input: DicSyndromeInput): DicSyndromeResult {
  const plateletPts = plateletPoints(input.platelets);
  const fibrinPts = fibrinMarkerPoints(input.fibrinMarkers);
  const ptPts = ptProlongationPoints(input.ptProlongation);
  const fibrinogenPts = fibrinogenPoints(input.fibrinogen);
  const score = plateletPts + fibrinPts + ptPts + fibrinogenPts;
  const meetsOvert = score >= OVERT_DIC_THRESHOLD;

  const interpretation = meetsOvert
    ? `Score ${score} ≥ ${OVERT_DIC_THRESHOLD}: compatible with overt DIC when an underlying disorder is present. Clinical correlation required.`
    : `Score ${score} < ${OVERT_DIC_THRESHOLD}: does not meet ISTH overt DIC threshold — DIC is not excluded.`;

  return {
    score,
    formattedScore: String(score),
    plateletPoints: plateletPts,
    fibrinMarkerPoints: fibrinPts,
    ptPoints: ptPts,
    fibrinogenPoints: fibrinogenPts,
    meetsOvertThreshold: meetsOvert,
    interpretation,
    statusHeadline: meetsOvert ? 'Meets overt DIC threshold' : 'Below overt DIC threshold',
    statusDetail: interpretation,
    disclaimer: DISCLAIMER,
    sourceNote: SOURCE_NOTE,
  };
}