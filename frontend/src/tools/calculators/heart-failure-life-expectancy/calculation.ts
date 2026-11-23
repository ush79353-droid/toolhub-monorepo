/**
 * MAGGIC heart failure integer risk score (Pocock et al. 2013).
 *
 * Integer chart: Eur Heart J Figure 2; 1- and 3-year mortality: Table 4.
 * Survival displayed as 100% − table mortality (not years of life remaining).
 *
 * Source: Pocock SJ et al. Predicting survival in heart failure: a risk score
 * based on 39 372 patients from 30 studies. Eur Heart J. 2013;34(19):1404–1413.
 * doi:10.1093/eurheartj/ehs337 · PMID 23095984.
 */

import type {
  HeartFailureLifeExpectancyInput,
  HeartFailureLifeExpectancyResult,
  NyhaClass,
  Sex,
} from './types';

export const SOURCE_LABEL =
  'Pocock SJ, Ariti CA, McMurray JJV, et al. (MAGGIC). Predicting survival in heart failure: a risk score based on 39 372 patients from 30 studies. Eur Heart J. 2013;34(19):1404–1413.';

export const DISCLAIMER =
  'Educational MAGGIC integer score and published Table 4 mortality mapping only. Outputs are survival probabilities (100% minus table death risk), not years of life remaining. Not medical advice or a treatment directive.';

/** µmol/L per mg/dL (Figure 2 creatinine bins use µmol/L). */
export const CREATININE_UMOL_PER_MG_DL = 88.42;

const CM_PER_IN = 2.54;
const KG_PER_LB = 0.45359237;

/** Pocock 2013 Table 4 — probability of death by integer score 0–50. */
export const TABLE4_MORTALITY: ReadonlyArray<
  readonly [oneYear: number, threeYear: number]
> = [
  [0.015, 0.039],
  [0.016, 0.043],
  [0.018, 0.048],
  [0.02, 0.052],
  [0.022, 0.058],
  [0.024, 0.063],
  [0.027, 0.07],
  [0.029, 0.077],
  [0.032, 0.084],
  [0.036, 0.092],
  [0.039, 0.102],
  [0.043, 0.111],
  [0.048, 0.122],
  [0.052, 0.134],
  [0.058, 0.146],
  [0.063, 0.16],
  [0.07, 0.175],
  [0.077, 0.191],
  [0.084, 0.209],
  [0.093, 0.227],
  [0.102, 0.247],
  [0.111, 0.269],
  [0.122, 0.292],
  [0.134, 0.316],
  [0.147, 0.342],
  [0.16, 0.369],
  [0.175, 0.397],
  [0.191, 0.427],
  [0.209, 0.458],
  [0.227, 0.49],
  [0.248, 0.523],
  [0.269, 0.556],
  [0.292, 0.59],
  [0.316, 0.625],
  [0.342, 0.658],
  [0.369, 0.692],
  [0.398, 0.725],
  [0.427, 0.756],
  [0.458, 0.787],
  [0.49, 0.815],
  [0.523, 0.842],
  [0.557, 0.866],
  [0.591, 0.889],
  [0.625, 0.908],
  [0.659, 0.926],
  [0.692, 0.941],
  [0.725, 0.953],
  [0.757, 0.964],
  [0.787, 0.973],
  [0.816, 0.98],
  [0.842, 0.985],
];

export const MIN_AGE = 18;
export const MAX_AGE = 120;
export const MIN_EF = 1;
export const MAX_EF = 90;
export const MIN_SBP = 50;
export const MAX_SBP = 250;
export const MIN_BMI = 10;
export const MAX_BMI = 80;

export interface MaggicClinicalInput {
  sex: Sex;
  ageYears: number;
  efPercent: number;
  nyhaClass: NyhaClass;
  creatinineUmolL: number;
  bmiKgM2: number;
  systolicMmHg: number;
  diabetes: boolean;
  betaBlockerPrescribed: boolean;
  aceiArbPrescribed: boolean;
  hfDurationGt18Months: boolean;
  currentSmoker: boolean;
  copd: boolean;
}

