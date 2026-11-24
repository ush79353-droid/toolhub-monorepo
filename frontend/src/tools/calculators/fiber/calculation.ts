/**
 * Fiber Calculator — pure engine (ADR-018).
 *
 * Energy-scaled optimum (IOM DRI basis):
 *   fiber_g = daily_kcal × 14 / 1000
 *   (equivalently 0.014 × daily kcal; 2,000 kcal → 28 g)
 *
 * Age/sex Adequate Intake (AI) for total fiber from IOM DRI tables is looked up
 * separately and never substituted for the energy-scaled estimate.
 *
 * Optional maintenance energy: Mifflin–St Jeor BMR × activity PAL when the
 * calorie field is blank and sex/height/weight/age are complete.
 *
 * Sources:
 * - Institute of Medicine. Dietary Reference Intakes for Energy, Carbohydrate,
 *   Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids (2002/2005).
 *   Total fiber AI; criterion 14 g/1,000 kcal × median energy intake.
 * - Turner & Lupton, Adv Nutr 2011 (AI table summary).
 */

import { mifflinStJeorBmrKcal } from '../calorie/calculation';
import { activityById, type ActivityId } from '../calorie/types';
import type {
  EnergyUnit,
  FiberInput,
  FiberResult,
  FiberSex,
  HeightUnit,
  WeightUnit,
} from './types';

export const FIBER_G_PER_1000_KCAL = 14;
/** kJ per kcal (exact thermochemical calorie). */
export const KJ_PER_KCAL = 4.184;

export const SOURCE_NOTE =
  'IOM Dietary Reference Intakes: Adequate Intake for total fiber by life-stage/sex; energy-density basis 14 g per 1,000 kcal. Optional Mifflin–St Jeor × PAL for maintenance energy.';

export const DISCLAIMER =
  'Educational nutrition arithmetic — not medical nutrition therapy or an individualized prescription.';

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

/** Convert displayed energy to kcal before fiber math. */
export function energyToKcal(value: number, unit: EnergyUnit): number {
  return unit === 'kcal' ? value : value / KJ_PER_KCAL;
}

export function kcalToEnergyDisplay(kcal: number, unit: EnergyUnit): number {
  return unit === 'kcal' ? kcal : kcal * KJ_PER_KCAL;
}

/** Energy-scaled total fiber (g/day). Round only at presentation. */
export function fiberGramsFromKcal(kcalPerDay: number): number {
  return (kcalPerDay * FIBER_G_PER_1000_KCAL) / 1000;
}

/**
 * IOM total fiber Adequate Intake (g/day) by completed age years and sex.
 * Infants <1 y: ND (not determined) → null.
 * Pregnancy / lactation AIs (28 / 29 g) are not inferred without explicit status.
 */
export function lookupFiberAiG(
  ageYears: number,
  sex: Exclude<FiberSex, ''>,
): { grams: number; label: string } | null {
  if (!Number.isFinite(ageYears) || ageYears < 1) return null;

  if (ageYears < 4) {
    return { grams: 19, label: '1–3 y' };
  }
  if (ageYears < 9) {
    return { grams: 25, label: '4–8 y' };
  }
  if (ageYears < 14) {
    return sex === 'male'
      ? { grams: 31, label: 'males 9–13 y' }
      : { grams: 26, label: 'females 9–13 y' };
  }
  if (ageYears < 19) {
    return sex === 'male'
      ? { grams: 38, label: 'males 14–18 y' }
      : { grams: 26, label: 'females 14–18 y' };
  }
  if (ageYears <= 50) {
    return sex === 'male'
      ? { grams: 38, label: 'males 19–50 y' }
      : { grams: 25, label: 'females 19–50 y' };
  }
  // ≥51 y (includes >70 in IOM tables at the same AI)
  return sex === 'male'
    ? { grams: 30, label: 'males ≥51 y' }
    : { grams: 21, label: 'females ≥51 y' };
}

