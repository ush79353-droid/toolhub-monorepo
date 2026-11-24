/**
 * TDEE Calculator — educational (ADR-018).
 *
 * BMR: Mifflin–St Jeor (shared `mifflinStJeorBmrKcal` from calorie/).
 * TDEE = BMR × PAL. PAL bands match IIFYM/Omni light-exercise labels.
 *
 * Age UI shows 18–120; values outside are rejected or flagged.
 * Mifflin was derived mainly on adults — ages >80 marked as extrapolation.
 */

import { mifflinStJeorBmrKcal } from '../calorie/calculation';
import {
  activityById,
  type EnergyUnit,
  type HeightUnit,
  type TdeeInput,
  type TdeeResult,
  type WeightUnit,
} from './types';

export const KJ_PER_KCAL = 4.184;
export const AGE_MIN = 18;
export const AGE_MAX = 120;
/** Soft ceiling where Mifflin adult cohorts are thinner. */
export const AGE_EXTRAPOLATION_YEARS = 80;

export const SOURCE_NOTE =
  'BMR = Mifflin–St Jeor (Am J Clin Nutr 1990) via shared calorie helper. TDEE = BMR × PAL (Omni-style activity bands; light exercise = 1.4). Educational estimate only.';

export const DISCLAIMER =
  'Educational energy estimate only — not medical nutrition therapy or individualized prescription.';

export function parseNumber(text: string): number | null {
  const t = text.trim();
  if (t === '') return null;
  const n = Number(t.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: HeightUnit): number | null {
  if (!(value > 0)) return null;
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
  if (!(value > 0)) return null;
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

export function formatEnergy(kcal: number, unit: EnergyUnit): string {
  const n = unit === 'kJ' ? kcal * KJ_PER_KCAL : kcal;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(n));
}

export function calculateTdee(input: TdeeInput): TdeeResult {
  const empty: TdeeResult = {
    bmrKcal: null,
    tdeeKcal: null,
    bmrDisplay: '',
    tdeeDisplay: '',
    pal: null,
    ageExtrapolated: false,
    statusHeadline: 'Enter age, height, and weight',
    statusDetail: 'TDEE = Mifflin–St Jeor BMR × activity factor.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const age = parseNumber(input.ageYearsText);
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);
  if (age === null || hRaw === null || wRaw === null) return empty;
  if (!(age >= AGE_MIN && age <= AGE_MAX)) return empty;

  const heightCm = heightToCm(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);
  if (heightCm == null || weightKg == null) return empty;

  const bmr = mifflinStJeorBmrKcal(weightKg, heightCm, age, input.sex);
  if (bmr == null || !(bmr > 0)) return empty;

  const act = activityById(input.activityId);
  const tdee = bmr * act.pal;
  const ageExtrapolated = age > AGE_EXTRAPOLATION_YEARS;
  const unitLabel = input.energyUnit === 'kJ' ? 'kJ' : 'kcal';

  return {
    bmrKcal: bmr,
    tdeeKcal: tdee,
    bmrDisplay: formatEnergy(bmr, input.energyUnit),
    tdeeDisplay: formatEnergy(tdee, input.energyUnit),
    pal: act.pal,
    ageExtrapolated,
    statusHeadline: `TDEE ≈ ${formatEnergy(tdee, input.energyUnit)} ${unitLabel}/day`,
    statusDetail: ageExtrapolated
      ? `BMR uses Mifflin–St Jeor; age ${age} is above typical derivation cohorts (≤${AGE_EXTRAPOLATION_YEARS}) — treat as extrapolation. PAL ${act.pal}.`
      : `BMR × PAL ${act.pal}. Changing activity does not change BMR.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
