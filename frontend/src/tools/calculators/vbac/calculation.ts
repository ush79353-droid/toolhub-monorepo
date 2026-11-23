/**
 * MFMU / Grobman VBAC success model — early-pregnancy (race-neutral), no ethnicity.
 *
 * Source: Grobman WA, et al. Prediction of vaginal birth after cesarean in term
 * gestations: A calculator without race and ethnicity. Am J Obstet Gynecol.
 * 2022;227(4):626.e1-626.e12. doi: 10.1016/j.ajog.2021.05.021 (PMC8611105).
 *
 * w = β₀ + Σβᵢxᵢ; P(VBAC %) = 100 × exp(w) / (1 + exp(w)).
 * Predictors: age (y), pre-pregnancy weight (kg), height (cm), arrest indication,
 * prior vaginal birth only before prior cesarean, prior VBAC, treated chronic HTN.
 *
 * Educational counseling aid only — not admission-time model (Grobman 2024).
 */

import type {
  HeightUnit,
  PriorVaginalHistory,
  VbacInput,
  VbacResult,
  WeightUnit,
} from './types';

export const MODEL_LABEL =
  'MFMU Network Grobman VBAC model (early pregnancy, race-neutral)';
export const MODEL_VERSION =
  'Grobman et al., Am J Obstet Gynecol. 2022;227(4):626.e1-626.e12 (doi: 10.1016/j.ajog.2021.05.021)';

export const DISCLAIMER =
  'Educational probability estimate for counseling about trial of labor after cesarean (TOLAC). It does not guarantee outcome, recommend mode of delivery, or replace shared decision-making with a qualified clinician.';

export const ELIGIBILITY_SUMMARY =
  'Derived for people with one prior low-transverse cesarean, singleton vertex presentation at ≥37 weeks, and a planned TOLAC. Not validated for admission-time cervical findings or for those with prior myomectomy.';

/** Published regression coefficients (overall analytic population). */
export const COEFFICIENTS = {
  intercept: -5.952,
  agePerYear: -0.023,
  prePregnancyWeightPerKg: -0.024,
  heightPerCm: 0.056,
  arrestIndication: -0.597,
  vaginalBeforePriorCesarean: 0.868,
  priorVbac: 1.869,
  treatedChronicHypertension: -0.966,
} as const;

export function heightToCm(value: number, unit: HeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'cm':
      return value;
    case 'm':
      return value * 100;
    case 'in':
      return value * 2.54;
    case 'ft':
      return value * 30.48;
    default:
      return null;
  }
}

export function weightToKg(value: number, unit: WeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'kg':
      return value;
    case 'lb':
      return value * 0.45359237;
    case 'st':
      return value * 6.35029318;
    default:
      return null;
  }
}

export function convertHeightValue(
  value: number,
  from: HeightUnit,
  to: HeightUnit
): number | null {
  const cm = heightToCm(value, from);
  if (cm == null) return null;
  switch (to) {
    case 'cm':
      return cm;
    case 'm':
      return cm / 100;
    case 'in':
      return cm / 2.54;
    case 'ft':
      return cm / 30.48;
    default:
      return null;
  }
}

export function convertWeightValue(
  value: number,
  from: WeightUnit,
  to: WeightUnit
): number | null {
  const kg = weightToKg(value, from);
  if (kg == null) return null;
  switch (to) {
    case 'kg':
      return kg;
    case 'lb':
      return kg / 0.45359237;
    case 'st':
      return kg / 6.35029318;
    default:
      return null;
  }
}

export function historyToIndicators(history: PriorVaginalHistory): {
  vaginalBeforePriorCesarean: 0 | 1;
  priorVbac: 0 | 1;
} {
  switch (history) {
    case 'vaginalBeforePriorCesarean':
      return { vaginalBeforePriorCesarean: 1, priorVbac: 0 };
    case 'priorVbac':
      return { vaginalBeforePriorCesarean: 0, priorVbac: 1 };
    default:
      return { vaginalBeforePriorCesarean: 0, priorVbac: 0 };
  }
}

export function computeLogOdds(
  ageYears: number,
  weightKg: number,
  heightCm: number,
  arrestIndication: boolean,
  history: PriorVaginalHistory,
  treatedChronicHypertension: boolean
): number {
  const { vaginalBeforePriorCesarean, priorVbac } = historyToIndicators(history);
  const c = COEFFICIENTS;
  return (
    c.intercept +
    c.agePerYear * ageYears +
    c.prePregnancyWeightPerKg * weightKg +
    c.heightPerCm * heightCm +
    (arrestIndication ? c.arrestIndication : 0) +
    vaginalBeforePriorCesarean * c.vaginalBeforePriorCesarean +
    priorVbac * c.priorVbac +
    (treatedChronicHypertension ? c.treatedChronicHypertension : 0)
  );
}

/** Logistic transform to probability percent (0–100). */
export function logOddsToProbabilityPercent(w: number): number {
  if (!Number.isFinite(w)) return Number.NaN;
  const p = Math.exp(w) / (1 + Math.exp(w));
  return p * 100;
}

