/**
 * Calorie Calculator — pure engine (ADR-018).
 *
 * Mifflin–St Jeor BMR (kcal/day):
 *   male:   10W + 6.25H − 5A + 5
 *   female: 10W + 6.25H − 5A − 161
 * where W=kg, H=cm, A=years.
 * TDEE = BMR × PAL (Omni Calorie Calculator–style factors).
 */

import {
  activityById,
  type ActivityId,
  type CalorieInput,
  type CalorieResult,
  type CalorieSex,
  type HeightUnit,
  type WeightUnit,
} from './types';

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

/** Preserve physical height when switching units. */
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

export function mifflinStJeorBmrKcal(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  sex: CalorieSex
): number | null {
  if (
    ![weightKg, heightCm, ageYears].every(
      (n) => Number.isFinite(n) && n > 0
    )
  ) {
    return null;
  }
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const bmr = sex === 'male' ? base + 5 : base - 161;
  return Number.isFinite(bmr) ? bmr : null;
}

export function formatKcal(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return Math.round(n).toLocaleString('en-US');
}

export function calculateCalorieFromInput(
  input: CalorieInput
): CalorieResult | null {
  const age = Number(input.ageYears.trim().replace(/,/g, ''));
  const heightRaw = Number(input.heightValue.trim().replace(/,/g, ''));
  const weightRaw = Number(input.weightValue.trim().replace(/,/g, ''));
  if (![age, heightRaw, weightRaw].every(Number.isFinite)) return null;

  const heightCm = heightToCm(heightRaw, input.heightUnit);
  const weightKg = weightToKg(weightRaw, input.weightUnit);
  if (heightCm == null || weightKg == null) return null;

  const bmr = mifflinStJeorBmrKcal(weightKg, heightCm, age, input.sex);
  if (bmr == null) return null;

  const activity = activityById(input.activityId as ActivityId);
  const tdee = bmr * activity.pal;
  if (!Number.isFinite(tdee)) return null;

  return {
    sex: input.sex,
    ageYears: age,
    heightCm,
    weightKg,
    activityId: activity.id,
    activityLabel: activity.label,
    pal: activity.pal,
    bmrKcal: bmr,
    tdeeKcal: tdee,
    formattedBmr: formatKcal(bmr),
    formattedTdee: formatKcal(tdee),
    explanation: `Mifflin–St Jeor BMR ≈ ${formatKcal(bmr)} kcal/day × PAL ${activity.pal} (${activity.label}) ≈ ${formatKcal(tdee)} kcal/day.`,
  };
}
