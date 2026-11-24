/**
 * Quarantine Activity Calculator — pure engine (ADR-018).
 *
 * PAL: Omni getActivity_factor(work, household, exercise) — sum of 0–3 levels → 1.2…2.4.
 * Maintenance: Mifflin–St Jeor BMR × PAL (kcal/day).
 * Activity deltas: Compendium kcal = MET × 3.5 × kg × minutes / 200
 *   (same as Omni time_sec × MET × 3.5 × kg / (200 × 60)).
 * PAL radios and MET activity slots are independent — no double-counting.
 */

import { mifflinStJeorBmrKcal } from '../calorie/calculation';
import { activityById } from './activities';
import type {
  ActivitySlot,
  HeightUnit,
  QuarantineActivityInput,
  QuarantineActivityResult,
  QuarantineSex,
  TimeUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Omni-style work+home+exercise → PAL; Mifflin–St Jeor × PAL maintenance; Compendium MET activity deltas. Educational estimate only.';

export const DISCLAIMER =
  'Educational energy estimate for lifestyle planning — not medical nutrition therapy or clinical isolation guidance.';

export const EQUATION_LABEL = 'Mifflin–St Jeor × PAL (+ MET deltas)';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  return unit === 'cm' ? value : value * IN_TO_CM;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function timeToMinutes(value: number, unit: TimeUnit): number {
  return unit === 'min' ? value : value * 60;
}

/** Omni getActivity_factor(work, household, exercise) — sum of 0–3 levels. */
export function palFromLevels(
  work: number,
  home: number,
  exercise: number,
): number | null {
  const sum = work + home + exercise;
  const map: Record<number, number> = {
    0: 1.2,
    1: 1.3,
    2: 1.4,
    3: 1.5,
    4: 1.6,
    5: 1.7,
    6: 1.8,
    7: 1.9,
    8: 2.0,
    9: 2.4,
  };
  return map[sum] ?? null;
}

export function formatPal(pal: number): string {
  return Number.isInteger(pal) ? String(pal) : pal.toFixed(1);
}

export function formatKcal(n: number): string {
  if (!Number.isFinite(n)) return '';
  return Math.round(n).toLocaleString('en-US');
}

/** Gross Compendium energy for one activity bout. */
export function caloriesFromMet(
  met: number,
  weightKg: number,
  minutes: number,
): number | null {
  if (![met, weightKg, minutes].every((n) => Number.isFinite(n) && n > 0)) {
    return null;
  }
  const kcal = (met * 3.5 * weightKg * minutes) / 200;
  return Number.isFinite(kcal) && kcal > 0 ? kcal : null;
}

function slotCalories(
  slot: ActivitySlot,
  weightKg: number | null,
): number | null {
  if (weightKg == null) return null;
  if (!slot.activityId || slot.timeText.trim() === '') return null;
  const act = activityById(slot.activityId);
  if (!act) return null;
  const raw = parseNumber(slot.timeText);
  if (raw == null || !(raw > 0)) return null;
  const minutes = timeToMinutes(raw, slot.timeUnit);
  return caloriesFromMet(act.met, weightKg, minutes);
}

function sumSlotCalories(
  slots: ActivitySlot[],
  weightKg: number | null,
): number | null {
  let total = 0;
  let any = false;
  for (const slot of slots) {
    const kcal = slotCalories(slot, weightKg);
    if (kcal != null) {
      total += kcal;
      any = true;
    }
  }
  return any ? total : null;
}

function sexToCalorie(sex: QuarantineSex): 'male' | 'female' {
  return sex;
}

export function calculateQuarantineActivity(
  input: QuarantineActivityInput,
): QuarantineActivityResult {
  const pal = palFromLevels(input.work, input.home, input.exercise);
  const palDisplay = pal != null ? formatPal(pal) : '';

  const age = parseNumber(input.ageYearsText);
  const heightRaw = parseNumber(input.heightText);
  const weightRaw = parseNumber(input.weightText);

  const heightCm =
    heightRaw != null && heightRaw > 0
      ? heightToCm(heightRaw, input.heightUnit)
      : null;
  const weightKg =
    weightRaw != null && weightRaw > 0
      ? weightToKg(weightRaw, input.weightUnit)
      : null;

  const anthropometricsReady =
    age != null &&
    age >= 15 &&
    age <= 100 &&
    heightCm != null &&
    heightCm > 0 &&
    weightKg != null &&
    weightKg > 0;

  let maintenanceKcalPerDay: number | null = null;
  let maintenanceDisplay = '';
  let bmr: number | null = null;

  if (anthropometricsReady && pal != null) {
    bmr = mifflinStJeorBmrKcal(
      weightKg!,
      heightCm!,
      age!,
      sexToCalorie(input.sex),
    );
    if (bmr != null) {
      maintenanceKcalPerDay = bmr * pal;
      maintenanceDisplay = formatKcal(maintenanceKcalPerDay);
    }
  }

  const removedKcal = sumSlotCalories(input.removed, weightKg);
  const addedKcal = sumSlotCalories(input.added, weightKg);

  let deltaKcal: number | null = null;
  let deltaDisplay = '';
  if (removedKcal != null || addedKcal != null) {
    const rem = removedKcal ?? 0;
    const add = addedKcal ?? 0;
    deltaKcal = add - rem;
    if (Math.abs(deltaKcal) < 1e-9) {
      deltaDisplay =
        'Activity swap net ≈ 0 kcal — identical added/removed bouts cancel.';
    } else if (deltaKcal > 0) {
      deltaDisplay = `Activity swaps add about ${formatKcal(deltaKcal)} kcal/day vs given-up activities.`;
    } else {
      deltaDisplay = `Activity swaps remove about ${formatKcal(Math.abs(deltaKcal))} kcal/day vs prior activities.`;
    }
  }

  let statusHeadline: string;
  let statusDetail: string;

  if (!anthropometricsReady) {
    statusHeadline = 'Enter age, height, and weight';
    statusDetail =
      'Complete anthropometrics to estimate maintenance calories (kcal/day). Activity swaps need weight + times.';
  } else if (maintenanceKcalPerDay != null && pal != null && bmr != null) {
    statusHeadline = `Maintenance ≈ ${maintenanceDisplay} kcal/day`;
    statusDetail = `Mifflin–St Jeor BMR ≈ ${formatKcal(bmr)} × PAL ${formatPal(pal)}. MET activity rows are separate from PAL.`;
  } else {
    statusHeadline = 'Unable to estimate';
    statusDetail = 'Check inputs and try again.';
  }

  return {
    pal,
    palDisplay,
    maintenanceKcalPerDay,
    maintenanceDisplay,
    removedKcal,
    addedKcal,
    deltaKcal,
    deltaDisplay,
    statusHeadline,
    statusDetail,
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
