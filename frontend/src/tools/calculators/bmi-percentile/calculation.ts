import {
  WHO_BMI_AGE_MONTHS_MAX,
  WHO_BMI_AGE_MONTHS_MIN,
  WHO_BMI_LMS_BOYS,
  WHO_BMI_LMS_GIRLS,
  type WhoBmiLms,
} from './datasets';
import type { AgeUnit, HeightUnit, Sex, WeightUnit } from './types';

/** Exact international inch. */
export const CM_PER_INCH = 2.54;
/** Exact avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;

export const WHO_BMI_SOURCE =
  "This tool is based on WHO's child growth standards.";

export const DISCLAIMER =
  'Educational BMI-for-age percentile using WHO Child Growth Standards (0–60 months). Not a diagnosis. Discuss results with a qualified clinician.';

export interface BmiPercentileMathInput {
  ageMonths: number;
  sex: Sex;
  bmi: number;
}

export interface BmiPercentileMathResult {
  ageMonths: number;
  sex: Sex;
  bmi: number;
  zScore: number;
  percentile: number;
  medianBmi: number;
  formattedBmi: string;
  formattedZScore: string;
  formattedPercentile: string;
  sourceLabel: string;
  disclaimer: string;
}

export function ageToMonths(age: number, unit: AgeUnit): number {
  if (unit === 'yrs') return age * 12;
  return age;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  return unit === 'in' ? value * CM_PER_INCH : value;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_POUND : value;
}

export function computeBmiFromAnthropometry(
  heightCm: number,
  weightKg: number
): number {
  if (!(heightCm > 0) || !(weightKg > 0)) {
    throw new Error('Height and weight must be positive.');
  }
  const meters = heightCm / 100;
  return weightKg / (meters * meters);
}

function lmsForSex(sex: Sex): readonly WhoBmiLms[] {
  return sex === 'boy' ? WHO_BMI_LMS_BOYS : WHO_BMI_LMS_GIRLS;
}

/**
 * Lookup LMS at a completed-month index. Fractional months interpolate
 * linearly between neighboring completed months (no extrapolation).
 */
export function lookupLms(ageMonths: number, sex: Sex): WhoBmiLms {
  if (
    !Number.isFinite(ageMonths) ||
    ageMonths < WHO_BMI_AGE_MONTHS_MIN ||
    ageMonths > WHO_BMI_AGE_MONTHS_MAX
  ) {
    throw new Error(
      `Age must be between ${WHO_BMI_AGE_MONTHS_MIN} and ${WHO_BMI_AGE_MONTHS_MAX} months (WHO child standards).`
    );
  }

  const table = lmsForSex(sex);
  const lo = Math.floor(ageMonths);
  const hi = Math.ceil(ageMonths);
  if (lo === hi) {
    return table[lo]!;
  }
  const t = ageMonths - lo;
  const a = table[lo]!;
  const b = table[hi]!;
  return {
    L: a.L + (b.L - a.L) * t,
    M: a.M + (b.M - a.M) * t,
    S: a.S + (b.S - a.S) * t,
  };
}

/** Standard LMS z before WHO ±3 SD tail restriction. */
export function lmsZScore(y: number, lms: WhoBmiLms): number {
  const { L, M, S } = lms;
  if (!(y > 0) || !(M > 0) || !(S > 0)) {
    throw new Error('BMI and LMS parameters must be positive.');
  }
  if (L === 0) {
    return Math.log(y / M) / S;
  }
  return (Math.pow(y / M, L) - 1) / (L * S);
}

function lmsValueAtZ(z: number, lms: WhoBmiLms): number {
  const { L, M, S } = lms;
  if (L === 0) {
    return M * Math.exp(S * z);
  }
  return M * Math.pow(1 + L * S * z, 1 / L);
}

/**
 * WHO restricted LMS z-score (Child Growth Standards / 2007 computation notes):
 * use LMS z when |z| ≤ 3; beyond ±3, fix outer SD distance to SD3−SD2.
 */
export function whoAdjustedZScore(y: number, lms: WhoBmiLms): number {
  const z = lmsZScore(y, lms);
  if (z > 3) {
    const sd3 = lmsValueAtZ(3, lms);
    const sd2 = lmsValueAtZ(2, lms);
    const sd23 = sd3 - sd2;
    if (!(sd23 > 0)) return z;
    return 3 + (y - sd3) / sd23;
  }
  if (z < -3) {
    const sd3 = lmsValueAtZ(-3, lms);
    const sd2 = lmsValueAtZ(-2, lms);
    const sd23 = sd2 - sd3;
    if (!(sd23 > 0)) return z;
    return -3 + (y - sd3) / sd23;
  }
  return z;
}

/** Φ(z) via erf — standard normal CDF. */
export function standardNormalCdf(z: number): number {
  if (!Number.isFinite(z)) return NaN;
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function erf(x: number): number {
  // Abramowitz & Stegun 7.1.26
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

export function zToPercentile(z: number): number {
  return 100 * standardNormalCdf(z);
}

export function calculateBmiPercentile(
  input: BmiPercentileMathInput
): BmiPercentileMathResult {
  const { ageMonths, sex, bmi } = input;
  if (!Number.isFinite(bmi) || bmi <= 0) {
    throw new Error('BMI must be a positive finite number.');
  }

  const lms = lookupLms(ageMonths, sex);
  const zScore = whoAdjustedZScore(bmi, lms);
  const percentile = zToPercentile(zScore);

  if (!Number.isFinite(zScore) || !Number.isFinite(percentile)) {
    throw new Error('Unable to compute percentile for these inputs.');
  }

  return {
    ageMonths,
    sex,
    bmi,
    zScore,
    percentile,
    medianBmi: lms.M,
    formattedBmi: formatBmi(bmi),
    formattedZScore: formatZ(zScore),
    formattedPercentile: formatPercentile(percentile),
    sourceLabel: WHO_BMI_SOURCE,
    disclaimer: DISCLAIMER,
  };
}

function formatBmi(n: number): string {
  return n.toFixed(2);
}

function formatZ(n: number): string {
  return n.toFixed(2);
}

function formatPercentile(n: number): string {
  if (n < 0.1) return '<0.1';
  if (n > 99.9) return '>99.9';
  return n.toFixed(1);
}
