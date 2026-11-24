/**
 * TIMI Risk Score for STEMI — Morrow et al., Circulation 2000 (InTIME II).
 *
 * Published bedside factors only (max 14):
 * - Age &lt;65: 0; 65–74: 2; ≥75: 3
 * - History of diabetes, hypertension, or angina: 1
 * - Heart rate &gt;100 bpm: 2
 * - SBP &lt;100 mmHg: 3
 * - Killip class II–IV: 2
 * - Weight &lt;67 kg: 1
 * - Anterior ST elevation or LBBB: 1
 * - Time to treatment &gt;4 hours: 1
 *
 * 30-day mortality bands are the observed InTIME II rates by score
 * (score &gt;8 collapsed to 35.9%). Educational only — not a triage order.
 */

import type {
  TimiStemiAgeBand,
  TimiStemiBreakdown,
  TimiStemiInput,
  TimiStemiResult,
} from './types';

export const SOURCE_LABEL =
  'Morrow DA et al. TIMI risk score for ST-elevation myocardial infarction: a convenient, bedside, clinical score for risk assessment at presentation. Circulation. 2000;102(17):2031–2037.';

export const DISCLAIMER =
  'Educational TIMI STEMI score (0–14) with InTIME II 30-day mortality bands only. Derived in fibrinolytic-eligible STEMI. It does not triage reperfusion, start/stop therapy, or replace clinical judgment.';

export const AGE_POINTS: Record<TimiStemiAgeBand, number> = {
  under65: 0,
  age65to74: 2,
  age75plus: 3,
};

/** Observed 30-day mortality (%) by TIMI STEMI score (Morrow 2000 / InTIME II). */
export const MORTALITY_30_DAY_BY_SCORE: Readonly<Record<number, number>> = {
  0: 0.8,
  1: 1.6,
  2: 2.2,
  3: 4.4,
  4: 7.3,
  5: 12.4,
  6: 16.1,
  7: 23.4,
  8: 26.8,
};

export const MORTALITY_OVER_8 = 35.9;

export function mortality30DayPercent(totalScore: number): number {
  if (!Number.isFinite(totalScore) || totalScore < 0) {
    throw new Error('TIMI STEMI score must be a non-negative finite number.');
  }
  if (totalScore > 8) return MORTALITY_OVER_8;
  const pct = MORTALITY_30_DAY_BY_SCORE[totalScore];
  if (pct === undefined) {
    throw new Error(`No mortality band for score ${totalScore}.`);
  }
  return pct;
}

export function buildBreakdown(input: TimiStemiInput): TimiStemiBreakdown {
  if (input.ageBand === null) {
    throw new Error('Age band is required before scoring.');
  }
  return {
    agePoints: AGE_POINTS[input.ageBand],
    historyPoints: input.diabetesHypertensionOrAngina ? 1 : 0,
    heartRatePoints: input.heartRateOver100 ? 2 : 0,
    sbpPoints: input.sbpUnder100 ? 3 : 0,
    delayPoints: input.timeToTreatmentOver4h ? 1 : 0,
    weightPoints: input.weightUnder67kg ? 1 : 0,
    killipPoints: input.killipClassIiToIv === 'yes' ? 2 : 0,
    anteriorOrLbbbPoints: input.anteriorStElevationOrLbbb === 'yes' ? 1 : 0,
  };
}

export function sumBreakdown(b: TimiStemiBreakdown): number {
  return (
    b.agePoints +
    b.historyPoints +
    b.heartRatePoints +
    b.sbpPoints +
    b.delayPoints +
    b.weightPoints +
    b.killipPoints +
    b.anteriorOrLbbbPoints
  );
}

export function calculateTimiStemiScore(input: TimiStemiInput): TimiStemiResult {
  const breakdown = buildBreakdown(input);
  const totalScore = sumBreakdown(breakdown);
  const mortality30DayPercentValue = mortality30DayPercent(totalScore);

  return {
    totalScore,
    breakdown,
    formattedScore: String(totalScore),
    mortality30DayPercent: mortality30DayPercentValue,
    formattedMortality: `${mortality30DayPercentValue}%`,
    explanation: `TIMI STEMI = age (${breakdown.agePoints}) + history DM/HTN/angina (${breakdown.historyPoints}) + HR>100 (${breakdown.heartRatePoints}) + SBP<100 (${breakdown.sbpPoints}) + delay>4h (${breakdown.delayPoints}) + weight<67kg (${breakdown.weightPoints}) + Killip II–IV (${breakdown.killipPoints}) + anterior STE/LBBB (${breakdown.anteriorOrLbbbPoints}) = ${totalScore} (range 0–14). Educational 30-day mortality band ${mortality30DayPercentValue}% (InTIME II). Screenshot age “> 75” maps to published ≥75 (+3); weight checkbox is the published <67 kg item labeled with 150 lbs.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
