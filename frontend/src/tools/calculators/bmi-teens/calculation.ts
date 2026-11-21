/**
 * BMI Calculator for Teens — pure engine (ADR-018).
 *
 * BMI = weight_kg / height_m² (Quetelet).
 * BMI Prime = BMI / 25 (reference only — never used for teen weight category).
 * Interpretation: CDC 2000 BMI-for-age LMS percentiles (sex-specific), ages 10–20.
 */

import { CDC_BMI_TEENS_LMS } from './cdc-bmi-lms';
import type {
  BmiTeensInput,
  BmiTeensResult,
  HeightUnit,
  Sex,
  TeenBmiCategory,
  WeightUnit,
} from './types';

export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const CM_PER_METER = 100;
export const KG_PER_POUND = 0.45359237;
export const KG_PER_STONE = KG_PER_POUND * 14;

/** Upper limit of WHO adult normal BMI — BMI Prime denominator only. */
export const BMI_PRIME_REFERENCE = 25;

/** Screenshot / prompt age bounds (years, inclusive). */
export const TEEN_AGE_MIN = 10;
export const TEEN_AGE_MAX = 20;

export const CLASSIFICATION_SOURCE =
  'CDC 2000 BMI-for-age growth charts (LMS). Categories: underweight <5th; healthy 5th–<85th; overweight 85th–<95th; obesity ≥95th. BMI Prime = BMI ÷ 25 is not used for teen classification.';