export function heightToMeters(value: number, unit: string): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'm':
      return value;
    case 'cm':
      return value / 100;
    case 'in':
      return (value * CM_PER_IN) / 100;
    case 'ft':
      return (value * 12 * CM_PER_IN) / 100;
    default:
      return null;
  }
}

export function weightToKg(value: number, unit: string): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'lb' ? value * KG_PER_LB : value;
}

export function computeBmiKgM2(heightM: number, weightKg: number): number | null {
  if (heightM <= 0 || weightKg <= 0) return null;
  const bmi = weightKg / (heightM * heightM);
  return Number.isFinite(bmi) && bmi > 0 ? bmi : null;
}

export function creatinineToUmolL(value: number, unit: string): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  if (unit === 'mg/dL') return value * CREATININE_UMOL_PER_MG_DL;
  return value;
}

/** EF column for age/SBP interaction rows: <30, 30–39, ≥40. */
export function efInteractionColumn(efPercent: number): 0 | 1 | 2 {
  if (efPercent < 30) return 0;
  if (efPercent < 40) return 1;
  return 2;
}

export function pointsForEf(efPercent: number): number {
  if (efPercent < 20) return 7;
  if (efPercent < 25) return 6;
  if (efPercent < 30) return 5;
  if (efPercent < 35) return 3;
  if (efPercent < 40) return 2;
  return 0;
}

const AGE_POINTS_BY_EF_COLUMN: readonly (readonly [number, number, number])[] =
  [
    [0, 0, 0], // <55
    [1, 2, 3], // 55–59
    [2, 4, 5], // 60–64
    [4, 6, 7], // 65–69
    [6, 8, 9], // 70–74
    [8, 10, 12], // 75–79
    [10, 13, 15], // ≥80
  ];

function ageBandIndex(ageYears: number): number {
  if (ageYears < 55) return 0;
  if (ageYears < 60) return 1;
  if (ageYears < 65) return 2;
  if (ageYears < 70) return 3;
  if (ageYears < 75) return 4;
  if (ageYears < 80) return 5;
  return 6;
}

export function pointsForAgeByEf(ageYears: number, efPercent: number): number {
  const col = efInteractionColumn(efPercent);
  const band = ageBandIndex(ageYears);
  return AGE_POINTS_BY_EF_COLUMN[band][col];
}

const SBP_POINTS_BY_EF_COLUMN: readonly (readonly [number, number, number])[] =
  [
    [5, 3, 2], // <110
    [4, 2, 1], // 110–119
    [3, 1, 1], // 120–129
    [2, 1, 0], // 130–139
    [1, 0, 0], // 140–149
    [0, 0, 0], // ≥150
  ];

function sbpBandIndex(sbp: number): number {
  if (sbp < 110) return 0;
  if (sbp < 120) return 1;
  if (sbp < 130) return 2;
  if (sbp < 140) return 3;
  if (sbp < 150) return 4;
  return 5;
}

export function pointsForSbpByEf(
  systolicMmHg: number,
  efPercent: number,
): number {
  const col = efInteractionColumn(efPercent);
  const band = sbpBandIndex(systolicMmHg);
  return SBP_POINTS_BY_EF_COLUMN[band][col];
}

export function pointsForBmi(bmi: number): number {
  if (bmi < 15) return 6;
  if (bmi < 20) return 5;
  if (bmi < 25) return 3;
  if (bmi < 30) return 2;
  return 0;
}

export function pointsForCreatinineUmolL(creatinineUmolL: number): number {
  if (creatinineUmolL < 90) return 0;
  if (creatinineUmolL < 110) return 1;
  if (creatinineUmolL < 130) return 2;
  if (creatinineUmolL < 150) return 3;
  if (creatinineUmolL < 170) return 4;
  if (creatinineUmolL < 210) return 5;
  if (creatinineUmolL < 250) return 6;
  return 8;
}

export function pointsForNyha(nyha: NyhaClass): number {
  switch (nyha) {
    case 'I':
      return 0;
    case 'II':
      return 2;
    case 'III':
      return 6;
    case 'IV':
      return 8;
    default:
      return 0;
  }
}

