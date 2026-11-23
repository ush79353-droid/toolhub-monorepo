/**
 * RCRI — Revised Cardiac Risk Index (educational).
 *
 * Six Lee factors, 1 point each. Classes: I=0, II=1, III=2, IV=3–6.
 * Displayed 30-day risk of death, MI, or cardiac arrest uses CCS 2017 pooled
 * external-validation estimates (distinct from Lee 1999 derivation endpoint).
 *
 * Sources: Lee TH et al. Circulation. 1999;100:1043-1049; Duceppe E et al.
 * Can J Cardiol. 2017;33:17-32 (Table 2 pooled rates).
 */

import type { RcriClass, RcriInput, RcriResult } from './types';

export const SOURCE_LABEL =
  'Lee TH et al. Circulation. 1999;100:1043-1049 (six RCRI factors). 30-day death/MI/cardiac-arrest rates from CCS 2017 pooled external validations (Duceppe et al. Can J Cardiol. 2017;33:17-32 Table 2) — not Lee derivation rates.';

export const DISCLAIMER =
  'Educational RCRI score and CCS 2017 pooled risk estimates only. Does not clear patients for surgery, choose monitoring, or replace clinical perioperative assessment.';

/** CCS 2017 Table 2 pooled estimates (%). */
export const RISK_BY_CLASS: Record<RcriClass, number> = {
  I: 3.9,
  II: 6.0,
  III: 10.1,
  IV: 15.0,
};

export function scoreFactor(value: 'no' | 'yes'): number {
  return value === 'yes' ? 1 : 0;
}

export function totalRcriPoints(input: RcriInput): number {
  return (
    scoreFactor(input.cerebrovascularDisease) +
    scoreFactor(input.congestiveHeartFailure) +
    scoreFactor(input.ischemicHeartDisease) +
    scoreFactor(input.creatinineAbove2) +
    scoreFactor(input.insulinTreatment) +
    scoreFactor(input.highRiskSurgery)
  );
}

export function classFromPoints(points: number): RcriClass | null {
  if (!Number.isInteger(points) || points < 0 || points > 6) return null;
  if (points === 0) return 'I';
  if (points === 1) return 'II';
  if (points === 2) return 'III';
  return 'IV';
}

export function calculateRcri(input: RcriInput): RcriResult {
  const totalPoints = totalRcriPoints(input);
  const rcriClass = classFromPoints(totalPoints)!;
  const riskPercent = RISK_BY_CLASS[rcriClass];

  return {
    totalPoints,
    rcriClass,
    riskPercent,
    formattedPoints: String(totalPoints),
    formattedRisk: riskPercent.toFixed(1),
    interpretation: `According to the RCRI score, the patient is assigned to class ${rcriClass}.`,
    explanation: `Sum of six Lee factors (0–6). Class ${rcriClass} → CCS 2017 pooled estimate ${riskPercent.toFixed(1)}% for 30-day death, MI, or cardiac arrest.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
