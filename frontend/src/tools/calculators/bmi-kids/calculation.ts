/**
 * BMI Calculator for Kids — pure engine (ADR-018).
 *
 * BMI = weight_kg / height_m² (Quetelet).
 * BMI Prime = BMI / 25 (informational only — never used for child category).
 * Child weight status: CDC 2000 BMI-for-age LMS percentiles (ages 2–<20).
 */

import {
  CDC_BMI_LMS_AGE_MONTHS_MAX,
  CDC_BMI_LMS_AGE_MONTHS_MIN,
  CDC_BMI_LMS_ROWS,
  CDC_BMI_LMS_SOURCE,
  type CdcBmiLmsRow,
} from './cdc-bmi-lms';
import type {
  BmiKidsInput,
  BmiKidsResult,
  CdcKidsCategory,
  CdcKidsCategoryId,
  HeightUnit,
  KidsHealthStatus,
  Sex,
  WeightUnit,
} from './types';

export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const CM_PER_METER = 100;
export const KG_PER_POUND = 0.45359237;
export const KG_PER_STONE = KG_PER_POUND * 14;

/** Upper limit of WHO adult normal BMI — BMI Prime denominator only. */
export const BMI_PRIME_REFERENCE = 25;

export const CHILD_AGE_YEARS_MIN = 2;
/** Exclusive upper bound: CDC table ends at 20y (240.5 mo midpoint). */
export const CHILD_AGE_YEARS_MAX_EXCLUSIVE = 20;
export const AGE_YEARS_MAX = 120;

export const CLASSIFICATION_SOURCE = CDC_BMI_LMS_SOURCE;

export const DISCLAIMER =
  'BMI and BMI-for-age percentiles are screening tools only. They do not diagnose health, nutrition, or growth disorders. Seek clinical advice for personal decisions.';

const CDC_CATEGORIES: readonly {
  id: CdcKidsCategoryId;
  label: string;
  minPct: number;
  maxPctExclusive: number | null;
  rangeLabel: string;
}[] = [
  {
    id: 'underweight',
    label: 'Underweight',
    minPct: Number.NEGATIVE_INFINITY,
    maxPctExclusive: 5,
    rangeLabel: '< 5th percentile',
  },
  {
    id: 'healthy_weight',
    label: 'Healthy weight',
    minPct: 5,
    maxPctExclusive: 85,
    rangeLabel: '5th – <85th percentile',
  },
  {
    id: 'overweight',
    label: 'Overweight',
    minPct: 85,
    maxPctExclusive: 95,
    rangeLabel: '85th – <95th percentile',
  },
  {
    id: 'obesity',
    label: 'Obesity',
    minPct: 95,
    maxPctExclusive: null,
    rangeLabel: '≥ 95th percentile',
  },
];

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

export function formatPercentile(pct: number): string {
  if (!Number.isFinite(pct)) return '';
  if (pct < 0.1) return '<0.1';
  if (pct > 99.9) return '>99.9';
  return pct.toFixed(1);
}

/** Abramowitz & Stegun 26.2.17 Φ via erf (max |error| ~ 7.5e-8). */
export function normalCdf(x: number): number {
  if (!Number.isFinite(x)) return Number.NaN;
  if (x === 0) return 0.5;
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

function erf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const a = Math.abs(z);
  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const t = 1 / (1 + p * a);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-a * a);
  return sign * y;
}

export function sexToCdcCode(sex: Sex): 1 | 2 {
  return sex === 'male' ? 1 : 2;
}

export function yearsToAgemos(ageYears: number): number {
  return ageYears * 12;
}

/**
 * CDC LMS z-score for BMI.
 * z = ((BMI/M)^L − 1) / (L·S) when L ≠ 0; else ln(BMI/M)/S.
 */
