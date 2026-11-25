/**
 * A Body Shape Index (ABSI) — educational (ADR-018).
 *
 * Krakauer NY, Krakauer JC. A New Body Shape Index Predicts Mortality Hazard
 * Independently of Body Mass Index. PLoS ONE. 2012;7(7):e39504.
 *
 *   BMI = weight_kg / height_m²
 *   ABSI = waist_m / (BMI^(2/3) × height_m^(1/2))
 *   z = (ABSI − mean_age,sex) / SD_age,sex
 *
 * Reference mean/SD: NHANES 1999–2004 Table S1 smoothed values (ages 2–84);
 * age ≥85 uses the age-85 sample mean/SD row.
 */

import {
  ABSI_NHANES_TABLE,
  ABSI_TABLE_AGE_MAX,
  ABSI_TABLE_AGE_MIN,
  type AbsiReference,
} from './nhanes-absi-table';
import type {
  AbsiInput,
  AbsiResult,
  HeightUnit,
  Sex,
  WaistUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'ABSI = waist_m / (BMI^(2/3) × height_m^(1/2)); BMI = kg/m². Z-score uses Krakauer & Krakauer (PLOS One 2012) NHANES 1999–2004 Table S1 age/sex smoothed mean and SD. Educational only.';

export const DISCLAIMER =
  'Not a medical diagnosis, mortality prediction for an individual, or substitute for clinical assessment.';

export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const KG_PER_POUND = 0.45359237;
export const KG_PER_STONE = KG_PER_POUND * 14;

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
      return value / 100;
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
      return meters * 100;
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

export function waistToMeters(value: number, unit: WaistUnit): number {
  switch (unit) {
    case 'm':
      return value;
    case 'cm':
      return value / 100;
    case 'in':
      return value * METERS_PER_INCH;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function metersToWaist(meters: number, unit: WaistUnit): number {
  switch (unit) {
    case 'm':
      return meters;
    case 'cm':
      return meters * 100;
    case 'in':
      return meters / METERS_PER_INCH;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function calculateBmi(heightMeters: number, weightKg: number): number {
  if (!(heightMeters > 0) || !Number.isFinite(heightMeters)) {
    throw new RangeError('Height must be a positive finite number.');
  }
  if (!(weightKg > 0) || !Number.isFinite(weightKg)) {
    throw new RangeError('Weight must be a positive finite number.');
  }
  return weightKg / (heightMeters * heightMeters);
}

/** Krakauer Eq. 3: ABSI = WC / (BMI^(2/3) × height^(1/2)). */
export function calculateAbsiIndex(
  waistMeters: number,
  heightMeters: number,
  weightKg: number,
): number {
  if (!(waistMeters > 0) || !Number.isFinite(waistMeters)) {
    throw new RangeError('Waist must be a positive finite number.');
  }
  const bmi = calculateBmi(heightMeters, weightKg);
  const denom = Math.pow(bmi, 2 / 3) * Math.sqrt(heightMeters);
  if (!(denom > 0) || !Number.isFinite(denom)) {
    throw new RangeError('ABSI denominator is not finite.');
  }
  return waistMeters / denom;
}

export function lookupAbsiReference(
  ageYears: number,
  sex: Sex,
): AbsiReference | null {
  if (!Number.isFinite(ageYears)) return null;
  const age = Math.floor(ageYears);
  if (age < ABSI_TABLE_AGE_MIN) return null;
  const key = age >= ABSI_TABLE_AGE_MAX ? ABSI_TABLE_AGE_MAX : age;
  const row = ABSI_NHANES_TABLE[key];
  if (!row) return null;
  return sex === 'male' ? row.male : row.female;
}

export function calculateAbsiZScore(
  absi: number,
  reference: AbsiReference,
): number {
  if (!(reference.sd > 0) || !Number.isFinite(reference.sd)) {
    throw new RangeError('Reference SD must be positive.');
  }
  return (absi - reference.mean) / reference.sd;
}

export function formatAbsi(absi: number): string {
  if (!Number.isFinite(absi)) return '';
  return absi.toFixed(5);
}

export function formatZScore(z: number): string {
  if (!Number.isFinite(z)) return '';
  const rounded = Math.round(z * 1000) / 1000;
  return rounded.toFixed(3);
}

function emptyResult(partial?: Partial<AbsiResult>): AbsiResult {
  return {
    bmiKgM2: null,
    absi: null,
    absiZScore: null,
    formattedAbsi: '',
    formattedZScore: '',
    referenceMean: null,
    referenceSd: null,
    statusHeadline: 'Enter age, height, weight, and waist circumference.',
    statusDetail:
      'ABSI appears when anthropometrics are valid. The z-score needs an age within the NHANES Table S1 range (2–85+ years).',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateAbsi(input: AbsiInput): AbsiResult {
  const age = parseNumber(input.ageText);
  const heightRaw = parseNumber(input.heightText);
  const weightRaw = parseNumber(input.weightText);
  const waistRaw = parseNumber(input.waistText);

  const hasAnthropometrics =
    heightRaw !== null &&
    weightRaw !== null &&
    waistRaw !== null &&
    heightRaw > 0 &&
    weightRaw > 0 &&
    waistRaw > 0;

  if (!hasAnthropometrics) {
    return emptyResult();
  }

  const heightMeters = heightToMeters(heightRaw, input.heightUnit);
  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const waistMeters = waistToMeters(waistRaw, input.waistUnit);

  let absi: number;
  let bmi: number;
  try {
    bmi = calculateBmi(heightMeters, weightKg);
    absi = calculateAbsiIndex(waistMeters, heightMeters, weightKg);
  } catch {
    return emptyResult({
      statusHeadline: 'Unable to compute ABSI from the entered values.',
      statusDetail: 'Check that height, weight, and waist are positive finite numbers.',
    });
  }

  if (!Number.isFinite(absi) || !Number.isFinite(bmi)) {
    return emptyResult({
      statusHeadline: 'Unable to compute ABSI from the entered values.',
      statusDetail: 'Result was non-finite.',
    });
  }

  const base: AbsiResult = {
    bmiKgM2: Math.round(bmi * 100) / 100,
    absi,
    absiZScore: null,
    formattedAbsi: formatAbsi(absi),
    formattedZScore: '',
    referenceMean: null,
    referenceSd: null,
    statusHeadline: 'ABSI computed.',
    statusDetail:
      age === null
        ? 'Enter age (years) to compute the NHANES age/sex ABSI z-score.'
        : 'Age is outside the NHANES Table S1 reference range (2–85+ years), so the z-score is unavailable.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (age === null) {
    return base;
  }

  const reference = lookupAbsiReference(age, input.sex);
  if (!reference) {
    return base;
  }

  const z = calculateAbsiZScore(absi, reference);
  return {
    ...base,
    absiZScore: z,
    formattedZScore: formatZScore(z),
    referenceMean: reference.mean,
    referenceSd: reference.sd,
    statusHeadline: 'ABSI and z-score computed.',
    statusDetail: `Reference mean ${reference.mean.toFixed(5)} · SD ${reference.sd.toFixed(5)} (NHANES 1999–2004 Table S1, ${input.sex}, age ${Math.min(Math.floor(age), ABSI_TABLE_AGE_MAX)}).`,
  };
}
