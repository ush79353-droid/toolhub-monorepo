/**
 * Carbohydrate Calculator — maintenance kcal then carb kcal/g table (ADR-018).
 *
 * BMR: Mifflin–St Jeor (default) or revised Harris–Benedict (settings).
 * Maintenance = BMR × PAL; carb rows 45–65% at 4 kcal/g.
 */

import { mifflinStJeorBmrKcal } from '../calorie/calculation';
import { revisedHarrisBenedictBeeKcalPerDay } from '../bee-calculator/calculation';
import { buildCarbShareRows, KCAL_PER_G_CARB } from '../carb-calculator/calculation';
import type {
  CarbohydrateActivityId,
  CarbohydrateCalculatorInput,
  CarbohydrateCalculatorResult,
} from './types';
import { CARBOHYDRATE_ACTIVITY_OPTIONS } from './types';

export const SOURCE_NOTE =
  'Mifflin–St Jeor or revised Harris–Benedict BMR × activity PAL; carbohydrate AMDR-style shares at 4 kcal/g.';

export const DISCLAIMER =
  'Educational nutrition estimate — not individualized medical nutrition therapy.';

const IN_PER_FT = 12;
const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function resolveHeightWeightCmKg(input: CarbohydrateCalculatorInput): {
  heightCm: number;
  weightKg: number;
} | null {
  if (input.unitSystem === 'metric') {
    const h = parseNumber(input.heightCm);
    const w = parseNumber(input.weightKg);
    if (h == null || w == null || !(h > 0 && w > 0)) return null;
    return { heightCm: h, weightKg: w };
  }
  if (input.unitSystem === 'us') {
    const ft = parseNumber(input.heightFt) ?? 0;
    const inch = parseNumber(input.heightIn) ?? 0;
    const lb = parseNumber(input.weightLb);
    const totalIn = ft * IN_PER_FT + inch;
    if (!(totalIn > 0) || lb == null || !(lb > 0)) return null;
    return { heightCm: totalIn * IN_TO_CM, weightKg: lb * LB_TO_KG };
  }
  const hVal = parseNumber(input.otherHeight);
  const wVal = parseNumber(input.otherWeight);
  if (hVal == null || wVal == null || !(hVal > 0 && wVal > 0)) return null;
  let heightCm: number;
  switch (input.otherHeightUnit) {
    case 'cm':
      heightCm = hVal;
      break;
    case 'm':
      heightCm = hVal * 100;
      break;
    case 'in':
      heightCm = hVal * IN_TO_CM;
      break;
    case 'ft':
      heightCm = hVal * 30.48;
      break;
    default:
      return null;
  }
  let weightKg: number;
  switch (input.otherWeightUnit) {
    case 'kg':
      weightKg = wVal;
      break;
    case 'lb':
      weightKg = wVal * LB_TO_KG;
      break;
    case 'g':
      weightKg = wVal / 1000;
      break;
    case 'st':
      weightKg = wVal * 6.35029318;
      break;
    default:
      return null;
  }
  return { heightCm, weightKg };
}

export function maintenanceKcal(
  input: CarbohydrateCalculatorInput,
  age: number,
  heightCm: number,
  weightKg: number,
): number {
  const activity = CARBOHYDRATE_ACTIVITY_OPTIONS.find((a) => a.id === input.activityId);
  const pal = activity?.pal ?? 1.4;
  let bmr: number;
  if (input.equation === 'harris') {
    bmr = revisedHarrisBenedictBeeKcalPerDay(input.sex, age, heightCm, weightKg);
  } else {
    const m = mifflinStJeorBmrKcal(weightKg, heightCm, age, input.sex);
    if (m == null) throw new Error('Invalid BMR inputs.');
    bmr = m;
  }
  return bmr * pal;
}

export function calculateCarbohydrateCalculator(
  input: CarbohydrateCalculatorInput,
): CarbohydrateCalculatorResult {
  const empty: CarbohydrateCalculatorResult = {
    maintenanceKcalPerDay: null,
    carbRows: [],
    equationLabel: input.equation === 'harris' ? 'Revised Harris–Benedict' : 'Mifflin–St Jeor',
    statusHeadline: 'Press Calculate',
    statusDetail:
      'Enter age (18–80), sex, height, weight, and activity, then calculate carbohydrate targets from maintenance calories.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (!input.isSubmitted) return empty;

  const age = parseNumber(input.ageYearsText);
  if (age === null) {
    return { ...empty, statusHeadline: 'Enter age', statusDetail: 'Age is required (18–80 years).' };
  }
  if (!(age >= 18 && age <= 80)) {
    return {
      ...empty,
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be between 18 and 80 years.',
    };
  }

  const hw = resolveHeightWeightCmKg(input);
  if (hw == null) {
    return {
      ...empty,
      statusHeadline: 'Enter height and weight',
      statusDetail: 'Provide valid height and weight for the selected unit system.',
    };
  }

  const maint = maintenanceKcal(input, age, hw.heightCm, hw.weightKg);
  const rows = buildCarbShareRows(maint);

  return {
    maintenanceKcalPerDay: maint,
    carbRows: rows,
    equationLabel:
      input.equation === 'harris' ? 'Revised Harris–Benedict' : 'Mifflin–St Jeor',
    statusHeadline: 'Daily carbohydrate targets',
    statusDetail: `Maintenance ≈ ${Math.round(maint).toLocaleString('en-US')} kcal/day (${CARBOHYDRATE_ACTIVITY_OPTIONS.find((a) => a.id === input.activityId)?.label ?? 'activity'}). ${KCAL_PER_G_CARB} kcal/g carbohydrate.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function activityPal(id: CarbohydrateActivityId): number {
  return CARBOHYDRATE_ACTIVITY_OPTIONS.find((a) => a.id === id)?.pal ?? 1.4;
}