export function roundProbabilityDisplay(percent: number): string {
  if (!Number.isFinite(percent)) return '—';
  const rounded = Math.round(percent * 10) / 10;
  return `${rounded.toFixed(1)}%`;
}

export function formatLogOdds(w: number): string {
  if (!Number.isFinite(w)) return '—';
  return (Math.round(w * 1000) / 1000).toFixed(3);
}

export function deriveBmi(weightKg: number, heightCm: number): number | null {
  const m = heightCm / 100;
  if (!Number.isFinite(m) || m <= 0) return null;
  return weightKg / (m * m);
}

export interface ResolvedVbacMetrics {
  ageYears: number;
  weightKg: number;
  heightCm: number;
}

/**
 * Pure engine: metrics must already be valid finite numbers in model units.
 */
export function calculateVbac(
  metrics: ResolvedVbacMetrics,
  flags: Pick<
    VbacInput,
    'arrestIndicationForPriorCesarean' | 'priorVaginalHistory' | 'treatedChronicHypertension'
  >
): VbacResult {
  const w = computeLogOdds(
    metrics.ageYears,
    metrics.weightKg,
    metrics.heightCm,
    flags.arrestIndicationForPriorCesarean,
    flags.priorVaginalHistory,
    flags.treatedChronicHypertension
  );
  const probabilityPercent = logOddsToProbabilityPercent(w);
  const bmi = deriveBmi(metrics.weightKg, metrics.heightCm);

  return {
    probabilityPercent,
    formattedProbability: roundProbabilityDisplay(probabilityPercent),
    logOdds: w,
    formattedLogOdds: formatLogOdds(w),
    prePregnancyWeightKg: metrics.weightKg,
    heightCm: metrics.heightCm,
    displayBmi: bmi,
    formattedBmi:
      bmi != null && Number.isFinite(bmi)
        ? (Math.round(bmi * 10) / 10).toFixed(1)
        : null,
    modelLabel: MODEL_LABEL,
    modelVersion: MODEL_VERSION,
    eligibilitySummary: ELIGIBILITY_SUMMARY,
    disclaimer: DISCLAIMER,
  };
}

/** Paper Table 3 published scenarios for regression tests. */
export const TABLE3_FIXTURES = [
  {
    id: 1,
    age: 30,
    weightKg: 71,
    heightCm: 171,
    arrest: false,
    history: 'priorVbac' as PriorVaginalHistory,
    htn: false,
    expectedPercent: 95.6,
  },
  {
    id: 2,
    age: 30,
    weightKg: 71,
    heightCm: 156,
    arrest: false,
    history: 'priorVbac' as PriorVaginalHistory,
    htn: false,
    expectedPercent: 90.5,
  },
  {
    id: 3,
    age: 30,
    weightKg: 71,
    heightCm: 156,
    arrest: false,
    history: 'vaginalBeforePriorCesarean' as PriorVaginalHistory,
    htn: false,
    expectedPercent: 77.7,
  },
  {
    id: 4,
    age: 30,
    weightKg: 71,
    heightCm: 171,
    arrest: false,
    history: 'none' as PriorVaginalHistory,
    htn: false,
    expectedPercent: 77.2,
  },
  {
    id: 5,
    age: 30,
    weightKg: 44,
    heightCm: 156,
    arrest: false,
    history: 'none' as PriorVaginalHistory,
    htn: false,
    expectedPercent: 73.4,
  },
  {
    id: 6,
    age: 23,
    weightKg: 71,
    heightCm: 156,
    arrest: false,
    history: 'none' as PriorVaginalHistory,
    htn: false,
    expectedPercent: 63.3,
  },
  {
    id: 7,
    age: 30,
    weightKg: 71,
    heightCm: 156,
    arrest: false,
    history: 'none' as PriorVaginalHistory,
    htn: false,
    expectedPercent: 59.4,
  },
  {
    id: 8,
    age: 37,
    weightKg: 71,
    heightCm: 156,
    arrest: false,
    history: 'none' as PriorVaginalHistory,
    htn: false,
    expectedPercent: 55.4,
  },
  {
    id: 9,
    age: 23,
    weightKg: 71,
    heightCm: 156,
    arrest: true,
    history: 'none' as PriorVaginalHistory,
    htn: false,
    expectedPercent: 48.7,
  },
  {
    id: 10,
    age: 30,
    weightKg: 71,
    heightCm: 156,
    arrest: true,
    history: 'none' as PriorVaginalHistory,
    htn: false,
    expectedPercent: 44.6,
  },
  {
    id: 11,
    age: 30,
    weightKg: 71,
    heightCm: 156,
    arrest: false,
    history: 'none' as PriorVaginalHistory,
    htn: true,
    expectedPercent: 35.8,
  },
  {
    id: 12,
    age: 37,
    weightKg: 71,
    heightCm: 156,
    arrest: false,
    history: 'none' as PriorVaginalHistory,
    htn: true,
    expectedPercent: 32.1,
  },
] as const;