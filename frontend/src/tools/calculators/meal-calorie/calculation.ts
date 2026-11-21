/**
 * Meal Calorie Calculator — pure engine (ADR-018).
 *
 * Splits a daily kcal target across 3/4/5 meals using screenshot center % and
 * min–max bands. Rounds center kcal per meal, then reconciles so totals match
 * the daily budget (largest-remainder on fractional parts).
 *
 * Optional maintenance daily kcal reuses `computeMaintenanceCalorie` from the
 * maintenance-calorie module (Mifflin–St Jeor × PAL).
 */

import { computeMaintenanceCalorie } from '../maintenance-calorie/calculation';
import type { MaintenanceCalorieInput } from '../maintenance-calorie/types';
import type {
  MealAllocationRow,
  MealCalorieInput,
  MealCalorieResult,
  MealsPerDay,
} from './types';

interface MealSlotTemplate {
  id: string;
  label: string;
  centerPct: number;
  minPct: number;
  maxPct: number;
}

const THREE_MEALS: readonly MealSlotTemplate[] = [
  { id: 'breakfast', label: 'Breakfast', centerPct: 32.5, minPct: 30, maxPct: 35 },
  { id: 'lunch', label: 'Lunch', centerPct: 37.5, minPct: 35, maxPct: 40 },
  { id: 'dinner', label: 'Dinner', centerPct: 30, minPct: 25, maxPct: 35 },
];

const FOUR_MEALS: readonly MealSlotTemplate[] = [
  { id: 'breakfast', label: 'Breakfast', centerPct: 27.5, minPct: 25, maxPct: 30 },
  {
    id: 'morningSnack',
    label: 'Morning snack',
    centerPct: 7.5,
    minPct: 5,
    maxPct: 10,
  },
  { id: 'lunch', label: 'Lunch', centerPct: 37.5, minPct: 35, maxPct: 40 },
  { id: 'dinner', label: 'Dinner', centerPct: 27.5, minPct: 25, maxPct: 30 },
];

const FIVE_MEALS: readonly MealSlotTemplate[] = [
  { id: 'breakfast', label: 'Breakfast', centerPct: 27.5, minPct: 25, maxPct: 30 },
  {
    id: 'morningSnack',
    label: 'Morning snack',
    centerPct: 7.5,
    minPct: 5,
    maxPct: 10,
  },
  { id: 'lunch', label: 'Lunch', centerPct: 37.5, minPct: 35, maxPct: 40 },
  {
    id: 'afternoonSnack',
    label: 'Afternoon snack',
    centerPct: 7.5,
    minPct: 5,
    maxPct: 10,
  },
  { id: 'dinner', label: 'Dinner', centerPct: 17.5, minPct: 15, maxPct: 20 },
];

const TEMPLATE_BY_COUNT: Record<MealsPerDay, readonly MealSlotTemplate[]> = {
  three: THREE_MEALS,
  four: FOUR_MEALS,
  five: FIVE_MEALS,
};

const MEALS_LABEL: Record<MealsPerDay, string> = {
  three: 'Three',
  four: 'Four',
  five: 'Five',
};

export function templatesFor(mealsPerDay: MealsPerDay): readonly MealSlotTemplate[] {
  return TEMPLATE_BY_COUNT[mealsPerDay];
}

export function formatKcal(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return Math.round(n).toLocaleString('en-US');
}

/** Round each center target, then fix off-by-one so row centers sum to `dailyKcal`. */
export function reconcileMealCenters(
  dailyKcal: number,
  centerPcts: readonly number[],
): number[] {
  if (!(dailyKcal > 0) || centerPcts.length === 0) return [];

  const ideals = centerPcts.map((p) => (dailyKcal * p) / 100);
  const rounded = ideals.map((v) => Math.round(v));
  let diff = dailyKcal - rounded.reduce((a, b) => a + b, 0);

  if (diff === 0) return rounded;

  const order = ideals
    .map((ideal, i) => ({
      i,
      frac: Math.abs(ideal - Math.floor(ideal)),
    }))
    .sort((a, b) => b.frac - a.frac);

  const initialAbs = Math.abs(diff);
  const sign = diff > 0 ? 1 : -1;
  let step = 0;
  while (diff !== 0 && step < order.length * initialAbs + 10) {
    const idx = order[step % order.length]!.i;
    rounded[idx]! += sign;
    diff -= sign;
    step += 1;
  }

  return rounded;
}

