/**
 * Bishop Score — classic pelvic scoring for elective induction (Bishop EH, 1964).
 *
 * Educational sum of five cervical/station findings (range 0–13). Does not
 * recommend induction, predict success, or replace clinical judgement.
 *
 * Sources: Bishop EH. Obstet Gynecol. 1964;24:266–268; AAFP AFP 2022 Table 2;
 * StatPearls “Bishop Score” (NBK470368).
 */

import type {
  BishopScoreBreakdown,
  BishopScoreInput,
  BishopScoreResult,
  CervicalPositionBand,
  ConsistencyBand,
  DilationUnit,
  EffacementBand,
  StationBand,
} from './types';

export const SOURCE_LABEL =
  'Bishop EH. Pelvic scoring for elective induction. Obstet Gynecol. 1964;24:266–268 (classic table as summarized in AAFP AFP 2022;105(2):177–186).';

export const DISCLAIMER =
  'Educational cervical-exam score only. It does not recommend induction, predict labor outcome, or replace bedside assessment by a qualified clinician.';

/** Max dilation considered for scoring (beyond this is rejected). */
export const MAX_DILATION_CM = 10;

export function dilationToCm(value: number, unit: DilationUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  switch (unit) {
    case 'cm':
      return value;
    case 'mm':
      return value / 10;
    default:
      return null;
  }
}

export function cmToDilationUnit(cm: number, unit: DilationUnit): number {
  return unit === 'mm' ? cm * 10 : cm;
}

/**
 * Classic dilation bands with continuous thresholds for decimals:
 * closed (&lt;1 cm) → 0; 1–&lt;3 → 1; 3–&lt;5 → 2; ≥5 → 3.
 */
export function scoreDilationCm(dilationCm: number): number | null {
  if (!Number.isFinite(dilationCm) || dilationCm < 0) return null;
  if (dilationCm > MAX_DILATION_CM) return null;
  if (dilationCm < 1) return 0;
  if (dilationCm < 3) return 1;
  if (dilationCm < 5) return 2;
  return 3;
}

export const EFFACEMENT_POINTS: Record<EffacementBand, number> = {
  '0-30': 0,
  '40-50': 1,
  '60-70': 2,
  '80+': 3,
};

export const CONSISTENCY_POINTS: Record<ConsistencyBand, number> = {
  firm: 0,
  moderatelyFirm: 1,
  soft: 2,
};

export const STATION_POINTS: Record<StationBand, number> = {
  minus3: 0,
  minus2: 1,
  minus1Or0: 2,
  plus1Or2: 3,
};

export const POSITION_POINTS: Record<CervicalPositionBand, number> = {
  posterior: 0,
  mid: 1,
  anterior: 2,
};

export function buildBreakdown(
  dilationPoints: number,
  input: Pick<
    BishopScoreInput,
    'effacement' | 'consistency' | 'station' | 'position'
  >
): BishopScoreBreakdown {
  return {
    dilationPoints,
    effacementPoints: EFFACEMENT_POINTS[input.effacement],
    consistencyPoints: CONSISTENCY_POINTS[input.consistency],
    stationPoints: STATION_POINTS[input.station],
    positionPoints: POSITION_POINTS[input.position],
  };
}

export function sumBreakdown(b: BishopScoreBreakdown): number {
  return (
    b.dilationPoints +
    b.effacementPoints +
    b.consistencyPoints +
    b.stationPoints +
    b.positionPoints
  );
}

export function calculateBishopScore(
  input: BishopScoreInput,
  dilationCm: number,
  dilationPoints: number
): BishopScoreResult {
  const breakdown = buildBreakdown(dilationPoints, input);
  const totalScore = sumBreakdown(breakdown);

  return {
    totalScore,
    breakdown,
    dilationCm,
    formattedScore: String(totalScore),
    explanation: `Classic Bishop total = dilation (${breakdown.dilationPoints}) + effacement (${breakdown.effacementPoints}) + consistency (${breakdown.consistencyPoints}) + station (${breakdown.stationPoints}) + cervical position (${breakdown.positionPoints}) = ${totalScore} (range 0–13). The “baby's head position” control scores cervical position (posterior / mid / anterior), not fetal occiput presentation.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
