/**
 * Keto Calculator — pure engine (ADR-018).
 *
 * BMR: Mifflin–St Jeor (Mifflin et al., 1990).
 * TDEE / maintenance = BMR × PAL bands.
 * Default macro shares: 75% fat / 5% carbohydrate / 20% protein
 *   (JAMA. 2020;323(4):386 patient page; UK modified ketogenic diet teaching).
 * Grams: Atwater factors — fat 9 kcal/g; carbohydrate & protein 4 kcal/g
 *   (Merrill & Watt / USDA food energy).
 * Diet pace: Normal ±500 kcal/day (0.5 kg/week); Strict ±1000 (1 kg/week).
 */

import {
  activityById,
  PACE_DELTA_KCAL,
  PACE_KG_PER_WEEK,
  type DietPace,
  type HeightUnit,
  type KetoInput,
  type KetoMacroSplit,
  type KetoResult,
  type KetoSex,
  type MacroMassUnit,
  type WeightUnit,
} from './types';

export const KCAL_PER_G_FAT = 9;
export const KCAL_PER_G_CARB = 4;
export const KCAL_PER_G_PROTEIN = 4;

/** Educational floor — unsupervised allocations below this are flagged. */
export const MIN_ALLOCATED_KCAL = 1200;

export const SOURCE_NOTE =
  'Mifflin–St Jeor × PAL; JAMA 2020 / UK MKD-style 75/5/20 energy shares; Atwater 9/4/4 kcal/g; Normal ±500 / Strict ±1000 kcal/day.';

export const DISCLAIMER =
  'Educational nutrition arithmetic from published keto energy-share teaching — not individualized medical nutrition therapy or a classic 4:1 therapeutic ketogenic prescription.';

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
  sex: KetoSex,
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

export function gramsToDisplay(grams: number, unit: MacroMassUnit): number {
  if (unit === 'oz') return grams / 28.349523125;
  return grams;
}

export function formatMass(grams: number, unit: MacroMassUnit): string {
  const v = gramsToDisplay(grams, unit);
  const rounded = unit === 'oz' ? Math.round(v * 100) / 100 : Math.round(v * 10) / 10;
  return rounded.toLocaleString('en-US', {
    maximumFractionDigits: unit === 'oz' ? 2 : 1,
  });
}

/** True when fat+carb+protein percentages total 100 within 0.05 pt. */
export function macroPercentsTotalOk(
  fatPct: number,
  carbPct: number,
  proteinPct: number,
): boolean {
  if (![fatPct, carbPct, proteinPct].every((n) => Number.isFinite(n) && n >= 0)) {
    return false;
  }
  return Math.abs(fatPct + carbPct + proteinPct - 100) <= 0.05;
}

/**
 * Allocate energy shares → kcal and grams (Atwater 9/4/4).
 * Pure helper for fixed allocations (e.g. 2,000 kcal fixture).
 */
export function macrosFromAllocation(
  allocatedKcal: number,
  fatPct: number,
  carbPct: number,
  proteinPct: number,
): KetoMacroSplit | null {
  if (!Number.isFinite(allocatedKcal) || allocatedKcal <= 0) return null;
  if (!macroPercentsTotalOk(fatPct, carbPct, proteinPct)) return null;

  const fatKcal = allocatedKcal * (fatPct / 100);
  const carbKcal = allocatedKcal * (carbPct / 100);
  const proteinKcal = allocatedKcal * (proteinPct / 100);

  return {
    fatKcal,
    carbKcal,
    proteinKcal,
    fatG: fatKcal / KCAL_PER_G_FAT,
    carbG: carbKcal / KCAL_PER_G_CARB,
    proteinG: proteinKcal / KCAL_PER_G_PROTEIN,
    fatPct,
    carbPct,
    proteinPct,
  };
}