export function bmiLmsZScore(
  bmi: number,
  L: number,
  M: number,
  S: number,
): number {
  if (!(bmi > 0) || !Number.isFinite(bmi)) {
    throw new RangeError('BMI must be positive and finite.');
  }
  if (!(M > 0) || !Number.isFinite(M) || !Number.isFinite(S) || S === 0) {
    throw new RangeError('Invalid LMS parameters.');
  }
  if (!Number.isFinite(L)) {
    throw new RangeError('Invalid LMS L parameter.');
  }
  if (L === 0) {
    return Math.log(bmi / M) / S;
  }
  return (Math.pow(bmi / M, L) - 1) / (L * S);
}

/** Linear interpolation of L/M/S between neighboring CDC age midpoints. */
export function interpolateLms(
  sex: Sex,
  agemos: number,
): CdcBmiLmsRow | null {
  if (!Number.isFinite(agemos)) return null;
  if (
    agemos < CDC_BMI_LMS_AGE_MONTHS_MIN ||
    agemos > CDC_BMI_LMS_AGE_MONTHS_MAX
  ) {
    return null;
  }

  const code = sexToCdcCode(sex);
  const rows = CDC_BMI_LMS_ROWS.filter((r) => r.sex === code);
  if (rows.length === 0) return null;

  const first = rows[0]!;
  const last = rows[rows.length - 1]!;
  if (agemos <= first.agemos) return first;
  if (agemos >= last.agemos) return last;

  for (let i = 1; i < rows.length; i += 1) {
    const right = rows[i]!;
    const left = rows[i - 1]!;
    if (agemos === right.agemos) return right;
    if (agemos < right.agemos) {
      const span = right.agemos - left.agemos;
      if (!(span > 0)) return left;
      const t = (agemos - left.agemos) / span;
      return {
        sex: code,
        agemos,
        L: left.L + t * (right.L - left.L),
        M: left.M + t * (right.M - left.M),
        S: left.S + t * (right.S - left.S),
      };
    }
  }
  return last;
}

export function classifyCdcPercentile(percentile: number): CdcKidsCategory {
  if (!Number.isFinite(percentile)) {
    throw new RangeError('Percentile must be finite.');
  }
  for (const row of CDC_CATEGORIES) {
    const underMax =
      row.maxPctExclusive === null ? true : percentile < row.maxPctExclusive;
    if (percentile >= row.minPct && underMax) {
      return {
        id: row.id,
        label: row.label,
        rangeLabel: row.rangeLabel,
      };
    }
  }
  const last = CDC_CATEGORIES[CDC_CATEGORIES.length - 1]!;
  return {
    id: last.id,
    label: last.label,
    rangeLabel: last.rangeLabel,
  };
}

function healthPath(
  healthOpen: boolean,
  ageRaw: string,
  ageYears: number | null,
  sex: Sex,
  bmi: number,
): Pick<
  BmiKidsResult,
  | 'healthStatus'
  | 'ageYears'
  | 'sex'
  | 'zScore'
  | 'percentile'
  | 'formattedPercentile'
  | 'category'
  | 'healthNote'
