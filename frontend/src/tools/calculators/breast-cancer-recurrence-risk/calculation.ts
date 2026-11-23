/**
 * O'Rourke predictive index for local recurrence after simple mastectomy.
 *
 * Source: O'Rourke S, Galea MH, Morgan D, et al. Local recurrence after simple
 * mastectomy. Br J Surg. 1994;81(3):386–389. PubMed 8173907.
 *
 * Cohort: 966 patients, simple mastectomy + node biopsy, no postoperative
 * irradiation or systemic adjuvant therapy; median follow-up ~7 years.
 * Local recurrence defined as histologically proven lesion in/deep to flaps.
 *
 * Additive factor weights and score→risk table as reproduced by educational
 * calculators citing that study (EBMcalc / JoDrugs). Educational only — not
 * for therapy decisions; modern practice differs (radiation, systemic Rx).
 */

import type {
  BreastCancerRecurrenceInput,
  BreastCancerRecurrenceResult,
  LviStatus,
  LymphNodeStatus,
  TumorGrade,
} from './types';

export const SOURCE_CITATION =
  "O'Rourke S et al. Local recurrence after simple mastectomy. Br J Surg. 1994;81(3):386–389.";

export const COHORT_NOTE =
  'Historical index from simple mastectomy without postoperative irradiation or systemic adjuvant therapy (median follow-up ~7 years). Local flap recurrence only — not distant metastasis. Modern care differs; educational lookup only.';

export const DISCLAIMER =
  'This tool can not replace the professional advice of a health care provider.';

export const GRADE_POINTS: Record<TumorGrade, number> = {
  I: 6,
  II: 12,
  III: 18,
};

export const LYMPH_NODE_POINTS: Record<LymphNodeStatus, number> = {
  negative: 6,
  positive: 12,
};

export const LVI_POINTS: Record<LviStatus, number> = {
  none: 4,
  present: 8,
};

/**
 * Published score → local recurrence risk %. Only the eight attainable totals
 * from the three factors appear; other scores are unsupported.
 */
export const SCORE_TO_RISK_PERCENT: Readonly<Record<number, number>> = {
  16: 8.5,
  20: 12.5,
  22: 15.8,
  26: 10,
  28: 15.5,
  32: 33,
  34: 38.5,
  38: 48,
};

export function isCompleteInput(
  input: BreastCancerRecurrenceInput
): input is BreastCancerRecurrenceInput & {
  grade: TumorGrade;
  lymphNodes: LymphNodeStatus;
  lvi: LviStatus;
} {
  return (
    input.grade !== null &&
    input.lymphNodes !== null &&
    input.lvi !== null
  );
}

export function computeRecurrenceScore(
  grade: TumorGrade,
  lymphNodes: LymphNodeStatus,
  lvi: LviStatus
): number {
  return GRADE_POINTS[grade] + LYMPH_NODE_POINTS[lymphNodes] + LVI_POINTS[lvi];
}

export function riskPercentForScore(score: number): number | null {
  if (!Number.isFinite(score)) return null;
  const risk = SCORE_TO_RISK_PERCENT[score];
  return risk === undefined ? null : risk;
}

export function formatRiskPercent(riskPercent: number): string {
  // Preserve published one-decimal figures (8.5, 15.8, …) and whole percents.
  if (Number.isInteger(riskPercent)) return `${riskPercent}%`;
  return `${riskPercent.toFixed(1)}%`;
}

export function calculateBreastCancerRecurrenceRisk(
  input: BreastCancerRecurrenceInput
): BreastCancerRecurrenceResult | null {
  if (!isCompleteInput(input)) return null;

  const score = computeRecurrenceScore(
    input.grade,
    input.lymphNodes,
    input.lvi
  );
  const riskPercent = riskPercentForScore(score);
  if (riskPercent == null) return null;

  const formattedRiskPercent = formatRiskPercent(riskPercent);

  return {
    score,
    riskPercent,
    formattedScore: String(score),
    formattedRiskPercent,
    riskSentence: `According to your score, the breast cancer local recurrence risk is ${formattedRiskPercent}`,
    cohortNote: COHORT_NOTE,
  };
}