export function estimateMaintenanceKcal(
  sex: Exclude<FiberSex, ''>,
  ageYears: number,
  heightCm: number,
  weightKg: number,
  activityId: ActivityId,
): number | null {
  // Mifflin–St Jeor adult equation — reject clearly unsupported ages.
  if (!(ageYears >= 15 && ageYears <= 100)) return null;
  const bmr = mifflinStJeorBmrKcal(weightKg, heightCm, ageYears, sex);
  if (bmr == null) return null;
  const activity = activityById(activityId);
  const tdee = bmr * activity.pal;
  return Number.isFinite(tdee) ? tdee : null;
}

function emptyResult(partial?: Partial<FiberResult>): FiberResult {
  return {
    totalKcalPerDay: null,
    tdeeFromProfile: null,
    tdeeSource: null,
    energyScaledFiberG: null,
    aiFiberG: null,
    aiLabel: null,
    statusHeadline: 'Enter profile or daily calories',
    statusDetail:
      'Select sex and enter height, weight, age, and activity to estimate maintenance kcal, or enter recommended daily calorie intake directly. Fiber optimum uses 14 g per 1,000 kcal.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateFiber(input: FiberInput): FiberResult {
  const age = parseNumber(input.ageYearsText);
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);
  const energyRaw = parseNumber(input.caloriesText);

  let aiFiberG: number | null = null;
  let aiLabel: string | null = null;

  if (input.sex !== '' && age !== null && age >= 1) {
    const ai = lookupFiberAiG(age, input.sex);
    if (ai) {
      aiFiberG = ai.grams;
      aiLabel = ai.label;
    }
  }

  if (
    input.ageYearsText.trim() !== '' &&
    age !== null &&
    energyRaw === null &&
    !(age >= 15 && age <= 100) &&
    input.sex !== '' &&
    hRaw !== null &&
    wRaw !== null
  ) {
    // Profile present but age outside Mifflin range — AI may still apply.
    return emptyResult({
      aiFiberG,
      aiLabel,
      statusHeadline: 'Unsupported age for calorie estimate',
      statusDetail:
        'Maintenance calorie estimate uses Mifflin–St Jeor for ages 15–100. Enter daily calories directly, or adjust age. Age/sex Adequate Intake is still shown when available.',
    });
  }

  let totalKcal: number | null = null;
  let tdeeFromProfile: number | null = null;
  let tdeeSource: string | null = null;

  if (energyRaw !== null && energyRaw > 0) {
    totalKcal = energyToKcal(energyRaw, input.energyUnit);
    tdeeSource = 'Calorie intake field';
  }

  if (
    input.sex !== '' &&
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
      tdeeFromProfile = est;
      if (totalKcal == null) {
        totalKcal = est;
        tdeeSource = 'Mifflin–St Jeor × PAL';
      }
    }
  }

  if (totalKcal == null || !(totalKcal > 0)) {
    return emptyResult({
      aiFiberG,
      aiLabel,
      tdeeFromProfile,
      tdeeSource: tdeeFromProfile != null ? 'Mifflin–St Jeor × PAL' : null,
    });
  }

  const energyScaledFiberG = fiberGramsFromKcal(totalKcal);
  const roundedKcal = Math.round(totalKcal);
  const roundedFiber = Math.round(energyScaledFiberG * 10) / 10;

  return {
    totalKcalPerDay: totalKcal,
    tdeeFromProfile,
    tdeeSource,
    energyScaledFiberG,
    aiFiberG,
    aiLabel,
    statusHeadline: 'Fiber per day',
    statusDetail: `${roundedKcal.toLocaleString('en-US')} kcal/day × 14 g/1,000 kcal ≈ ${roundedFiber.toLocaleString('en-US', { maximumFractionDigits: 1 })} g/day (energy-scaled).${
      aiFiberG != null
        ? ` IOM AI (${aiLabel}): ${aiFiberG} g/day (distinct).`
        : ''
    }`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
