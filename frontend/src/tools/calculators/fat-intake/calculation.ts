/**
 * Fat Intake Calculator — total-fat AMDR grams + saturated-fat upper guidance (ADR-018).
 *
 * Total fat g/day = kcal/day × (share% / 100) / 9
 * Adult AMDR total fat: 20–35% of energy (IOM DRI).
 * Saturated fat upper guidance: <10% of energy (Dietary Guidelines for Americans).
 * Optional maintenance kcal: Mifflin–St Jeor × PAL when Calories is blank.
 */

import { mifflinStJeorBmrKcal } from '../calorie/calculation';
import { activityById, type ActivityId } from '../calorie/types';
import type { FatIntakeInput, FatIntakeResult, FatShareRow } from './types';

export const KCAL_PER_G_FAT = 9;

/** Adult AMDR total-fat energy shares (IOM Dietary Reference Intakes). */
export const FAT_SHARE_PERCENTS = [20, 25, 30, 35] as const;

/** Dietary Guidelines for Americans saturated-fat upper share of energy. */
export const SATURATED_FAT_MAX_SHARE_PERCENT = 10;

export const SOURCE_NOTE =
  'IOM AMDR total fat 20–35% of energy; Dietary Guidelines for Americans saturated fat <10% of energy; 9 kcal/g fat; optional Mifflin–St Jeor × PAL maintenance.';

export const DISCLAIMER =
  'Educational nutrition arithmetic from published AMDR/%-energy guidance — not individualized medical nutrition therapy.';

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

/** Fat grams from daily energy and percent share (Atwater 9 kcal/g). */
export function fatGramsFromKcalAndShare(
  kcalPerDay: number,
  sharePercent: number,
): number {
  return (kcalPerDay * (sharePercent / 100)) / KCAL_PER_G_FAT;
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

export function buildFatShareRows(kcalPerDay: number): FatShareRow[] {
  return FAT_SHARE_PERCENTS.map((pct) => {
    const kcal = kcalPerDay * (pct / 100);
    const grams = fatGramsFromKcalAndShare(kcalPerDay, pct);
    return {
      sharePercent: pct,
      fatKcalPerDay: kcal,
      fatGramsPerDay: grams,
    };
  });
}

export function calculateFatIntake(input: FatIntakeInput): FatIntakeResult {
  const empty: FatIntakeResult = {
    totalKcalPerDay: null,
    tdeeFromProfile: null,
    tdeeSource: null,
    fatRows: [],
    saturatedFatMaxGrams: null,
    saturatedFatMaxKcal: null,
    saturatedSharePercent: SATURATED_FAT_MAX_SHARE_PERCENT,
    statusHeadline: 'Enter profile or calories',
    statusDetail:
      'Fill sex, height, weight, age, and activity to estimate maintenance kcal, or enter calories directly. Total-fat grams use 9 kcal/g across the 20–35% AMDR; saturated fat is shown separately at <10% of energy.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const age = parseNumber(input.ageYearsText);
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);
  const kcalOverride = parseNumber(input.caloriesText);

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
    tdeeSource = 'Calories field';
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

  const rows = buildFatShareRows(totalKcal);
  const mid = rows.find((r) => r.sharePercent === 30);
  const midGrams = mid ? mid.fatGramsPerDay : null;
  const satKcal = totalKcal * (SATURATED_FAT_MAX_SHARE_PERCENT / 100);
  const satGrams = fatGramsFromKcalAndShare(
    totalKcal,
    SATURATED_FAT_MAX_SHARE_PERCENT,
  );

  return {
    totalKcalPerDay: totalKcal,
    tdeeFromProfile,
    tdeeSource,
    fatRows: rows,
    saturatedFatMaxGrams: satGrams,
    saturatedFatMaxKcal: satKcal,
    saturatedSharePercent: SATURATED_FAT_MAX_SHARE_PERCENT,
    statusHeadline: 'Daily fat targets',
    statusDetail: midGrams != null
      ? `${Math.round(totalKcal).toLocaleString('en-US')} kcal/day at 30% total fat ≈ ${midGrams.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} g/day (9 kcal/g).`
      : 'Total-fat grams from AMDR energy shares.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
