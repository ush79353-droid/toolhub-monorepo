/**
 * HAS-BLED — educational major bleeding score for AF (Pisters et al., Chest 2010).
 *
 * Nine Yes/No items, 0–9 points. Renal and liver each score 1; drugs and alcohol
 * each score 1. Age uses strict >65 (65 → 0 points; 66+ → 1).
 *
 * Event rates: Pisters 2010 Table (patients on OAC) bleeds per 100 patient-years.
 * Displayed annual % uses the same incidence rate (not a separate absolute-risk
 * model). Score ≥3 is conventionally “high” for risk review — not an automatic
 * anticoagulation order.
 */

import type {
  HasBledInput,
  HasBledResult,
  RiskBand,
  YesNo,
} from './types';

export const SOURCE_LABEL =
  'Pisters R et al. A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation: the Euro Heart Survey. Chest. 2010;138(5):1093–1100.';

export const DISCLAIMER =
  'Educational HAS-BLED score for AF bleeding-risk review only. It does not start, stop, or dose anticoagulation. Incidence rates are cohort estimates, not an individual’s absolute probability.';

export const PATIENT_YEAR_NOTE =
  'A patient-year expresses follow-up time: 100 patients followed for 1 year (or 50 for 2 years) equals 100 patient-years. Events per 100 patient-years is an incidence rate.';

export const RATE_NOTE =
  'Bleeds per 100 patient-years from Pisters 2010 among patients on oral anticoagulation. The paired “bleeding risk %” restates that incidence rate for display — it is not a separate absolute-risk calculator. Scores 6–9 had too few patients for stable rates.';

/** Pisters 2010 OAC subgroup rates (bleeds / 100 patient-years). */
export const PISTERS_OAC_RATES: Readonly<Record<number, number | null>> = {
  0: 1.13,
  1: 1.02,
  2: 1.88,
  3: 3.74,
  4: 8.7,
  5: 12.5,
  6: null,
  7: null,
  8: null,
  9: null,
};

function yn(v: YesNo): boolean {
  return v === 'yes';
}

export function computeHasBledScore(input: HasBledInput): number {
  let score = 0;
  if (yn(input.hypertension)) score += 1;
  if (yn(input.abnormalRenal)) score += 1;
  if (yn(input.abnormalLiver)) score += 1;
  if (yn(input.strokeHistory)) score += 1;
  if (yn(input.bleeding)) score += 1;
  if (yn(input.labileInr)) score += 1;
  if (yn(input.ageOver65)) score += 1;
  if (yn(input.alcohol)) score += 1;
  if (yn(input.drugs)) score += 1;
  return score;
}

export function riskBandForScore(score: number): RiskBand {
  if (score <= 0) return 'low';
  if (score <= 2) return 'intermediate';
  return 'high';
}

export function riskBandLabel(band: RiskBand): string {
  if (band === 'low') return 'low risk group';
  if (band === 'intermediate') return 'intermediate risk group';
  return 'high risk group';
}

function formatRate(n: number): string {
  return n.toFixed(1);
}

export function calculateHasBled(input: HasBledInput): HasBledResult {
  const score = computeHasBledScore(input);
  const band = riskBandForScore(score);
  const rate = PISTERS_OAC_RATES[score] ?? null;

  return {
    score,
    formattedScore: String(score),
    riskBand: band,
    riskBandLabel: riskBandLabel(band),
    interpretation: `The patient is in the ${riskBandLabel(band)}.`,
    bleedingRiskPercent: rate,
    formattedBleedingRisk: rate == null ? 'insufficient data' : `${formatRate(rate)}%`,
    eventsPer100PatientYears: rate,
    formattedEventsRate: rate == null ? 'insufficient data' : formatRate(rate),
    rateNote: RATE_NOTE,
    patientYearNote: PATIENT_YEAR_NOTE,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
