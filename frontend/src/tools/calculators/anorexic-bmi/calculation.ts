import type {
  AnorexicBmiResult,
  OtherHeightUnit,
  OtherWeightUnit,
  Sex,
} from './types';

/** Exact international inch. */
export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const CM_PER_METER = 100;

/** Exact avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;
/** Exact: 1 stone = 14 lb. */
export const KG_PER_STONE = KG_PER_POUND * 14;

/**
 * WHO adult BMI categories apply to ages 20 and older (WHO / CDC adult charts).
 * Upper bound is a practical validation ceiling, not a clinical cutoff.
 */
export const ADULT_BMI_AGE_MIN = 20;
export const ADULT_BMI_AGE_MAX = 120;

/** WHO adult “normal” BMI interval (kg/m²). */
export const WHO_ADULT_HEALTHY_BMI_MIN = 18.5;
export const WHO_ADULT_HEALTHY_BMI_MAX = 24.9;

export const WHO_ADULT_BMI_SOURCE =
  'WHO adult BMI categories (ages ≥20): normal weight 18.5–24.9 kg/m²';

export const DISCLAIMER =
  'BMI is a screening measure only. It cannot diagnose or exclude anorexia nervosa or any eating disorder. Seek specialist clinical review for interpretation.';

export interface AnorexicBmiMathInput {
  age: number;
  sex: Sex;
  heightMeters: number;
  weightKg: number;
}

export function heightToMeters(
  value: number,
  unit: OtherHeightUnit
): number {
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

export function metersToHeight(
  meters: number,
  unit: OtherHeightUnit
): number {
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

export function weightToKg(value: number, unit: OtherWeightUnit): number {
  switch (unit) {
    case 'kg':
      return value;
    case 'g':
      return value / 1000;
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

export function kgToWeight(kg: number, unit: OtherWeightUnit): number {
  switch (unit) {
    case 'kg':
      return kg;
    case 'g':
      return kg * 1000;
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

export function usHeightToMeters(feet: number, inches: number): number {
  return feet * METERS_PER_FOOT + inches * METERS_PER_INCH;
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

export function formatBmi(bmi: number): string {
  if (!Number.isFinite(bmi)) return '';
  return bmi.toFixed(2);
}

export function isAdultReferenceAge(age: number): boolean {
  return (
    Number.isFinite(age) &&
    age >= ADULT_BMI_AGE_MIN &&
    age <= ADULT_BMI_AGE_MAX
  );
}

export function calculateAnorexicBmi(
  input: AnorexicBmiMathInput
): AnorexicBmiResult {
  const bmi = calculateBmi(input.heightMeters, input.weightKg);
  const adultReferenceApplicable = isAdultReferenceAge(input.age);

  return {
    bmi,
    formattedBmi: formatBmi(bmi),
    age: input.age,
    sex: input.sex,
    heightMeters: input.heightMeters,
    weightKg: input.weightKg,
    adultReferenceApplicable,
    healthyRangeLabel: adultReferenceApplicable
      ? `${WHO_ADULT_HEALTHY_BMI_MIN} – ${WHO_ADULT_HEALTHY_BMI_MAX} kg/m²`
      : null,
    healthyRangeSource: WHO_ADULT_BMI_SOURCE,
    interpretationNote:
      'BMI alone cannot diagnose or exclude an eating disorder. Clinical assessment is required.',
    disclaimer: DISCLAIMER,
  };
}
