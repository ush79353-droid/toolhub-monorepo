/**
 * Trudell et al. US stillbirth logistic model (≥32 weeks, anomalies/aneuploidy excluded).
 *
 * Source: Trudell AS, et al. A stillbirth calculator… PLoS ONE. 2017;12(3):e0173461.
 * Coefficients follow published Table 3 (smoking β = 0.2270; OR 1.25). The narrative
 * formula in the same paper lists 0.2770 — that value is inconsistent with Table 3/OR.
 *
 * logit = β₀ + Σβᵢxᵢ; p = 1 / (1 + exp(−logit)). Educational only — not clinical advice.
 */

import type { DiabetesOption, StillbirthRiskInput, StillbirthRiskResult } from './types';

export const MODEL_LABEL =
  'Trudell et al. 2017 US stillbirth model (≥32 weeks)';
export const MODEL_VERSION =
  'Trudell AS, et al. PLoS ONE. 2017;12(3):e0173461 (doi: 10.1371/journal.pone.0173461)';

export const DISCLAIMER =
  'Educational stillbirth probability estimate for counseling contexts. It must not replace clinical judgment, surveillance plans, or care from a qualified obstetric provider.';

export const ELIGIBILITY_SUMMARY =
  'Calibrated for singleton pregnancies reaching ≥32 weeks without major fetal anomaly or aneuploidy in a US cohort. It estimates stillbirth from ≥32 weeks onward, not early pregnancy loss.';

/** Published intercept (reference log-odds at baseline covariate pattern). */
export const INTERCEPT = -6.8772;

export const COEFFICIENTS = {
  intercept: INTERCEPT,
  ageLe18: -0.8707,
  age35to39: 0.2094,
  ageGe40: 0.4377,
  blackRace: 0.8536,
  nulliparity: 0.3423,
  bmi25to29_9: -0.0219,
  bmi30to34_9: 0.5607,
  bmi35to39_9: -0.5948,
  bmiGe40: 0.1593,
  smoking: 0.2270,
  chronicHypertension: 0.6255,
  pregestationalDiabetes: 0.9863,
} as const;

export function deriveBmi(weightKg: number, heightCm: number): number | null {
  const m = heightCm / 100;
  if (!Number.isFinite(m) || m <= 0 || !Number.isFinite(weightKg) || weightKg <= 0) {
    return null;
  }
  return weightKg / (m * m);
}

export type BmiBand =
  | 'under25'
  | '25to29_9'
  | '30to34_9'
  | '35to39_9'
  | '40plus';

export function bmiToBand(bmi: number): BmiBand {
  if (bmi < 25) return 'under25';
  if (bmi < 30) return '25to29_9';
  if (bmi < 35) return '30to34_9';
  if (bmi < 40) return '35to39_9';
  return '40plus';
}

export function bmiBandLabel(band: BmiBand): string {
  switch (band) {
    case 'under25':
      return 'BMI < 25';
    case '25to29_9':
      return 'BMI 25–29.9';
    case '30to34_9':
      return 'BMI 30–34.9';
    case '35to39_9':
      return 'BMI 35–39.9';
    default:
      return 'BMI ≥ 40';
  }
}

export function ageCoefficient(ageYears: number): number {
  if (ageYears <= 18) return COEFFICIENTS.ageLe18;
  if (ageYears <= 34) return 0;
  if (ageYears <= 39) return COEFFICIENTS.age35to39;
  return COEFFICIENTS.ageGe40;
}

export function bmiCoefficient(band: BmiBand): number {
  switch (band) {
    case 'under25':
      return 0;
    case '25to29_9':
      return COEFFICIENTS.bmi25to29_9;
    case '30to34_9':
      return COEFFICIENTS.bmi30to34_9;
    case '35to39_9':
      return COEFFICIENTS.bmi35to39_9;
    default:
      return COEFFICIENTS.bmiGe40;
  }
}

export function isBlackEthnicity(ethnicity: StillbirthRiskInput['ethnicity']): boolean {
  return ethnicity === 'nonHispanicBlack';
}

export function isNulliparous(previousPregnancies: boolean | null): boolean {
  return previousPregnancies === false;
}

export function hasPregestationalDiabetes(diabetes: DiabetesOption): boolean {
  return diabetes === 'type1' || diabetes === 'type2';
}

export interface TrudellPredictors {
  ageYears: number;
  bmi: number;
  isBlack: boolean;
  nulliparous: boolean;
  smoking: boolean;
  chronicHypertension: boolean;
  pregestationalDiabetes: boolean;
}