export function computeMaggicScore(input: MaggicClinicalInput): number {
  let score = 0;
  score += pointsForEf(input.efPercent);
  score += pointsForAgeByEf(input.ageYears, input.efPercent);
  score += pointsForSbpByEf(input.systolicMmHg, input.efPercent);
  score += pointsForBmi(input.bmiKgM2);
  score += pointsForCreatinineUmolL(input.creatinineUmolL);
  score += pointsForNyha(input.nyhaClass);
  if (input.sex === 'male') score += 1;
  if (input.currentSmoker) score += 1;
  if (input.diabetes) score += 3;
  if (input.copd) score += 2;
  if (input.hfDurationGt18Months) score += 2;
  if (!input.betaBlockerPrescribed) score += 3;
  if (!input.aceiArbPrescribed) score += 1;
  return score;
}

export function lookupTable4Mortality(
  score: number,
): { mortality1Year: number; mortality3Year: number } | null {
  if (!Number.isInteger(score) || score < 0 || score > 50) return null;
  const row = TABLE4_MORTALITY[score];
  if (!row) return null;
  return { mortality1Year: row[0], mortality3Year: row[1] };
}

export function mortalityToSurvivalPercent(mortality: number): number {
  return Math.max(0, Math.min(100, (1 - mortality) * 100));
}

export function formatSurvivalPercent(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return `${value.toFixed(1)}`;
}

export function formatScore(score: number | null): string {
  if (score == null || !Number.isFinite(score)) return '';
  return String(score);
}

export function toClinicalInput(
  input: HeartFailureLifeExpectancyInput,
  parsed: {
    ageYears: number;
    bmiKgM2: number;
    creatinineUmolL: number;
    efPercent: number;
    systolicMmHg: number;
  },
): MaggicClinicalInput {
  return {
    sex: input.sex,
    ageYears: parsed.ageYears,
    efPercent: parsed.efPercent,
    nyhaClass: input.nyhaClass,
    creatinineUmolL: parsed.creatinineUmolL,
    bmiKgM2: parsed.bmiKgM2,
    systolicMmHg: parsed.systolicMmHg,
    diabetes: input.hasDiabetes,
    betaBlockerPrescribed: input.takingBetaBlocker,
    aceiArbPrescribed: input.takingAceiArb,
    hfDurationGt18Months: input.heartFailureOver18Months,
    currentSmoker: input.isSmoker,
    copd: input.hasCopd,
  };
}

export function calculateHeartFailureLifeExpectancy(
  clinical: MaggicClinicalInput,
): HeartFailureLifeExpectancyResult {
  const maggicScore = computeMaggicScore(clinical);
  const table = lookupTable4Mortality(maggicScore);
  const mortality1Year = table?.mortality1Year ?? null;
  const mortality3Year = table?.mortality3Year ?? null;
  const survival1YearPercent =
    mortality1Year != null ? mortalityToSurvivalPercent(mortality1Year) : null;
  const survival3YearPercent =
    mortality3Year != null ? mortalityToSurvivalPercent(mortality3Year) : null;

  const tableNote =
    table == null
      ? ' Published Table 4 lists 1- and 3-year death probabilities for integer scores 0–50 only.'
      : '';

  const explanation = [
    `MAGGIC integer score = ${maggicScore} (Pocock et al. 2013 Figure 2).`,
    table
      ? `Table 4 mortality ${(mortality1Year! * 100).toFixed(1)}% (1 year) and ${(mortality3Year! * 100).toFixed(1)}% (3 years); survival = 100% − mortality.`
      : `Score exceeds the published Table 4 range (0–50). Survival percentages are not shown.${tableNote}`,
  ].join(' ');

  return {
    maggicScore,
    mortality1Year,
    mortality3Year,
    survival1YearPercent,
    survival3YearPercent,
    formattedScore: formatScore(maggicScore),
    formattedSurvival1Year: formatSurvivalPercent(survival1YearPercent),
    formattedSurvival3Year: formatSurvivalPercent(survival3YearPercent),
    tableInRange: table != null,
    explanation,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}