/**
 * Calorie Intake Calculator (Simple) — pure engine (ADR-018).
 *
 * Mifflin–St Jeor BMR × Omni Simple PAL table
 * (https://www.omnicalculator.com/health/simple-calorie-intake).
 * Same adult BMR basis as the Calorie Calculator sibling; Simple uses the
 * five Omni Simple activity labels/PALs only.
 */

import {
  activityById,
  type ActivityId,
  type CalorieIntakeSimpleInput,
  type CalorieIntakeSimpleResult,
  type HeightUnit,
  type Sex,
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

export function convertHeightValue(
  value: number,
  from: HeightUnit,
  to: HeightUnit,
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
  to: WeightUnit,
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
  sex: Sex,
): number | null {
  if (![weightKg, heightCm, ageYears].every((n) => Number.isFinite(n) && n > 0)) {
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

export function calculateCalorieIntakeSimpleFromInput(
  input: CalorieIntakeSimpleInput,
): CalorieIntakeSimpleResult | null {
  const age = Number(input.ageYears.trim().replace(/,/g, ''));
  const heightRaw = Number(input.heightValue.trim().replace(/,/g, ''));
  const weightRaw = Number(input.weightValue.trim().replace(/,/g, ''));
  if (![age, heightRaw, weightRaw].every(Number.isFinite)) return null;
  if (age <= 0 || age > 120) return null;

  const heightCm = heightToCm(heightRaw, input.heightUnit);
  const weightKg = weightToKg(weightRaw, input.weightUnit);
  if (heightCm == null || weightKg == null) return null;

  const bmr = mifflinStJeorBmrKcal(weightKg, heightCm, age, input.sex);
  if (bmr == null || bmr <= 0) return null;

  const activity = activityById(input.activityId as ActivityId);
  const tdee = bmr * activity.pal;
  if (!Number.isFinite(tdee) || tdee <= 0) return null;

  return {
    bmrKcal: bmr,
    tdeeKcal: tdee,
    pal: activity.pal,
    activityLabel: activity.label,
    formattedTdee: formatKcal(tdee),
    formattedBmr: formatKcal(bmr),
    explanation: `Mifflin–St Jeor BMR ≈ ${formatKcal(bmr)} kcal/day × PAL ${activity.pal} (${activity.label}) ≈ ${formatKcal(tdee)} kcal/day maintenance.`,
    disclaimer:
      'Educational estimate for healthy adults using Mifflin–St Jeor and Omni Simple activity factors. Not medical advice; needs differ in pregnancy, illness, and elite sport.',
  };
}