export function buildMealRows(
  dailyKcal: number,
  mealsPerDay: MealsPerDay,
): MealAllocationRow[] {
  const templates = templatesFor(mealsPerDay);
  const centerPcts = templates.map((t) => t.centerPct);
  const centers = reconcileMealCenters(dailyKcal, centerPcts);

  return templates.map((t, i) => {
    const centerKcal = centers[i] ?? 0;
    const minKcal = Math.round((dailyKcal * t.minPct) / 100);
    const maxKcal = Math.round((dailyKcal * t.maxPct) / 100);
    return {
      id: t.id,
      label: t.label,
      centerPct: t.centerPct,
      centerKcal,
      minKcal,
      maxKcal,
      formattedCenter: formatKcal(centerKcal),
      formattedRange: `${formatKcal(minKcal)}–${formatKcal(maxKcal)}`,
    };
  });
}

function maintenanceInputFromMeal(input: MealCalorieInput): MaintenanceCalorieInput {
  return {
    sex: input.sex,
    heightValue: input.heightValue,
    heightUnit: input.heightUnit,
    weightValue: input.weightValue,
    weightUnit: input.weightUnit,
    ageYears: input.ageYears,
    activityId: input.activityId,
    energyUnit: 'kcal',
    showMacroPercent: false,
    showMacroKcal: false,
    showIdealWeight: false,
    showChangeWeight: false,
    proteinPct: '20',
    carbPct: '50',
    fatPct: '30',
    goalWeightValue: '',
    goalWeightUnit: 'kg',
    weeklyChangeKg: '0.5',
    changeDirection: 'lose',
  };
}

export function resolveDailyKcalFromMaintenance(
  input: MealCalorieInput,
): { dailyKcal: number; explanation: string } | null {
  const maintenance = computeMaintenanceCalorie(maintenanceInputFromMeal(input));
  if (!maintenance) return null;
  return {
    dailyKcal: maintenance.maintenanceKcal,
    explanation: maintenance.explanation,
  };
}

export function calculateMealCalorieFromInput(
  input: MealCalorieInput,
  /** Pre-validated daily kcal when manual mode; ignored when maintenance mode. */
  manualDailyKcal: number | null,
): MealCalorieResult | null {
  let dailyKcal: number | null = null;
  let fromMaintenance = false;
  let maintenanceKcal: number | null = null;
  let maintenanceExplanation: string | null = null;

  if (input.calculateRequiredCalories) {
    const resolved = resolveDailyKcalFromMaintenance(input);
    if (!resolved) return null;
    dailyKcal = resolved.dailyKcal;
    fromMaintenance = true;
    maintenanceKcal = resolved.dailyKcal;
    maintenanceExplanation = resolved.explanation;
  } else if (manualDailyKcal != null && manualDailyKcal > 0) {
    dailyKcal = manualDailyKcal;
  } else {
    return null;
  }

  if (dailyKcal == null || !(dailyKcal > 0)) return null;

  const roundedDaily = Math.round(dailyKcal);
  const rows = buildMealRows(roundedDaily, input.mealsPerDay);
  const sumCenters = rows.reduce((a, r) => a + r.centerKcal, 0);
  if (sumCenters !== roundedDaily) return null;

  const mealsLabel = MEALS_LABEL[input.mealsPerDay];
  const splitSummary = rows
    .map((r) => `${r.label} ${r.formattedCenter} kcal`)
    .join('; ');

  return {
    dailyKcal: roundedDaily,
    formattedDaily: formatKcal(roundedDaily),
    mealsPerDay: input.mealsPerDay,
    mealsPerDayLabel: mealsLabel,
    rows,
    fromMaintenance,
    maintenanceKcal,
    maintenanceExplanation,
    explanation: fromMaintenance
      ? `${maintenanceExplanation} Split across ${mealsLabel.toLowerCase()} meals: ${splitSummary}.`
      : `${formatKcal(roundedDaily)} kcal/day split across ${mealsLabel.toLowerCase()} meals: ${splitSummary}.`,
    disclaimer:
      'Educational meal-split guide using common percentage bands. Not personalised medical nutrition advice—adjust for hunger, training, and clinician guidance.',
  };
}