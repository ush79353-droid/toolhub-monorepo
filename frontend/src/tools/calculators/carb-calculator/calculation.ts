/**
 * Carb Calculator (Carbohydrates) — carb grams from energy share × total kcal (ADR-018).
 *
 * g/day = kcal/day × (fraction / 100) / 4
 * Optional TDEE from Mifflin–St Jeor × PAL when total kcal field is empty.
 * Adult RDA reference: 130 g (520 kcal) minimum carbohydrate.
 */

import { mifflinStJeorBmrKcal } from '../calorie/calculation';
import { activityById, type ActivityId } from '../calorie/types';
import type { CarbCalculatorInput, CarbCalculatorResult, CarbShareRow } from './types';

export const KCAL_PER_G_CARB = 4;
export const ADULT_RDA_G = 130;
export const ADULT_RDA_KCAL = ADULT_RDA_G * KCAL_PER_G_CARB;

export const CARB_SHARE_PERCENTS = [45, 50, 55, 60, 65] as const;

export const SOURCE_NOTE =
  'USDA AMDR-style carbohydrate shares (45–65%); 4 kcal/g; optional Mifflin–St Jeor maintenance. RDA minimum 130 g/day (adult) is population guidance, not an individualized prescription.';

export const DISCLAIMER =
  'Educational nutrition arithmetic — not medical nutrition therapy.';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: 'cm' | 'in'): number {
  return unit === 'cm' ? value : value * IN_TO_CM;
}

export function weightToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function carbGramsFromKcalAndShare(
  kcalPerDay: number,
  sharePercent: number,
): number {
  return (kcalPerDay * (sharePercent / 100)) / KCAL_PER_G_CARB;
}

export function estimateMaintenanceKcal(
  sex: 'male' | 'female',
  ageYears: number,
  heightCm: number,
  weightKg: number,
  activityId: ActivityId,
): number | null {
  const bmr = mifflinStJeorBmrKcal(weightKg, heightCm, ageYears, sex);
  if (bmr == null) return null;
  const activity = activityById(activityId);
  return bmr * activity.pal;
}

export function buildCarbShareRows(kcalPerDay: number): CarbShareRow[] {
  return CARB_SHARE_PERCENTS.map((pct) => {
    const kcal = kcalPerDay * (pct / 100);
    const grams = carbGramsFromKcalAndShare(kcalPerDay, pct);
    return {
      sharePercent: pct,
      carbKcalPerDay: kcal,
      carbGramsPerDay: grams,
    };
  });
}

export function calculateCarbCalculator(
  input: CarbCalculatorInput,
): CarbCalculatorResult {
  const empty: CarbCalculatorResult = {
    totalKcalPerDay: null,
    tdeeFromProfile: null,
    tdeeSource: null,
    carbRows: [],
    rdaGrams: ADULT_RDA_G,
    rdaKcal: ADULT_RDA_KCAL,
    statusHeadline: 'Enter profile or total calories',
    statusDetail:
      'Fill sex, height, weight, age, and activity to estimate maintenance kcal, or enter total calories directly. Carbohydrate grams use 4 kcal/g across 45–65% energy shares.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const age = parseNumber(input.ageYearsText);
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);
  const kcalOverride = parseNumber(input.totalKcalText);

  if (input.ageYearsText.trim() && age !== null && !(age >= 15 && age <= 100)) {
    return {
      ...empty,
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be 15–100 years for the maintenance estimate.',
    };
  }

  let totalKcal: number | null = null;
  let tdeeFromProfile: number | null = null;
  let tdeeSource: string | null = null;

  if (kcalOverride !== null && kcalOverride > 0) {
    totalKcal = kcalOverride;
    tdeeSource = 'Total calories field';
  } else if (
    age !== null &&
    hRaw !== null &&
    wRaw !== null &&
    age > 0 &&
    hRaw > 0 &&
    wRaw > 0
  ) {
    const heightCm = heightToCm(hRaw, input.heightUnit);
    const weightKg = weightToKg(wRaw, input.weightUnit);
    const est = estimateMaintenanceKcal(
      input.sex,
      age,
      heightCm,
      weightKg,
      input.activityId,
    );
    if (est != null) {
      totalKcal = est;
      tdeeFromProfile = est;
      tdeeSource = 'Mifflin–St Jeor × PAL';
    }
  }

  if (totalKcal == null) return empty;

  const rows = buildCarbShareRows(totalKcal);
  const ex = rows.find((r) => r.sharePercent === 50);
  const exGrams = ex ? Math.round(ex.carbGramsPerDay) : null;

  return {
    totalKcalPerDay: totalKcal,
    tdeeFromProfile,
    tdeeSource,
    carbRows: rows,
    rdaGrams: ADULT_RDA_G,
    rdaKcal: ADULT_RDA_KCAL,
    statusHeadline: 'Carbohydrate targets',
    statusDetail: exGrams
      ? `${Math.round(totalKcal).toLocaleString('en-US')} kcal/day at 50% carbohydrate ≈ ${exGrams} g/day (4 kcal/g).`
      : 'Carbohydrate grams from energy share.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}