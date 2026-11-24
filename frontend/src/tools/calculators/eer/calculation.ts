/**
 * Adult Estimated Energy Requirement (EER) — Institute of Medicine
 * Dietary Reference Intakes for Energy (2002/2005).
 *
 * Men (≥19 y):
 *   EER = 662 − 9.53×age(y) + PA×(15.91×wt[kg] + 539.6×ht[m])
 * Women (≥19 y):
 *   EER = 354 − 6.91×age(y) + PA×(9.36×wt[kg] + 726×ht[m])
 *
 * PA coefficients (Barr et al. / IOM 2005 Table for adults ≥19 y):
 *   Sedentary 1.00 / 1.00
 *   Low active 1.11 (M) / 1.12 (F)
 *   Active 1.25 (M) / 1.27 (F)
 *   Very active 1.48 (M) / 1.45 (F)
 *
 * Pregnancy/lactation educational offsets (IOM 2002/2005; kept separate from baseline):
 *   +0 / +340 / +452 kcal/d by trimester; lactation +330 (0–6 mo) / +400 (7–12 mo).
 */

import {
  ACTIVITY_OPTIONS,
  PREGNANCY_LACTATION_OFFSETS,
  type EerActivity,
  type EerCalculatorInput,
  type EerCalculatorResult,
  type EerSex,
  type HeightUnit,
  type WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Institute of Medicine Dietary Reference Intakes for Energy (2002/2005) adult EER equations; height in meters, weight in kilograms, sex-specific PA coefficients.';

export const DISCLAIMER =
  'Educational estimate only — not individualized medical nutrition therapy. Verify with a clinician or registered dietitian.';

/** Inclusive adult equation age bounds (years). */
export const ADULT_AGE_MIN = 19;
export const ADULT_AGE_MAX = 100;

const CM_PER_IN = 2.54;
const LB_TO_KG = 0.45359237;

/** Sex-specific adult PA coefficients (IOM 2005). */
export const ADULT_PA_COEFFICIENTS: Record<
  EerActivity,
  { male: number; female: number }
> = {
  sedentary: { male: 1.0, female: 1.0 },
  low_active: { male: 1.11, female: 1.12 },
  active: { male: 1.25, female: 1.27 },
  very_active: { male: 1.48, female: 1.45 },
};

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToMeters(value: number, unit: HeightUnit): number {
  if (unit === 'm') return value;
  if (unit === 'cm') return value / 100;
  return (value * CM_PER_IN) / 100;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function adultPaCoefficient(sex: EerSex, activity: EerActivity): number {
  return ADULT_PA_COEFFICIENTS[activity][sex];
}

/**
 * Adult (≥19) IOM 2002/2005 EER in kcal/day.
 * Height must already be meters; weight kilograms.
 */
export function adultEerKcalPerDay(
  sex: EerSex,
  ageYears: number,
  heightM: number,
  weightKg: number,
  activity: EerActivity,
): number {
  if (!(ageYears >= ADULT_AGE_MIN && ageYears <= ADULT_AGE_MAX)) {
    throw new Error('Age out of adult EER range.');
  }
  if (!(heightM > 0 && weightKg > 0)) {
    throw new Error('Height and weight must be positive.');
  }
  const pa = adultPaCoefficient(sex, activity);
  if (sex === 'male') {
    return 662 - 9.53 * ageYears + pa * (15.91 * weightKg + 539.6 * heightM);
  }
  return 354 - 6.91 * ageYears + pa * (9.36 * weightKg + 726 * heightM);
}

export function formatEerKcal(kcalPerDay: number | null): string {
  if (kcalPerDay == null || !Number.isFinite(kcalPerDay)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(kcalPerDay));
}

export function calculateEerCalculator(input: EerCalculatorInput): EerCalculatorResult {
  const activityMeta =
    ACTIVITY_OPTIONS.find((o) => o.id === input.activity) ?? ACTIVITY_OPTIONS[1];

  const empty = {
    eerKcalPerDay: null as number | null,
    eerDisplay: '',
    paCoefficient: null as number | null,
    activityLabel: activityMeta.label,
    activityDescription: activityMeta.description,
    pregnancyLactation: PREGNANCY_LACTATION_OFFSETS,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const age = parseNumber(input.ageYearsText);
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);

  if (age === null || hRaw === null || wRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter height, weight, and age',
      statusDetail:
        'Complete anthropometrics to estimate adult EER (IOM DRI 2002/2005).',
    };
  }

  if (!(age >= ADULT_AGE_MIN && age <= ADULT_AGE_MAX)) {
    return {
      ...empty,
      statusHeadline: 'Age out of range',
      statusDetail: `Adult EER equations apply for ages ${ADULT_AGE_MIN}–${ADULT_AGE_MAX} years.`,
    };
  }

  if (!(hRaw > 0) || !(wRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid height or weight',
      statusDetail: 'Height and weight must be positive numbers.',
    };
  }

  const heightM = heightToMeters(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);

  if (!(heightM > 0.5 && heightM < 2.8)) {
    return {
      ...empty,
      statusHeadline: 'Height out of range',
      statusDetail: 'Enter a plausible adult height.',
    };
  }

  if (!(weightKg > 20 && weightKg < 400)) {
    return {
      ...empty,
      statusHeadline: 'Weight out of range',
      statusDetail: 'Enter a plausible adult weight.',
    };
  }

  const pa = adultPaCoefficient(input.sex, input.activity);
  const eer = adultEerKcalPerDay(input.sex, age, heightM, weightKg, input.activity);

  return {
    eerKcalPerDay: eer,
    eerDisplay: formatEerKcal(eer),
    paCoefficient: pa,
    activityLabel: activityMeta.label,
    activityDescription: activityMeta.description,
    pregnancyLactation: PREGNANCY_LACTATION_OFFSETS,
    statusHeadline: 'Estimated energy requirement',
    statusDetail: `Adult EER ≈ ${formatEerKcal(eer)} kcal/day (PA ${pa}). Pregnancy/lactation offsets below are educational additions only.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
