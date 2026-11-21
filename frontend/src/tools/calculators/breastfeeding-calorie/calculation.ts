/**
 * Breastfeeding Calorie Calculator — pure engine (ADR-018).
 *
 * Model: IOM / NAS Dietary Reference Intakes for Energy (2002/2005; women).
 * Non-pregnant EER + state-specific pregnancy or lactation energy addition.
 *
 * Adult women (≥19 y):
 *   EER = 354 − (6.91 × age) + PA × [(9.36 × wt_kg) + (726 × ht_m)]
 * Adolescent girls (14–18 y):
 *   EER = 135.3 − (30.8 × age) + PA × [(10.0 × wt_kg) + (934 × ht_m)] + 25
 *
 * Additions (same DRI tables):
 *   Pregnancy T1 +0 · T2 +340 · T3 +452
 *   Lactation 0–6 mo +330 (= 500 milk − 170 fat mobilization)
 *   Lactation >6 mo +400
 */

import {
  ACTIVITY_OPTIONS,
  PHYSIOLOGICAL_STATES,
  type ActivityId,
  type BreastfeedingCalorieInput,
  type BreastfeedingCalorieResult,
  type HeightUnit,
  type PhysiologicalStateId,
  type WeightUnit,
} from './types';

export const MODEL_SOURCE =
  'IOM/NAS Dietary Reference Intakes for Energy (2002/2005): Estimated Energy Requirement (EER) for adolescent and adult women, with DRI pregnancy energy deposition and lactation milk-output − weight-loss adjustments.';

export const DISCLAIMER =
  'Educational estimate only — not medical, dietary, or clinical advice. Individual needs vary with milk volume, twins, illness, and body-composition goals. Consult a qualified clinician or registered dietitian for personal guidance.';

export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const CM_PER_METER = 100;
export const KG_PER_POUND = 0.45359237;
export const KG_PER_STONE = KG_PER_POUND * 14;

/** Inclusive adolescent band for the DRI girl equation. */
export const ADOLESCENT_AGE_MIN = 14;
export const ADOLESCENT_AGE_MAX = 18;
/** Inclusive adult band for the DRI woman equation. */
export const ADULT_AGE_MIN = 19;
export const AGE_MAX = 70;

export function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function heightToMeters(value: number, unit: HeightUnit): number {
  switch (unit) {
    case 'cm':
      return value / CM_PER_METER;
    case 'm':
      return value;
    case 'in':
      return value * METERS_PER_INCH;
    case 'ft':
      return value * METERS_PER_FOOT;
  }
}

export function metersToHeight(meters: number, unit: HeightUnit): number {
  switch (unit) {
    case 'cm':
      return meters * CM_PER_METER;
    case 'm':
      return meters;
    case 'in':
      return meters / METERS_PER_INCH;
    case 'ft':
      return meters / METERS_PER_FOOT;
  }
}

export function weightToKg(value: number, unit: WeightUnit): number {
  switch (unit) {
    case 'kg':
      return value;
    case 'lb':
      return value * KG_PER_POUND;
    case 'st':
      return value * KG_PER_STONE;
  }
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  switch (unit) {
    case 'kg':
      return kg;
    case 'lb':
      return kg / KG_PER_POUND;
    case 'st':
      return kg / KG_PER_STONE;
  }
}

export function getStateOption(id: PhysiologicalStateId) {
  return PHYSIOLOGICAL_STATES.find((s) => s.id === id) ?? null;
}

export function getActivityOption(id: ActivityId) {
  return ACTIVITY_OPTIONS.find((a) => a.id === id) ?? null;
}

/** Non-pregnant female EER (kcal/day) before pregnancy/lactation addition. */
export function nonPregnantEerKcal(params: {
  ageYears: number;
  weightKg: number;
  heightMeters: number;
  pa: number;
  ageBand: 'adolescent' | 'adult';
}): number {
  const { ageYears, weightKg, heightMeters, pa, ageBand } = params;
  if (ageBand === 'adolescent') {
    return (
      135.3 -
      30.8 * ageYears +
      pa * (10.0 * weightKg + 934 * heightMeters) +
      25
    );
  }
  return (
    354 - 6.91 * ageYears + pa * (9.36 * weightKg + 726 * heightMeters)
  );
}

export function formatKcal(kcal: number): string {
  if (!Number.isFinite(kcal)) return '—';
  return Math.round(kcal).toLocaleString('en-US');
}

export function resolveAgeBand(
  ageYears: number,
): 'adolescent' | 'adult' | null {
  if (
    ageYears >= ADOLESCENT_AGE_MIN &&
    ageYears <= ADOLESCENT_AGE_MAX
  ) {
    return 'adolescent';
  }
  if (ageYears >= ADULT_AGE_MIN && ageYears <= AGE_MAX) {
    return 'adult';
  }
  return null;
}

export function calculateBreastfeedingCalorie(
  input: BreastfeedingCalorieInput,
): BreastfeedingCalorieResult | null {
  const ageYears = parseNumber(input.age);
  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);
  if (ageYears == null || heightVal == null || weightVal == null) return null;
  if (!(ageYears > 0) || !(heightVal > 0) || !(weightVal > 0)) return null;

  const ageBand = resolveAgeBand(ageYears);
  if (!ageBand) return null;

  const heightMeters = heightToMeters(heightVal, input.heightUnit);
  const weightKg = weightToKg(weightVal, input.weightUnit);
  if (!(heightMeters > 0) || !(weightKg > 0)) return null;
  if (heightMeters > 3.5 || weightKg > 500) return null;

  const activity = getActivityOption(input.activity);
  const state = getStateOption(input.state);
  if (!activity || !state) return null;

  const pa =
    ageBand === 'adolescent' ? activity.paAdolescent : activity.paAdult;
  const nonPregnant = nonPregnantEerKcal({
    ageYears,
    weightKg,
    heightMeters,
    pa,
    ageBand,
  });
  if (!Number.isFinite(nonPregnant)) return null;

  const daily = nonPregnant + state.energyAdditionKcal;
  if (!Number.isFinite(daily) || daily <= 0) return null;

  return {
    ageYears,
    heightMeters,
    weightKg,
    activityId: activity.id,
    activityLabel: activity.label,
    paCoefficient: pa,
    ageBand,
    stateId: state.id,
    stateLabel: state.label,
    energyAdditionKcal: state.energyAdditionKcal,
    nonPregnantEerKcal: nonPregnant,
    dailyEnergyNeedsKcal: daily,
    formattedDailyEnergyNeeds: formatKcal(daily),
    modelSource: MODEL_SOURCE,
    disclaimer: DISCLAIMER,
  };
}