> {
  if (!healthOpen) {
    return {
      healthStatus: 'collapsed',
      ageYears: null,
      sex: null,
      zScore: null,
      percentile: null,
      formattedPercentile: null,
      category: null,
      healthNote:
        'Open “How healthy is this BMI?” and enter exact age and sex for a CDC BMI-for-age percentile. BMI Prime never sets a child weight category.',
    };
  }

  if (ageRaw.trim() === '' || ageYears == null) {
    return {
      healthStatus: 'needs_demographics',
      ageYears: null,
      sex,
      zScore: null,
      percentile: null,
      formattedPercentile: null,
      category: null,
      healthNote:
        'Enter exact age in years and select sex. Child weight status uses CDC BMI-for-age LMS percentiles — not adult WHO cut-offs or BMI Prime.',
    };
  }

  if (ageYears < CHILD_AGE_YEARS_MIN) {
    return {
      healthStatus: 'below_chart_age',
      ageYears,
      sex,
      zScore: null,
      percentile: null,
      formattedPercentile: null,
      category: null,
      healthNote: `CDC BMI-for-age charts start at age ${CHILD_AGE_YEARS_MIN}. For younger children, use clinical growth charts instead of adult BMI categories.`,
    };
  }

  if (ageYears >= CHILD_AGE_YEARS_MAX_EXCLUSIVE) {
    return {
      healthStatus: 'above_chart_age',
      ageYears,
      sex,
      zScore: null,
      percentile: null,
      formattedPercentile: null,
      category: null,
      healthNote:
        'This kids calculator does not apply adult WHO BMI categories. Ages 20+ belong on an adult BMI tool; CDC BMI-for-age ends before age 20.',
    };
  }

  const agemos = yearsToAgemos(ageYears);
  const lms = interpolateLms(sex, agemos);
  if (!lms) {
    return {
      healthStatus: 'lms_unavailable',
      ageYears,
      sex,
      zScore: null,
      percentile: null,
      formattedPercentile: null,
      category: null,
      healthNote:
        'Age is outside the bundled CDC LMS table window (24–240.5 months).',
    };
  }

  let z: number;
  try {
    z = bmiLmsZScore(bmi, lms.L, lms.M, lms.S);
  } catch {
    return {
      healthStatus: 'lms_unavailable',
      ageYears,
      sex,
      zScore: null,
      percentile: null,
      formattedPercentile: null,
      category: null,
      healthNote: 'Unable to compute a CDC z-score for these inputs.',
    };
  }

  const percentile = normalCdf(z) * 100;
  if (!Number.isFinite(percentile)) {
    return {
      healthStatus: 'lms_unavailable',
      ageYears,
      sex,
      zScore: z,
      percentile: null,
      formattedPercentile: null,
      category: null,
      healthNote: 'Unable to convert z-score to a percentile.',
    };
  }

  const category = classifyCdcPercentile(percentile);
  return {
    healthStatus: 'classified' satisfies KidsHealthStatus,
    ageYears,
    sex,
    zScore: z,
    percentile,
    formattedPercentile: formatPercentile(percentile),
    category,
    healthNote: `${category.label} (${category.rangeLabel}). Percentile ≈ ${formatPercentile(percentile)}th on CDC BMI-for-age for ${sex === 'male' ? 'boys' : 'girls'} at age ${ageYears} years. BMI Prime is shown for reference only and does not define this category.`,
  };
}

export function calculateBmiKids(input: BmiKidsInput): BmiKidsResult | null {
  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);
  if (heightVal == null || weightVal == null) return null;
  if (heightVal <= 0 || weightVal <= 0) return null;

  const heightMeters = heightToMeters(heightVal, input.heightUnit);
  const weightKg = weightToKg(weightVal, input.weightUnit);
  if (!(heightMeters > 0) || !(weightKg > 0)) return null;
  // Kids stature/mass ceilings (not adult).
  if (heightMeters > 2.5 || weightKg > 250) return null;

  let bmi: number;
  try {
    bmi = calculateBmi(heightMeters, weightKg);
  } catch {
    return null;
  }
  if (!Number.isFinite(bmi) || bmi <= 0 || bmi > 100) return null;

  const bmiPrime = calculateBmiPrime(bmi);
  const ageParsed = parseNumber(input.ageYears);
  const ageYears =
    ageParsed != null &&
    Number.isFinite(ageParsed) &&
    ageParsed >= 0 &&
    ageParsed <= AGE_YEARS_MAX
      ? ageParsed
      : null;

  const sex: Sex = input.sex === 'male' ? 'male' : 'female';
  const health = healthPath(
    input.healthOpen,
    input.ageYears,
    ageYears,
    sex,
    bmi,
  );

  return {
    heightMeters,
    weightKg,
    bmi,
    bmiPrime,
    formattedBmi: formatBmi(bmi),
    formattedBmiPrime: formatBmiPrime(bmiPrime),
    ...health,
    classificationSource: CLASSIFICATION_SOURCE,
    disclaimer: DISCLAIMER,
  };
}
