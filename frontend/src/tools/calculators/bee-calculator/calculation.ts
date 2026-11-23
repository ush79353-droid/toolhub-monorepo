/**
 * Basal energy expenditure (BEE) — revised Harris–Benedict (Roza & Shizgal, 1984).
 * Total energy expenditure (TEE) = BEE × activity × stress × temperature factors.
 *
 * Men:   88.362 + 13.397×kg + 4.799×cm − 5.677×age
 * Women: 447.593 + 9.247×kg + 3.098×cm − 4.330×age
 */

import type {
  BeeActivity,
  BeeCalculatorInput,
  BeeCalculatorResult,
  BeeStress,
  BeeTemperature,
  EnergyUnit,
} from './types';

export const SOURCE_NOTE =
  'Revised Harris–Benedict BEE (kcal/day); TEE = BEE × activity × stress × temperature multipliers. Educational estimate only.';

export const DISCLAIMER =
  'Not individualized medical nutrition therapy — verify with a clinician or dietitian.';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;
const KCAL_TO_MJ = 0.004184;

export const ACTIVITY_FACTORS: Record<BeeActivity, number> = {
  bed_rest: 1.0,
  light_sedentary: 1.2,
  moderate: 1.4,
  heavy: 1.6,
};

export const STRESS_FACTORS: Record<BeeStress, number> = {
  none: 1.0,
  minor: 1.1,
  moderate: 1.2,
  severe: 1.35,
};

export const TEMPERATURE_FACTORS: Record<BeeTemperature, number> = {
  normal: 1.0,
  fever_low: 1.1,
  fever_high: 1.2,
};

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

/**
 * Revised Harris–Benedict BEE in kcal/day.
 */
export function revisedHarrisBenedictBeeKcalPerDay(
  sex: 'male' | 'female',
  ageYears: number,
  heightCm: number,
  weightKg: number,
): number {
  if (!(ageYears > 0 && ageYears <= 120)) throw new Error('Age out of range.');
  if (!(heightCm > 0 && weightKg > 0)) throw new Error('Height and weight must be positive.');
  if (sex === 'male') {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
  }
  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * ageYears;
}

export function teeKcalFromBee(
  beeKcal: number,
  activity: BeeActivity,
  stress: BeeStress,
  temperature: BeeTemperature,
): number {
  return (
    beeKcal *
    ACTIVITY_FACTORS[activity] *
    STRESS_FACTORS[stress] *
    TEMPERATURE_FACTORS[temperature]
  );
}

export function formatEnergy(kcalPerDay: number | null, unit: EnergyUnit): string {
  if (kcalPerDay == null || !Number.isFinite(kcalPerDay)) return '';
  const value = unit === 'kcal_day' ? kcalPerDay : kcalPerDay * KCAL_TO_MJ;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: unit === 'kcal_day' ? 0 : 3,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(value));
}

export function energyUnitLabel(unit: EnergyUnit): string {
  return unit === 'kcal_day' ? 'kcal/day' : 'MJ/day';
}

export function calculateBeeCalculator(input: BeeCalculatorInput): BeeCalculatorResult {
  const empty = {
    beeKcalPerDay: null,
    teeKcalPerDay: null,
    beeDisplay: '',
    teeDisplay: '',
    energyUnitLabel: energyUnitLabel(input.energyUnit),
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const age = parseNumber(input.ageYearsText);
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);

  if (age === null || hRaw === null || wRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter age, height, and weight',
      statusDetail: 'Complete anthropometrics to estimate BEE and total energy expenditure.',
    };
  }

  if (!(age >= 15 && age <= 100)) {
    return {
      ...empty,
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be between 15 and 100 years for this equation.',
    };
  }

  if (!(hRaw > 0) || !(wRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid height or weight',
      statusDetail: 'Height and weight must be positive numbers.',
    };
  }

  const heightCm = heightToCm(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);

  const bee = revisedHarrisBenedictBeeKcalPerDay(input.sex, age, heightCm, weightKg);
  const tee = teeKcalFromBee(bee, input.activity, input.stress, input.temperature);

  return {
    beeKcalPerDay: bee,
    teeKcalPerDay: tee,
    beeDisplay: formatEnergy(bee, input.energyUnit),
    teeDisplay: formatEnergy(tee, input.energyUnit),
    energyUnitLabel: energyUnitLabel(input.energyUnit),
    statusHeadline: 'Energy expenditure estimate',
    statusDetail: `BEE ≈ ${formatEnergy(bee, 'kcal_day')} kcal/day; TEE ≈ ${formatEnergy(tee, 'kcal_day')} kcal/day after activity, stress, and temperature factors.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}