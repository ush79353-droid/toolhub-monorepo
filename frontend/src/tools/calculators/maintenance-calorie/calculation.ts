/**
 * Maintenance Calorie Calculator — pure engine (ADR-018).
 *
 * Mifflin–St Jeor BMR × screenshot PAL (Omni Maintenance FAQ):
 *   none 1.2 · regular 1.55 · physical job 2.0 · athlete 2.4
 * Reuses sibling BMR helper from `calorie/calculation`.
 *
 * Macros: USDA AMDR windows; kcal = total × share/100; g = kcal/4 (P,C) or /9 (F).
 * Ideal weight: Devine IBW + WHO adult BMI 18.5–24.9 band.
 * Weight change: ±7700 kcal per kg body mass; soft floor on planned intake.
 */

import { mifflinStJeorBmrKcal } from '../calorie/calculation';
import {
  activityById,
  type EnergyUnit,
  type HeightUnit,
  type IdealWeightResult,
  type MacroBreakdown,
  type MaintenanceCalorieInput,
  type MaintenanceCalorieResult,
  type Sex,
  type WeightChangePlan,
  type WeightUnit,
} from './types';

export const KCAL_PER_KJ = 1 / 4.184;
export const KJ_PER_KCAL = 4.184;
/** Approximate tissue energy density used for weekly rate planning. */
export const KCAL_PER_KG = 7700;
/** Soft educational floor for planned intake (not a clinical RDA). */
export const INTAKE_FLOOR_KCAL = 1200;

export function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

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

export function formatEnergy(kcal: number, unit: EnergyUnit): string {
  if (!Number.isFinite(kcal)) return '—';
  const v = unit === 'kcal' ? Math.round(kcal) : Math.round(kcal * KJ_PER_KCAL);
  return v.toLocaleString('en-US');
}

export function formatKg(n: number): string {
  return n.toFixed(1);
}

/** Devine ideal body weight (kg). Height must be ≥ 152.4 cm (5 ft). */
export function devineIdealWeightKg(sex: Sex, heightCm: number): number | null {
  if (!(heightCm >= 152.4)) return null;
  const inchesOver5ft = (heightCm - 152.4) / 2.54;
  const base = sex === 'male' ? 50 : 45.5;
  return base + 2.3 * inchesOver5ft;
}

export function bmiHealthyWeightBandKg(heightCm: number): {
  minKg: number;
  maxKg: number;
} | null {
  if (!(heightCm > 0)) return null;
  const m = heightCm / 100;
  const m2 = m * m;
  return { minKg: 18.5 * m2, maxKg: 24.9 * m2 };
}

export function buildMacros(
  maintenanceKcal: number,
  proteinPct: number,
  carbPct: number,
  fatPct: number,
): MacroBreakdown | null {
  if (!(Math.abs(proteinPct + carbPct + fatPct - 100) < 0.05)) return null;
  if (proteinPct < 10 || proteinPct > 35) return null;
  if (carbPct < 45 || carbPct > 65) return null;
  if (fatPct < 20 || fatPct > 35) return null;
  const proteinKcal = (maintenanceKcal * proteinPct) / 100;
  const carbKcal = (maintenanceKcal * carbPct) / 100;
  const fatKcal = (maintenanceKcal * fatPct) / 100;
  return {
    proteinPct,
    carbPct,
    fatPct,
    proteinKcal,
    carbKcal,
    fatKcal,
    proteinGrams: proteinKcal / 4,
    carbGrams: carbKcal / 4,
    fatGrams: fatKcal / 9,
  };
}

export function buildChangePlan(
  maintenanceKcal: number,
  currentKg: number,
  goalKg: number,
  weeklyChangeKg: number,
  direction: 'lose' | 'gain',
): WeightChangePlan | null {
  if (!(weeklyChangeKg > 0) || !(weeklyChangeKg <= 1.0)) return null;
  if (!(goalKg > 0) || !(currentKg > 0)) return null;

  const deltaMass = goalKg - currentKg;
  if (direction === 'lose' && !(deltaMass < 0)) return null;
  if (direction === 'gain' && !(deltaMass > 0)) return null;

  const dailyDeltaKcal =
    direction === 'lose'
      ? -((weeklyChangeKg * KCAL_PER_KG) / 7)
      : (weeklyChangeKg * KCAL_PER_KG) / 7;
  const plannedIntakeKcal = maintenanceKcal + dailyDeltaKcal;
  let warning: string | null = null;
  if (plannedIntakeKcal < INTAKE_FLOOR_KCAL) {
    warning = `Planned intake falls below this tool’s ${INTAKE_FLOOR_KCAL} kcal/day educational floor. Slow the weekly rate or raise the target.`;
  }
  if (weeklyChangeKg > 0.75) {
    warning =
      (warning ? `${warning} ` : '') +
      'Weekly changes above ~0.75 kg are aggressive for unsupervised plans.';
  }

  const massToMove = Math.abs(deltaMass);
  const weeksEstimate =
    weeklyChangeKg > 0 ? massToMove / weeklyChangeKg : null;

  return {
    goalWeightKg: goalKg,
    weeklyChangeKg,
    direction,
    dailyDeltaKcal,
    plannedIntakeKcal,
    formattedPlannedIntake: Math.round(plannedIntakeKcal).toLocaleString('en-US'),
    weeksEstimate,
    warning,
  };
}