export function computeLogit(p: TrudellPredictors): number {
  const band = bmiToBand(p.bmi);
  return (
    COEFFICIENTS.intercept +
    ageCoefficient(p.ageYears) +
    (p.isBlack ? COEFFICIENTS.blackRace : 0) +
    (p.nulliparous ? COEFFICIENTS.nulliparity : 0) +
    bmiCoefficient(band) +
    (p.smoking ? COEFFICIENTS.smoking : 0) +
    (p.chronicHypertension ? COEFFICIENTS.chronicHypertension : 0) +
    (p.pregestationalDiabetes ? COEFFICIENTS.pregestationalDiabetes : 0)
  );
}

/** Logistic transform to probability percent (0–100). */
export function logitToProbabilityPercent(logit: number): number {
  if (!Number.isFinite(logit)) return Number.NaN;
  const p = 1 / (1 + Math.exp(-logit));
  return p * 100;
}

export function interceptOnlyProbabilityPercent(): number {
  return logitToProbabilityPercent(INTERCEPT);
}

/** Display percent with sensible precision for rare-event probabilities. */
export function formatProbabilityPercent(percent: number): string {
  if (!Number.isFinite(percent)) return '—';
  if (percent >= 10) return `${(Math.round(percent * 10) / 10).toFixed(1)}%`;
  if (percent >= 1) return `${(Math.round(percent * 100) / 100).toFixed(2)}%`;
  return `${(Math.round(percent * 1000) / 1000).toFixed(3)}%`;
}

export function formatLogit(logit: number): string {
  if (!Number.isFinite(logit)) return '—';
  return (Math.round(logit * 10000) / 10000).toFixed(4);
}

export function oneInNFromPercent(percent: number): number | null {
  if (!Number.isFinite(percent) || percent <= 0) return null;
  const p = percent / 100;
  const n = 1 / p;
  if (!Number.isFinite(n)) return null;
  return Math.max(1, Math.round(n));
}

export function formatOneInN(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return `1 in ${n.toLocaleString('en-US')}`;
}

type NonModelNoteInput = Pick<
  StillbirthRiskInput,
  'art' | 'sle' | 'aps' | 'alcoholDuringPregnancy' | 'ethnicity'
>;

function collectNonModelFieldsNote(input: NonModelNoteInput): string | null {
  const parts: string[] = [];
  if (input.art) parts.push('ART');
  if (input.sle) parts.push('SLE');
  if (input.aps) parts.push('APS');
  if (input.alcoholDuringPregnancy) parts.push('alcohol use during pregnancy');
  if (input.ethnicity && input.ethnicity !== 'nonHispanicBlack') {
    parts.push(
      'detailed ethnicity category (Trudell uses Non-Hispanic Black vs all others only)'
    );
  }
  if (parts.length === 0) return null;
  return `These entries match common intake forms but are not coefficients in the calibrated Trudell 2017 model and do not change this score: ${parts.join('; ')}.`;
}

export function calculateStillbirthRisk(
  predictors: TrudellPredictors,
  inputForNotes: Pick<
    StillbirthRiskInput,
    'art' | 'sle' | 'aps' | 'alcoholDuringPregnancy' | 'ethnicity'
  >
): StillbirthRiskResult {
  const logit = computeLogit(predictors);
  const probabilityPercent = logitToProbabilityPercent(logit);
  const band = bmiToBand(predictors.bmi);
  const interceptRef = interceptOnlyProbabilityPercent();

  return {
    probabilityPercent,
    formattedProbability: formatProbabilityPercent(probabilityPercent),
    oneInN: oneInNFromPercent(probabilityPercent),
    formattedOneInN: formatOneInN(oneInNFromPercent(probabilityPercent)),
    logit,
    formattedLogit: formatLogit(logit),
    bmi: predictors.bmi,
    formattedBmi: (Math.round(predictors.bmi * 10) / 10).toFixed(1),
    bmiCategoryLabel: bmiBandLabel(band),
    modelLabel: MODEL_LABEL,
    modelVersion: MODEL_VERSION,
    eligibilitySummary: ELIGIBILITY_SUMMARY,
    disclaimer: DISCLAIMER,
    nonModelFieldsNote: collectNonModelFieldsNote(inputForNotes),
    interceptReferencePercent: interceptRef,
    formattedInterceptReference: formatProbabilityPercent(interceptRef),
  };
}