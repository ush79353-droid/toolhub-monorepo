/**
 * Padua Prediction Score — educational VTE risk total for medical inpatients.
 *
 * Barbar S et al. J Thromb Haemost. 2010. High-risk band in the derivation
 * framing: cumulative score ≥ 4. This tool reports the numeric score and band
 * only — it does not order pharmacological or mechanical prophylaxis.
 *
 * Points: active cancer / previous VTE / reduced mobility / thrombophilia = 3;
 * recent trauma/surgery (≤1 month) = 2; age ≥70, heart/respiratory failure,
 * acute MI or ischemic stroke, acute infection/rheumatologic disorder,
 * BMI ≥30, hormonal therapy = 1 each. Grouped labels count once.
 */

import type { PaduaBreakdown, PaduaInput, PaduaResult } from './types';

export const SOURCE_LABEL =
  'Barbar S et al. A risk assessment model for the identification of hospitalized medical patients at risk for venous thromboembolism: the Padua Prediction Score. J Thromb Haemost. 2010;8:2450–2457.';

export const DISCLAIMER =
  'Educational Padua Prediction Score only. It does not prescribe pharmacological or mechanical VTE prophylaxis, assess bleeding risk, or replace bedside judgment for hospitalized medical patients.';

export const HIGH_RISK_THRESHOLD = 4;

export const MAX_SCORE = 20;

export function buildBreakdown(input: PaduaInput): PaduaBreakdown {
  return {
    age70Plus: input.age70Plus ? 1 : 0,
    obesityBmi30: input.obesityBmi30 ? 1 : 0,
    reducedMobility: input.reducedMobility ? 3 : 0,
    hormonalTreatment: input.hormonalTreatment ? 1 : 0,
    activeCancer: input.activeCancer ? 3 : 0,
    traumaOrSurgeryMonth: input.traumaOrSurgeryMonth ? 2 : 0,
    previousVte: input.previousVte ? 3 : 0,
    thrombophilia: input.thrombophilia ? 3 : 0,
    heartOrRespiratoryFailure: input.heartOrRespiratoryFailure ? 1 : 0,
    acuteMiOrIschemicStroke: input.acuteMiOrIschemicStroke ? 1 : 0,
    acuteInfectionOrRheumatologic: input.acuteInfectionOrRheumatologic ? 1 : 0,
  };
}

export function sumBreakdown(b: PaduaBreakdown): number {
  return (
    b.age70Plus +
    b.obesityBmi30 +
    b.reducedMobility +
    b.hormonalTreatment +
    b.activeCancer +
    b.traumaOrSurgeryMonth +
    b.previousVte +
    b.thrombophilia +
    b.heartOrRespiratoryFailure +
    b.acuteMiOrIschemicStroke +
    b.acuteInfectionOrRheumatologic
  );
}

export function calculatePaduaScore(input: PaduaInput): PaduaResult {
  const breakdown = buildBreakdown(input);
  const totalScore = sumBreakdown(breakdown);
  const highRiskBand = totalScore >= HIGH_RISK_THRESHOLD;

  return {
    totalScore,
    breakdown,
    formattedScore: `${totalScore} point${totalScore === 1 ? '' : 's'}`,
    highRiskBand,
    bandLabel: highRiskBand
      ? `Educational band: score ≥ ${HIGH_RISK_THRESHOLD} (higher VTE-risk framing in Barbar 2010). Not a prophylaxis order.`
      : `Educational band: score < ${HIGH_RISK_THRESHOLD} (lower VTE-risk framing in Barbar 2010). Not a decision to withhold care.`,
    explanation: `Padua score = sum of checked items (range 0–${MAX_SCORE}). Threshold ≥${HIGH_RISK_THRESHOLD} marked high risk in the original medical-inpatient derivation. Grouped diagnoses (e.g. heart failure / respiratory failure) add their points once.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
