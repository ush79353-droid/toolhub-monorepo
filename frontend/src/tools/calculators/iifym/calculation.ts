/**
 * IIFYM Calculator — pure engine (ADR-018).
 *
 * BMR: Mifflin–St Jeor (Mifflin et al., 1990).
 * TDEE / maintenance = BMR × Omni IIFYM PAL bands.
 * Macros: USDA Dietary Guidelines / AMDR energy shares × 4/4/9 kcal/g.
 * Change pace: Normal ±500 kcal/day (0.5 kg/week); Strict ±1000 (1 kg/week).
 * Tissue energy heuristic cited by Omni ≈ 7,000 kcal/kg (3,500 kcal/lb).
 */

import {
  activityById,
  CARB_SHARE,
  FAT_SHARE,
  PACE_DELTA_KCAL,
  PACE_KG_PER_WEEK,
  PROTEIN_SHARE,
  type ChangePace,
  type HeightUnit,
  type IifymInput,
  type IifymResult,
  type IifymSex,
  type MacroRangeGrams,
  type WeightUnit,
} from './types';

export const KCAL_PER_G_PROTEIN = 4;
export const KCAL_PER_G_CARB = 4;
export const KCAL_PER_G_FAT = 9;

export const SOURCE_NOTE =
  'Mifflin–St Jeor × Omni IIFYM PAL; USDA AMDR protein 10–35%, carbs 45–65%, fat 20–35%; 4/4/9 kcal/g; change pace ±500/±1000 kcal/day.';

export const DISCLAIMER =
  'Educational nutrition arithmetic from published AMDR/%-energy guidance — not individualized medical nutrition therapy.';

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

export function convertWeight(
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
  sex: IifymSex,
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

/** Convert energy shares to gram ranges (Atwater 4/4/9). */
export function macroGramsFromKcal(targetKcal: number): MacroRangeGrams {
  return {
    proteinMinG: (targetKcal * (PROTEIN_SHARE.min / 100)) / KCAL_PER_G_PROTEIN,
    proteinMaxG: (targetKcal * (PROTEIN_SHARE.max / 100)) / KCAL_PER_G_PROTEIN,
    carbMinG: (targetKcal * (CARB_SHARE.min / 100)) / KCAL_PER_G_CARB,
    carbMaxG: (targetKcal * (CARB_SHARE.max / 100)) / KCAL_PER_G_CARB,
    fatMinG: (targetKcal * (FAT_SHARE.min / 100)) / KCAL_PER_G_FAT,
    fatMaxG: (targetKcal * (FAT_SHARE.max / 100)) / KCAL_PER_G_FAT,
  };
}

/** Verify AMDR midpoints conceptually sum to 100% within published windows. */
export function amdrSharesTotalOk(): boolean {
  // Ranges do not each total 100 alone; midpoints: 22.5 + 55 + 27.5 = 105 (ranges overlap).
  // Lock: min shares sum ≤ 100 and max shares sum ≥ 100 so a feasible 100% split exists.
  const minSum = PROTEIN_SHARE.min + CARB_SHARE.min + FAT_SHARE.min;
  const maxSum = PROTEIN_SHARE.max + CARB_SHARE.max + FAT_SHARE.max;
  return minSum <= 100 && maxSum >= 100;
}

export function weeksToGoal(
  currentKg: number,
  targetKg: number,
  kgPerWeek: number,
): {
  weeks: number | null;
  direction: 'lose' | 'gain' | null;
  feasible: boolean;
  message: string | null;
} {
  if (![currentKg, targetKg, kgPerWeek].every(Number.isFinite) || kgPerWeek <= 0) {
    return {
      weeks: null,
      direction: null,
      feasible: false,
      message: 'Unable to estimate goal timeline.',
    };
  }
  const delta = targetKg - currentKg;
  if (Math.abs(delta) < 1e-9) {
    return {
      weeks: 0,
      direction: null,
      feasible: false,
      message: 'Target equals current weight — use Maintain weight instead.',
    };
  }
  const direction: 'lose' | 'gain' = delta < 0 ? 'lose' : 'gain';
  const weeks = Math.abs(delta) / kgPerWeek;
  if (!Number.isFinite(weeks) || weeks > 520) {
    return {
      weeks: null,
      direction,
      feasible: false,
      message: 'Goal timeline exceeds practical planning range (10 years).',
    };
  }
  return { weeks, direction, feasible: true, message: null };
}

export function calculateIifym(input: IifymInput): IifymResult | null {
  if (!amdrSharesTotalOk()) return null;

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
  if (!Number.isFinite(maintenance) || !(maintenance > 0)) return null;

  let targetKcal = maintenance;
  let changeDirection: 'lose' | 'gain' | null = null;
  let targetWeightKg: number | null = null;
  let kgPerWeek: number | null = null;
  let deltaKcal: number | null = null;
  let weeks: number | null = null;
  let goalMessage: string | null = null;

  if (input.goalMode === 'change') {
    const tRaw = input.targetWeightValue.trim().replace(/,/g, '');
    if (tRaw === '') return null;
    const tNum = Number(tRaw);
    if (!Number.isFinite(tNum) || tNum <= 0) return null;
    const tKg = weightToKg(tNum, input.targetWeightUnit);
    if (tKg == null) return null;
    targetWeightKg = tKg;

    const pace: ChangePace = input.changePace;
    kgPerWeek = PACE_KG_PER_WEEK[pace];
    const absDelta = PACE_DELTA_KCAL[pace];
    const plan = weeksToGoal(weightKg, tKg, kgPerWeek);
    weeks = plan.weeks;
    changeDirection = plan.direction;
    goalMessage = plan.message;

    if (!plan.feasible || plan.direction == null) {
      return {
        sex: input.sex,
        ageYears: age,
        heightCm,
        weightKg,
        activityId: activity.id,
        activityLabel: activity.label,
        pal: activity.pal,
        goalMode: input.goalMode,
        bmrKcal: bmr,
        maintenanceKcal: maintenance,
        formattedMaintenance: formatKcal(maintenance),
        targetKcal: maintenance,
        formattedTarget: formatKcal(maintenance),
        macros: macroGramsFromKcal(maintenance),
        changeDirection: plan.direction,
        targetWeightKg,
        kgPerWeek,
        deltaKcal: null,
        weeksToGoal: plan.weeks,
        goalMessage,
        explanation: `Mifflin–St Jeor maintenance ≈ ${formatKcal(maintenance)} kcal/day (PAL ${activity.pal}).`,
        disclaimer: DISCLAIMER,
      };
    }

    deltaKcal = plan.direction === 'lose' ? -absDelta : absDelta;
    targetKcal = maintenance + deltaKcal;
  }

  const macros = macroGramsFromKcal(targetKcal);

  return {
    sex: input.sex,
    ageYears: age,
    heightCm,
    weightKg,
    activityId: activity.id,
    activityLabel: activity.label,
    pal: activity.pal,
    goalMode: input.goalMode,
    bmrKcal: bmr,
    maintenanceKcal: maintenance,
    formattedMaintenance: formatKcal(maintenance),
    targetKcal,
    formattedTarget: formatKcal(targetKcal),
    macros,
    changeDirection,
    targetWeightKg,
    kgPerWeek,
    deltaKcal,
    weeksToGoal: weeks,
    goalMessage,
    explanation: `Mifflin–St Jeor BMR ≈ ${formatKcal(bmr)} kcal/day × PAL ${activity.pal} (${activity.label}) ≈ ${formatKcal(maintenance)} kcal/day.`,
    disclaimer: DISCLAIMER,
  };
}