export function weeksToGoal(
  currentKg: number,
  targetKg: number,
  kgPerWeek: number,
): {
  weeks: number | null;
  direction: 'lose' | 'gain' | 'maintain';
  feasible: boolean;
  message: string | null;
} {
  if (![currentKg, targetKg, kgPerWeek].every(Number.isFinite) || kgPerWeek <= 0) {
    return {
      weeks: null,
      direction: 'maintain',
      feasible: false,
      message: 'Unable to estimate goal timeline.',
    };
  }
  const delta = targetKg - currentKg;
  if (Math.abs(delta) < 1e-9) {
    return {
      weeks: 0,
      direction: 'maintain',
      feasible: true,
      message: null,
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

export function calculateKeto(input: KetoInput): KetoResult | null {
  const age = Number(input.ageYears.trim().replace(/,/g, ''));
  const hRaw = Number(input.heightValue.trim().replace(/,/g, ''));
  const wRaw = Number(input.weightValue.trim().replace(/,/g, ''));
  const tRaw = Number(input.targetWeightValue.trim().replace(/,/g, ''));
  const fatPct = Number(input.fatPct.trim().replace(/,/g, ''));
  const carbPct = Number(input.carbPct.trim().replace(/,/g, ''));
  const proteinPct = Number(input.proteinPct.trim().replace(/,/g, ''));

  if (![age, hRaw, wRaw, tRaw, fatPct, carbPct, proteinPct].every(Number.isFinite)) {
    return null;
  }
  if (!macroPercentsTotalOk(fatPct, carbPct, proteinPct)) return null;

  const heightCm = heightToCm(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);
  const targetWeightKg = weightToKg(tRaw, input.targetWeightUnit);
  if (heightCm == null || weightKg == null || targetWeightKg == null) return null;

  const bmr = mifflinStJeorBmrKcal(weightKg, heightCm, age, input.sex);
  if (bmr == null) return null;

  const activity = activityById(input.activityId);
  const maintenance = bmr * activity.pal;
  if (!Number.isFinite(maintenance) || !(maintenance > 0)) return null;

  const pace: DietPace = input.dietPace;
  const kgPerWeek = PACE_KG_PER_WEEK[pace];
  const absDelta = PACE_DELTA_KCAL[pace];
  const plan = weeksToGoal(weightKg, targetWeightKg, kgPerWeek);

  let allocatedKcal = maintenance;
  let deltaKcal: number | null = null;

  if (plan.direction === 'lose') {
    deltaKcal = -absDelta;
    allocatedKcal = maintenance + deltaKcal;
  } else if (plan.direction === 'gain') {
    deltaKcal = absDelta;
    allocatedKcal = maintenance + deltaKcal;
  }

  if (!Number.isFinite(allocatedKcal) || allocatedKcal <= 0) return null;

  const macros = macrosFromAllocation(allocatedKcal, fatPct, carbPct, proteinPct);
  if (!macros) return null;

  const messages: string[] = [];
  if (plan.message) messages.push(plan.message);
  if (allocatedKcal < MIN_ALLOCATED_KCAL) {
    messages.push(
      `Allocated intake is below ${MIN_ALLOCATED_KCAL} kcal/day — seek clinical guidance before using very low-calorie plans.`,
    );
  }

  const unit = input.macroMassUnit;

  return {
    sex: input.sex,
    ageYears: age,
    heightCm,
    weightKg,
    activityId: activity.id,
    activityLabel: activity.label,
    pal: activity.pal,
    bmrKcal: bmr,
    maintenanceKcal: maintenance,
    formattedMaintenance: formatKcal(maintenance),
    allocatedKcal,
    formattedAllocated: formatKcal(allocatedKcal),
    changeDirection: plan.direction,
    targetWeightKg,
    kgPerWeek: plan.direction === 'maintain' ? null : kgPerWeek,
    deltaKcal,
    weeksToGoal: plan.feasible ? plan.weeks : null,
    goalMessage: messages.length ? messages.join(' ') : null,
    macros,
    formattedFatKcal: formatKcal(macros.fatKcal),
    formattedCarbKcal: formatKcal(macros.carbKcal),
    formattedProteinKcal: formatKcal(macros.proteinKcal),
    formattedFatMass: formatMass(macros.fatG, unit),
    formattedCarbMass: formatMass(macros.carbG, unit),
    formattedProteinMass: formatMass(macros.proteinG, unit),
    explanation: `Mifflin–St Jeor BMR ≈ ${formatKcal(bmr)} kcal/day × PAL ${activity.pal} ≈ ${formatKcal(maintenance)} kcal/day maintenance; allocated ${formatKcal(allocatedKcal)} kcal/day at ${fatPct}/${carbPct}/${proteinPct} fat/carb/protein.`,
    disclaimer: DISCLAIMER,
  };
}