export function computeMaintenanceCalorie(
  input: MaintenanceCalorieInput,
): MaintenanceCalorieResult | null {
  const age = parseLoose(input.ageYears);
  const heightRaw = parseLoose(input.heightValue);
  const weightRaw = parseLoose(input.weightValue);
  if (age === null || heightRaw === null || weightRaw === null) return null;
  if (!(age >= 15 && age <= 100)) return null;

  const heightCm = heightToCm(heightRaw, input.heightUnit);
  const weightKg = weightToKg(weightRaw, input.weightUnit);
  if (heightCm == null || weightKg == null) return null;
  if (!(heightCm >= 100 && heightCm <= 250)) return null;
  if (!(weightKg >= 30 && weightKg <= 300)) return null;

  const bmr = mifflinStJeorBmrKcal(weightKg, heightCm, age, input.sex);
  if (bmr == null || !(bmr > 0)) return null;

  const activity = activityById(input.activityId);
  const maintenanceKcal = bmr * activity.pal;
  if (!Number.isFinite(maintenanceKcal) || !(maintenanceKcal > 0)) return null;

  let macros: MacroBreakdown | null = null;
  if (input.showMacroPercent || input.showMacroKcal) {
    const p = parseLoose(input.proteinPct);
    const c = parseLoose(input.carbPct);
    const f = parseLoose(input.fatPct);
    if (p === null || c === null || f === null) return null;
    macros = buildMacros(maintenanceKcal, p, c, f);
    if (!macros) return null;
  }

  let idealWeight: IdealWeightResult | null = null;
  if (input.showIdealWeight) {
    const band = bmiHealthyWeightBandKg(heightCm);
    const devine = devineIdealWeightKg(input.sex, heightCm);
    if (!band) return null;
    idealWeight = {
      devineKg: devine ?? NaN,
      formattedDevineKg:
        devine != null ? formatKg(devine) : 'N/A (height under 5 ft)',
      bmiHealthyMinKg: band.minKg,
      bmiHealthyMaxKg: band.maxKg,
      formattedBmiRange: `${formatKg(band.minKg)}–${formatKg(band.maxKg)} kg`,
    };
  }

  let changePlan: WeightChangePlan | null = null;
  if (input.showChangeWeight) {
    const goalRaw = parseLoose(input.goalWeightValue);
    const weekly = parseLoose(input.weeklyChangeKg);
    if (goalRaw === null || weekly === null) return null;
    const goalKg = weightToKg(goalRaw, input.goalWeightUnit);
    if (goalKg == null) return null;
    changePlan = buildChangePlan(
      maintenanceKcal,
      weightKg,
      goalKg,
      weekly,
      input.changeDirection,
    );
    if (!changePlan) return null;
  }

  return {
    sex: input.sex,
    ageYears: age,
    heightCm,
    weightKg,
    activityId: input.activityId,
    activityLabel: activity.label,
    pal: activity.pal,
    bmrKcal: bmr,
    maintenanceKcal,
    formattedMaintenance: formatEnergy(maintenanceKcal, input.energyUnit),
    energyUnit: input.energyUnit,
    macros,
    idealWeight,
    changePlan,
    explanation: `Mifflin–St Jeor BMR ≈ ${Math.round(bmr).toLocaleString('en-US')} kcal/day × PAL ${activity.pal} (${activity.label}) ≈ ${Math.round(maintenanceKcal).toLocaleString('en-US')} kcal/day.`,
    disclaimer:
      'Educational Mifflin–St Jeor × PAL estimate for healthy adults. Not medical advice; needs differ in pregnancy, illness, eating disorders, and elite sport.',
  };
}