export const DISCLAIMER =
  'BMI-for-age is a screening index only. It does not diagnose health, body fat, or athletic readiness. Seek clinical advice for personal decisions.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToMeters(value: number, unit: HeightUnit): number {
  switch (unit) {
    case 'm':
      return value;
    case 'cm':
      return value / CM_PER_METER;
    case 'in':
      return value * METERS_PER_INCH;
    case 'ft':
      return value * METERS_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function metersToHeight(meters: number, unit: HeightUnit): number {
  switch (unit) {
    case 'm':
      return meters;
    case 'cm':
      return meters * CM_PER_METER;
    case 'in':
      return meters / METERS_PER_INCH;
    case 'ft':
      return meters / METERS_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function weightToKg(value: number, unit: WeightUnit): number {
  switch (unit) {
    case 'kg':
      return value;
    case 'lb':
      return value * KG_PER_POUND;
    case 'st':
      return value * KG_PER_STONE;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  switch (unit) {
    case 'kg':
      return kg;
    case 'lb':
      return kg / KG_PER_POUND;
    case 'st':
      return kg / KG_PER_STONE;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

/** Quetelet index: BMI = mass_kg / height_m². */
export function calculateBmi(heightMeters: number, weightKg: number): number {
  if (!(heightMeters > 0) || !Number.isFinite(heightMeters)) {
    throw new RangeError('Height must be a positive finite number.');
  }
  if (!(weightKg > 0) || !Number.isFinite(weightKg)) {
    throw new RangeError('Weight must be a positive finite number.');
  }
  return weightKg / (heightMeters * heightMeters);
}

export function calculateBmiPrime(bmi: number): number {
  if (!Number.isFinite(bmi)) {
    throw new RangeError('BMI must be finite.');
  }
  return bmi / BMI_PRIME_REFERENCE;
}

export function formatBmi(bmi: number): string {
  if (!Number.isFinite(bmi)) return '';
  return bmi.toFixed(2);
}

export function formatBmiPrime(prime: number): string {
  if (!Number.isFinite(prime)) return '';
  return prime.toFixed(2);
}

export function formatPercentile(p: number): string {
  if (!Number.isFinite(p)) return '';
  if (p < 0.1) return '<0.1';
  if (p > 99.9) return '>99.9';
  return p.toFixed(1);
}

/** Age years → CDC mid-month Agemos key (floor(months)+0.5). */
export function ageYearsToAgemos(ageYears: number): number {
  const months = ageYears * 12;
  return Math.floor(months) + 0.5;
}

export function sexToCdcCode(sex: Sex): 1 | 2 {
  return sex === 'male' ? 1 : 2;
}

export function lookupCdcLms(
  sex: Sex,
  ageYears: number,
): { L: number; M: number; S: number; agemos: number } | null {
  if (
    !Number.isFinite(ageYears) ||
    ageYears < TEEN_AGE_MIN ||
    ageYears > TEEN_AGE_MAX
  ) {
    return null;
  }
  const sexCode = sexToCdcCode(sex);
  const target = ageYearsToAgemos(ageYears);
  let best: (typeof CDC_BMI_TEENS_LMS)[number] | null = null;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const row of CDC_BMI_TEENS_LMS) {
    if (row[0] !== sexCode) continue;
    const dist = Math.abs(row[1] - target);
    if (dist < bestDist) {
      bestDist = dist;
      best = row;
    }
  }
  if (!best || bestDist > 0.51) return null;
  return { L: best[2], M: best[3], S: best[4], agemos: best[1] };
}

/** CDC LMS z-score for BMI. */
export function bmiToZScore(
  bmi: number,
  L: number,
  M: number,
  S: number,
): number {
  if (!(bmi > 0) || !(M > 0) || !(S > 0) || !Number.isFinite(L)) {
    throw new RangeError('Invalid LMS or BMI for z-score.');
  }
  if (Math.abs(L) < 1e-12) {
    return Math.log(bmi / M) / S;
  }
  return (Math.pow(bmi / M, L) - 1) / (L * S);
}

/** Standard normal CDF via erf (Abramowitz & Stegun 7.1.26). */
export function normalCdf(z: number): number {
  if (!Number.isFinite(z)) return Number.NaN;
  // Φ(z) = ½(1+erf(z/√2))
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function erf(x: number): number {
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

export function zScoreToPercentile(z: number): number {
  return normalCdf(z) * 100;
}

/**
 * CDC weight-status categories from BMI-for-age percentile.
 * Never derived from BMI Prime.
 */
export function classifyTeenPercentile(percentile: number): TeenBmiCategory {
  if (!(percentile >= 0) || !Number.isFinite(percentile)) {
    throw new RangeError('Percentile must be a finite non-negative number.');
  }
  if (percentile < 5) {
    return {
      id: 'underweight',
      label: 'Underweight',
      rangeLabel: '< 5th percentile',
    };
  }
  if (percentile < 85) {
    return {
      id: 'healthy',
      label: 'Healthy weight',
      rangeLabel: '5th – < 85th percentile',
    };
  }
  if (percentile < 95) {
    return {
      id: 'overweight',
      label: 'Overweight',
      rangeLabel: '85th – < 95th percentile',
    };
  }
  return {
    id: 'obesity',
    label: 'Obesity',
    rangeLabel: '≥ 95th percentile',
  };
}

export function calculateBmiTeens(input: BmiTeensInput): BmiTeensResult | null {
  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);
  if (heightVal == null || weightVal == null) return null;
  if (heightVal <= 0 || weightVal <= 0) return null;

  const heightMeters = heightToMeters(heightVal, input.heightUnit);
  const weightKg = weightToKg(weightVal, input.weightUnit);
  if (!(heightMeters > 0) || !(weightKg > 0)) return null;
  if (heightMeters > 3.5 || weightKg > 500) return null;

  let bmi: number;
  try {
    bmi = calculateBmi(heightMeters, weightKg);
  } catch {
    return null;
  }
  if (!Number.isFinite(bmi) || bmi <= 0 || bmi > 200) return null;

  const bmiPrime = calculateBmiPrime(bmi);
  const sex: Sex | null =
    input.sex === 'female' || input.sex === 'male' ? input.sex : null;
  const ageParsed = parseNumber(input.age);
  const ageYears =
    ageParsed != null && Number.isFinite(ageParsed) ? ageParsed : null;

  const base = {
    heightMeters,
    weightKg,
    bmi,
    bmiPrime,
    formattedBmi: formatBmi(bmi),
    formattedBmiPrime: formatBmiPrime(bmiPrime),
    sex,
    ageYears,
    classificationSource: CLASSIFICATION_SOURCE,
    disclaimer: DISCLAIMER,
  };

  if (sex == null || ageYears == null || input.age.trim() === '') {
    return {
      ...base,
      interpretationStatus: 'needs_demographics',
      interpretationNote:
        'Enter sex and age (10–20 years) to compare BMI with CDC BMI-for-age percentiles. BMI Prime is shown for reference only and does not classify teen weight status.',
      percentile: null,
      zScore: null,
      formattedPercentile: null,
      category: null,
    };
  }

  if (ageYears < TEEN_AGE_MIN || ageYears > TEEN_AGE_MAX) {
    return {
      ...base,
      interpretationStatus: 'age_out_of_range',
      interpretationNote: `This calculator’s CDC BMI-for-age path is limited to ages ${TEEN_AGE_MIN}–${TEEN_AGE_MAX} years. Ages under ${TEEN_AGE_MIN} belong on a kids/percentile tool; ages over ${TEEN_AGE_MAX} use adult WHO BMI categories.`,
      percentile: null,
      zScore: null,
      formattedPercentile: null,
      category: null,
    };
  }

  const lms = lookupCdcLms(sex, ageYears);
  if (!lms) {
    return {
      ...base,
      interpretationStatus: 'age_out_of_range',
      interpretationNote:
        'No CDC LMS row matched this age within the teens chart. Check age (10–20 years).',
      percentile: null,
      zScore: null,
      formattedPercentile: null,
      category: null,
    };
  }

  let z: number;
  try {
    z = bmiToZScore(bmi, lms.L, lms.M, lms.S);
  } catch {
    return null;
  }
  if (!Number.isFinite(z)) return null;

  const percentile = zScoreToPercentile(z);
  if (!Number.isFinite(percentile)) return null;
  const category = classifyTeenPercentile(percentile);

  return {
    ...base,
    interpretationStatus: 'ready',
    interpretationNote: `CDC BMI-for-age (Agemos ${lms.agemos}): ${category.label} (${category.rangeLabel}). BMI Prime is not used for this classification.`,
    percentile,
    zScore: z,
    formattedPercentile: formatPercentile(percentile),
    category,
  };
}

/** Privacy-safe share: public page URL only — never H/W/age/sex. */
export function shareBmiTeensText(pageUrl: string): string {
  return [
    'BMI Calculator for Teens | Omega Calculators',
    '',
    'Teen BMI and CDC BMI-for-age screening on Omega Calculators.',
    pageUrl,
  ].join('\n');
}
