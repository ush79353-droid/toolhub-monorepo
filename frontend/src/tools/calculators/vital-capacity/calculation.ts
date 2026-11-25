/**
 * Anthropometric predicted vital capacity (Baldwin et al., as used on Omni Calculators).
 * VC (L) = height (cm) × (intercept − ageSlope × age) ÷ 1000 — equivalent to cm³ ÷ 1000.
 * Not spirometry and not IRV+TV+ERV (see Lung Capacity Calculator).
 */
import { DISCLAIMER, SOURCE_NOTE } from './content';
import type {
  HeightUnit,
  Sex,
  VitalCapacityInput,
  VitalCapacityResult,
  VolumeUnit,
} from './types';

export { DISCLAIMER, SOURCE_NOTE };

const COEFF: Record<Sex, { intercept: number; ageSlope: number }> = {
  female: { intercept: 21.78, ageSlope: 0.101 },
  male: { intercept: 27.63, ageSlope: 0.112 },
};

export const MIN_AGE_YEARS = 1;
export const MAX_AGE_YEARS = 120;
export const MIN_HEIGHT_CM = 50;
export const MAX_HEIGHT_CM = 250;

export function heightToCm(value: number, unit: HeightUnit): number {
  if (unit === 'cm') return value;
  if (unit === 'm') return value * 100;
  return value * 2.54;
}

export function cmToHeightUnit(cm: number, unit: HeightUnit): number {
  if (unit === 'cm') return cm;
  if (unit === 'm') return cm / 100;
  return cm / 2.54;
}

export function volumeFromLiters(liters: number, unit: VolumeUnit): number {
  return unit === 'L' ? liters : liters * 1000;
}

export function formatVc(liters: number, unit: VolumeUnit): string {
  const v = volumeFromLiters(liters, unit);
  if (unit === 'L') return `${Math.round(v * 1000) / 1000} L`;
  return `${Math.round(v * 10) / 10} mL`;
}

/** Baldwin anthropometric predicted VC in liters. */
export function predictedVcLiters(
  sex: Sex,
  ageYears: number,
  heightCm: number,
): number {
  const { intercept, ageSlope } = COEFF[sex];
  const factor = intercept - ageSlope * ageYears;
  return (heightCm * factor) / 1000;
}

export function calculateVitalCapacity(
  input: VitalCapacityInput,
): VitalCapacityResult {
  const empty: VitalCapacityResult = {
    heightCm: null,
    vcLiters: null,
    formattedVc: '',
    statusHeadline: 'Enter age and height',
    statusDetail:
      'Predicted vital capacity from sex, age, and height. Not measured spirometry.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (input.ageYears == null || input.height == null) {
    return empty;
  }

  const heightCm = heightToCm(input.height, input.heightUnit);
  const vcLiters = predictedVcLiters(input.sex, input.ageYears, heightCm);

  return {
    heightCm,
    vcLiters,
    formattedVc: formatVc(vcLiters, input.volumeUnit),
    statusHeadline: 'Predicted vital capacity',
    statusDetail: `${formatVc(vcLiters, input.volumeUnit)} — anthropometric estimate for ${input.sex === 'female' ? 'women' : 'men'} aged ${input.ageYears} at ${Math.round(heightCm * 10) / 10} cm. Typical adult VC is often 3–5 L; interpret with clinical context.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}