/**
 * Calorie Deficit Calculator — pure engine (ADR-018).
 *
 * Weight-change model: simplified tissue-energy estimate of 7,700 kcal per kg
 * (common textbook approximation; not individual metabolic measurement).
 *
 * dailyDeficit = (Δkg × 7700) / calendarDays
 * maintenance = Mifflin–St Jeor BMR × sedentary PAL 1.2 (screenshot has no
 * activity control; documented assumption for the intake plan only)
 * plannedIntake = maintenance − dailyDeficit
 */

import {
  formatKcal,
  heightToCm,
  mifflinStJeorBmrKcal,
  weightToKg,
} from '../calorie/calculation';
import type { HeightUnit, WeightUnit } from '../calorie/types';
import type { CalorieDeficitResult, Sex } from './types';

/** Approximate metabolizable energy associated with 1 kg body-weight change. */
export const KCAL_PER_KG_BODY_WEIGHT = 7700;

/**
 * Screenshot has no activity selector. Intake-plan maintenance uses sedentary
 * PAL 1.2 (“little or no exercise”) from the shared Calorie Calculator table.
 */
export const DEFAULT_MAINTENANCE_PAL = 1.2;
export const DEFAULT_MAINTENANCE_PAL_LABEL = 'Little or no exercise (assumed)';

/** Educational calculator floors — not clinical prescriptions. */
export const MIN_INTAKE_FEMALE_KCAL = 1200;
export const MIN_INTAKE_MALE_KCAL = 1500;

/** Soft cap on implied weekly loss rate (~1 kg/week). */
export const MAX_WEEKLY_LOSS_KG = 1;

export interface CalorieDeficitMathInput {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  /** Inclusive calendar span: target − asOf, both date-only UTC. */
  days: number;
  asOfDate: string;
  targetDate: string;
}

export function parseIsoDateOnly(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

export function formatIsoDateUTC(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayUtcDateOnly(now = new Date()): string {
  return formatIsoDateUTC(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  );
}

/** Whole calendar days between date-only ISO strings (target − asOf). */
export function calendarDaysBetween(
  asOfIso: string,
  targetIso: string
): number | null {
  const a = parseIsoDateOnly(asOfIso);
  const t = parseIsoDateOnly(targetIso);
  if (!a || !t) return null;
  const ms = t.getTime() - a.getTime();
  return Math.round(ms / 86_400_000);
}

export function minSafeIntakeKcal(sex: Sex): number {
  return sex === 'male' ? MIN_INTAKE_MALE_KCAL : MIN_INTAKE_FEMALE_KCAL;
}

export {
  heightToCm,
  weightToKg,
  formatKcal,
  type HeightUnit,
  type WeightUnit,
};

export function calculateCalorieDeficit(
  input: CalorieDeficitMathInput
): CalorieDeficitResult {
  const {
    sex,
    ageYears,
    heightCm,
    currentWeightKg,
    targetWeightKg,
    days,
    asOfDate,
    targetDate,
  } = input;

  if (!(days > 0) || !Number.isFinite(days)) {
    throw new RangeError('Target date must be after the as-of date.');
  }
  const weightDeltaKg = currentWeightKg - targetWeightKg;
  if (!(weightDeltaKg > 0) || !Number.isFinite(weightDeltaKg)) {
    throw new RangeError('Target weight must be below current weight.');
  }

  const totalKcal = weightDeltaKg * KCAL_PER_KG_BODY_WEIGHT;
  const dailyDeficitKcal = totalKcal / days;

  const bmr = mifflinStJeorBmrKcal(
    currentWeightKg,
    heightCm,
    ageYears,
    sex
  );
  if (bmr == null || !(bmr > 0)) {
    throw new RangeError('Unable to estimate BMR from the entered values.');
  }
  const maintenanceKcal = bmr * DEFAULT_MAINTENANCE_PAL;
  const plannedIntakeKcal = maintenanceKcal - dailyDeficitKcal;

  return {
    sex,
    ageYears,
    heightCm,
    currentWeightKg,
    targetWeightKg,
    weightDeltaKg,
    days,
    dailyDeficitKcal,
    totalKcal,
    bmrKcal: bmr,
    maintenanceKcal,
    plannedIntakeKcal,
    pal: DEFAULT_MAINTENANCE_PAL,
    palLabel: DEFAULT_MAINTENANCE_PAL_LABEL,
    kcalPerKg: KCAL_PER_KG_BODY_WEIGHT,
    asOfDate,
    targetDate,
    formattedDailyDeficit: formatKcal(dailyDeficitKcal),
    formattedMaintenance: formatKcal(maintenanceKcal),
    formattedPlannedIntake: formatKcal(plannedIntakeKcal),
    disclaimer:
      'Educational estimate only. Uses ≈7,700 kcal per kg body-weight change and Mifflin–St Jeor × sedentary PAL 1.2 for the intake plan. Not medical advice; consult a clinician before changing diet.',
  };
}
