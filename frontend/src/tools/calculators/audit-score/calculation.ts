/**
 * WHO AUDIT scoring (Babor et al. / WHO MSD/MSB 01.6a).
 *
 * Q1–Q8: 0–4 each. Q9–Q10: 0, 2, or 4.
 * Domains: consumption Q1–3; dependence Q4–6; harm Q7–10.
 * Educational screening only — not a diagnosis.
 */

import type { AuditScoreInput, AuditScoreResult, Sex } from './types';

export const SOURCE_NOTE =
  'WHO AUDIT manual (WHO/MSD/MSB/01.6a). Items 1–8 score 0–4; items 9–10 score 0/2/4. Domains: consumption 1–3, dependence 4–6, harm 7–10.';

export const DISCLAIMER =
  'Educational screening estimate only — not a diagnosis or treatment plan. Discuss concerning scores with a clinician.';

export function calculateAuditScore(input: AuditScoreInput): AuditScoreResult {
  const consumption = input.q1 + input.q2 + input.q3;
  const dependence = input.q4 + input.q5 + input.q6;
  const harm = input.q7 + input.q8 + input.q9 + input.q10;
  const total = consumption + dependence + harm;

  return {
    consumption,
    dependence,
    harm,
    total,
    interpretation: interpretTotal(total, input.sex),
    statusDetail: domainHints(consumption, dependence, harm, input.sex),
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

function interpretTotal(total: number, sex: Sex): string {
  if (total <= 7) {
    return `Your overall result is ${total} points. You probably do not have an alcohol problem.`;
  }
  if (total <= 15) {
    return `Your overall result is ${total} points. Hazardous alcohol use may be present — consider cutting down and clinician advice.`;
  }
  if (total <= 19) {
    return `Your overall result is ${total} points. Harmful alcohol use is suggested — clinical assessment is recommended.`;
  }
  return `Your overall result is ${total} points. Possible alcohol dependence — prompt clinical assessment is recommended.`;
}

function domainHints(
  consumption: number,
  dependence: number,
  harm: number,
  sex: Sex,
): string {
  const parts: string[] = [];
  const auditCCut = sex === 'female' ? 3 : 4;
  // Screenshot/content notes AUDIT-C thresholds differently for sexes; keep educational.
  if (consumption > auditCCut) {
    parts.push(
      `Consumption (AUDIT-C) ${consumption} exceeds a common ${sex} screening cut (≥${auditCCut + 1}).`,
    );
  }
  if (dependence >= 4) {
    parts.push('Dependence items total ≥4 — often flagged as concerning.');
  }
  if (harm > 0) {
    parts.push('Any alcohol-related problems points are a clinical red flag.');
  }
  return parts.join(' ') || SOURCE_NOTE;
}
