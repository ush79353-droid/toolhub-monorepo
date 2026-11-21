/**
 * Weight Gain Calculator — pure engine (ADR-018).
 *
 * Maintenance = Mifflin–St Jeor BMR × PAL (same bands as Calorie Calculator).
 * Gain surplus: Normal 0.5 kg/week → +500 kcal/day; Strict 1 kg/week → +1000 kcal/day
 * (≈7700 kcal per kg tissue energy heuristic).
 * Weeks to goal = (target − current) / kgPerWeek when target > current.
 */

import {
  activityById,
  GAIN_PACE_KG_PER_WEEK,
  GAIN_PACE_SURPLUS_KCAL,
  type GainPace,
  type HeightUnit,
  type WeightGainInput,
  type WeightGainResult,
  type WeightGainSex,
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

export function convertHeight(
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

export function convertWeight(
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
  sex: WeightGainSex
): number | null {
  if (![weightKg, heightCm, ageYears].every((n) => Number.isFinite(n) && n > 0)) {
    return null;
  }
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const bmr = sex === 'male' ? base + 5 : base - 161;
  return Number.isFinite(bmr) ? bmr : null;
}

export function formatKcal(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

export function weeksToGoal(
  currentKg: number,
  targetKg: number,
  kgPerWeek: number
): { weeks: number | null; feasible: boolean; message: string | null } {
  if (![currentKg, targetKg, kgPerWeek].every(Number.isFinite) || kgPerWeek <= 0) {
    return { weeks: null, feasible: false, message: 'Unable to estimate goal timeline.' };
  }
  const delta = targetKg - currentKg;
  if (delta === 0) {
    return {
      weeks: 0,
      feasible: false,
      message: 'Target equals current weight — no gain plan needed.',
    };
  }
  if (delta < 0) {
    return {
      weeks: null,
      feasible: false,
      message: 'Target is below current weight — use a weight-loss tool instead.',
    };
  }
  const weeks = delta / kgPerWeek;
  if (!Number.isFinite(weeks) || weeks > 520) {
    return {
      weeks: null,
      feasible: false,
      message: 'Goal timeline exceeds practical planning range (10 years).',
    };
  }
  return { weeks, feasible: true, message: null };
}

export function calculateWeightGain(
  input: WeightGainInput
): WeightGainResult | null {
  const age = Number(input.ageYears.trim().replace(/,/g, ''));
  const hRaw = Number(input.heightValue.trim().replace(/,/g, ''));
  const wRaw = Number(input.weightValue.trim().replace(/,/g, ''));
  if (![age, hRaw, wRaw].every(Number.isFinite)) return null;

  const heightCm = heightToCm(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);
  if (heightCm == null || weightKg == null) return null;

  const bmr = mifflinStJeorBmrKcal(weightKg, heightCm, age, input.sex);
  if (bmr == null) return null;

  const activity = activityById(input.activityId);
  const maintenance = bmr * activity.pal;
  if (!Number.isFinite(maintenance)) return null;

  const pace: GainPace = input.gainPace;
  const kgPerWeek = GAIN_PACE_KG_PER_WEEK[pace];
  const surplusKcal = GAIN_PACE_SURPLUS_KCAL[pace];

  const targetRaw = input.targetWeightValue.trim().replace(/,/g, '');
  let targetWeightKg = weightKg;
  let gainCalories: number | null = null;
  let weeks: number | null = null;
  let feasible = false;
  let goalMessage: string | null = null;

  if (targetRaw !== '') {
    const tNum = Number(targetRaw);
    if (!Number.isFinite(tNum) || tNum <= 0) return null;
    const tKg = weightToKg(tNum, input.targetWeightUnit);
    if (tKg == null) return null;
    targetWeightKg = tKg;
    const plan = weeksToGoal(weightKg, tKg, kgPerWeek);
    weeks = plan.weeks;
    feasible = plan.feasible;
    goalMessage = plan.message;
    if (feasible) {
      gainCalories = maintenance + surplusKcal;
    }
  }

  return {
    sex: input.sex,
    ageYears: age,
    heightCm,
    weightKg,
    targetWeightKg,
    activityId: activity.id,
    activityLabel: activity.label,
    pal: activity.pal,
    gainPace: pace,
    kgPerWeek,
    surplusKcal,
    bmrKcal: bmr,
    maintenanceKcal: maintenance,
    gainCaloriesKcal: gainCalories,
    weeksToGoal: weeks,
    goalFeasible: feasible,
    goalMessage,
    formattedMaintenance: formatKcal(maintenance),
    formattedGainCalories:
      gainCalories != null ? formatKcal(gainCalories) : null,
    explanation: `Mifflin–St Jeor maintenance ≈ ${formatKcal(maintenance)} kcal/day (PAL ${activity.pal}).`,
  };
}
