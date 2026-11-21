/**
 * Weight Percentile Calculator — WHO weight-for-age LMS (ADR-018).
 *
 * z = ((W/M)^L − 1)/(L×S); L=0 → ln(W/M)/S; WHO ±3 SD tail policy.
 * percentile = 100 × Φ(z). Ages 0–60 completed months only (no extrapolation).
 *
 * Reuses WHO adjusted-z / CDF helpers from BMI Percentile (same Child Growth
 * Standards computation notes).
 */

import {
  whoAdjustedZScore,
  zToPercentile,
} from '../bmi-percentile/calculation';
import type { WhoBmiLms } from '../bmi-percentile/datasets';
import {
  WHO_WFA_AGE_MONTHS_MAX,
  WHO_WFA_AGE_MONTHS_MIN,
  WHO_WFA_LMS_BOYS,
  WHO_WFA_LMS_GIRLS,
  type WhoWfaLms,
} from './datasets';
import type { AgeUnit, Sex, WeightUnit } from './types';

export const KG_PER_POUND = 0.45359237;

export const WHO_WFA_SOURCE =
  "This tool is based on WHO's child growth standards.";

export const DISCLAIMER =
  'Educational weight-for-age percentile using WHO Child Growth Standards (0–60 months). Not a diagnosis. Discuss results with a qualified clinician.';

export interface WeightPercentileMathInput {
  ageMonths: number;
  sex: Sex;
  weightKg: number;
}

export interface WeightPercentileMathResult {
  ageMonths: number;
  sex: Sex;
  weightKg: number;
  zScore: number;
  percentile: number;
  medianWeightKg: number;
  formattedWeightKg: string;
  formattedZScore: string;
  formattedPercentile: string;
  sourceLabel: string;
  disclaimer: string;
}

export function ageToMonths(age: number, unit: AgeUnit): number {
  return unit === 'yrs' ? age * 12 : age;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_POUND : value;
}

function lmsForSex(sex: Sex): readonly WhoWfaLms[] {
  return sex === 'boy' ? WHO_WFA_LMS_BOYS : WHO_WFA_LMS_GIRLS;
}

export function lookupWfaLms(ageMonths: number, sex: Sex): WhoWfaLms {
  if (
    !Number.isFinite(ageMonths) ||
    ageMonths < WHO_WFA_AGE_MONTHS_MIN ||
    ageMonths > WHO_WFA_AGE_MONTHS_MAX
  ) {
    throw new Error(
      `Age must be between ${WHO_WFA_AGE_MONTHS_MIN} and ${WHO_WFA_AGE_MONTHS_MAX} months (WHO child standards).`,
    );
  }
  const table = lmsForSex(sex);
  const lo = Math.floor(ageMonths);
  const hi = Math.ceil(ageMonths);
  if (lo === hi) return table[lo]!;
  const t = ageMonths - lo;
  const a = table[lo]!;
  const b = table[hi]!;
  return {
    L: a.L + (b.L - a.L) * t,
    M: a.M + (b.M - a.M) * t,
    S: a.S + (b.S - a.S) * t,
  };
}

export function calculateWeightPercentile(
  input: WeightPercentileMathInput,
): WeightPercentileMathResult {
  const { ageMonths, sex, weightKg } = input;
  if (!Number.isFinite(weightKg) || !(weightKg > 0)) {
    throw new Error('Weight must be a positive finite number.');
  }
  const lms = lookupWfaLms(ageMonths, sex);
  // whoAdjustedZScore accepts WhoBmiLms shape {L,M,S} — same LMS triple.
  const zScore = whoAdjustedZScore(weightKg, lms as WhoBmiLms);
  const percentile = zToPercentile(zScore);
  if (!Number.isFinite(zScore) || !Number.isFinite(percentile)) {
    throw new Error('Unable to compute percentile for these inputs.');
  }
  return {
    ageMonths,
    sex,
    weightKg,
    zScore,
    percentile,
    medianWeightKg: lms.M,
    formattedWeightKg: weightKg.toFixed(2),
    formattedZScore: zScore.toFixed(2),
    formattedPercentile: formatPercentile(percentile),
    sourceLabel: WHO_WFA_SOURCE,
    disclaimer: DISCLAIMER,
  };
}

function formatPercentile(n: number): string {
  if (n < 0.1) return '<0.1';
  if (n > 99.9) return '>99.9';
  return n.toFixed(1);
}
