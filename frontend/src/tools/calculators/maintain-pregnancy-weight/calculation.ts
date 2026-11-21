/**
 * Educational gestational weight-gain ranges (IOM 2009 / CDC maternal guidance).
 * Shows recommended cumulative gain and absolute weight by week — NOT weight-loss targets.
 */

import type {
  HeightUnit,
  MaintainPregnancyWeightInput,
  MaintainPregnancyWeightResult,
  WeightUnit,
} from './types';

export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const KG_PER_POUND = 0.45359237;

/** Full-term reference week for total IOM ranges. */
export const TERM_WEEK = 40;
export const MIN_WEEK = 0;
export const MAX_WEEK = 42;

export const DISCLAIMER =
  'Educational IOM/CDC gestational weight-gain ranges only. This tool does not create weight-loss diets or restrictive pregnancy plans. Discuss personal targets with a clinician.';

export const SOURCE_NOTE =
  'Singleton and twin total gain ranges follow Institute of Medicine (2009) recommendations as summarized by CDC maternal infant health guidance. Week progress uses proportional cumulative gain to the selected week (capped at term).';

export const GUIDANCE_NOTE =
  'Healthy pregnancies usually involve some weight gain. Focus on nutritious intake and clinical follow-up—not losing weight unless a clinician specifically directs care.';

type BmiBand = 'underweight' | 'normal' | 'overweight' | 'obese';

/** Total recommended gain over pregnancy in kg (IOM 2009). */
const SINGLETON_GAIN_KG: Record<BmiBand, { min: number; max: number }> = {
  underweight: { min: 12.5, max: 18 }, // 28–40 lb
  normal: { min: 11.5, max: 16 }, // 25–35 lb
  overweight: { min: 7, max: 11.5 }, // 15–25 lb
  obese: { min: 5, max: 9 }, // 11–20 lb
};

const TWIN_GAIN_KG: Record<BmiBand, { min: number; max: number }> = {
  underweight: { min: 17, max: 25 }, // less studied; aligned near normal twin band
  normal: { min: 17, max: 25 }, // 37–54 lb
  overweight: { min: 14, max: 23 }, // 31–50 lb
  obese: { min: 11, max: 19 }, // 25–42 lb
};

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToMeters(value: number, unit: HeightUnit): number {
  switch (unit) {
    case 'm':
      return value;
    case 'cm':
      return value / 100;
    case 'in':
      return value * METERS_PER_INCH;
    case 'ft':
      return value * METERS_PER_FOOT;
    default: {
      const _e: never = unit;
      return _e;
    }
  }
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_POUND : value;
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / KG_PER_POUND : kg;
}

export function calculateBmi(heightMeters: number, weightKg: number): number {
  return weightKg / (heightMeters * heightMeters);
}

export function classifyPrePregnancyBmi(bmi: number): {
  band: BmiBand;
  label: string;
} {
  if (bmi < 18.5) return { band: 'underweight', label: 'Underweight (<18.5)' };
  if (bmi < 25) return { band: 'normal', label: 'Normal weight (18.5–24.9)' };
  if (bmi < 30) return { band: 'overweight', label: 'Overweight (25–29.9)' };
  return { band: 'obese', label: 'Obesity (≥30)' };
}

export function totalGainRangeKg(
  band: BmiBand,
  twins: boolean,
): { min: number; max: number } {
  return twins ? TWIN_GAIN_KG[band] : SINGLETON_GAIN_KG[band];
}

/** Cumulative fraction of total recommended gain by gestational week. */
export function gainProgressFraction(week: number): number {
  if (week <= 0) return 0;
  if (week >= TERM_WEEK) return 1;
  return week / TERM_WEEK;
}

export function formatWeight(kg: number, unit: WeightUnit): string {
  const v = kgToWeight(kg, unit);
  return `${v.toLocaleString('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} ${unit}`;
}

export function calculateMaintainPregnancyWeight(
  input: MaintainPregnancyWeightInput,
): MaintainPregnancyWeightResult | null {
  const h = parseNumber(input.height);
  const w = parseNumber(input.weight);
  const weekRaw = parseNumber(input.week);
  if (h == null || w == null || weekRaw == null) return null;
  if (h <= 0 || w <= 0) return null;
  if (weekRaw < MIN_WEEK || weekRaw > MAX_WEEK) return null;

  const heightMeters = heightToMeters(h, input.heightUnit);
  const weightKg = weightToKg(w, input.weightUnit);
  if (!(heightMeters > 0) || heightMeters > 3 || !(weightKg > 0)) return null;

  const bmi = calculateBmi(heightMeters, weightKg);
  if (!Number.isFinite(bmi) || bmi <= 0 || bmi > 100) return null;

  const { band, label } = classifyPrePregnancyBmi(bmi);
  const total = totalGainRangeKg(band, input.twins);
  const frac = gainProgressFraction(weekRaw);
  const minGain = total.min * frac;
  const maxGain = total.max * frac;

  return {
    heightMeters,
    prePregnancyWeightKg: weightKg,
    bmi,
    formattedBmi: bmi.toFixed(2),
    bmiCategoryLabel: label,
    week: weekRaw,
    twins: input.twins,
    minGainKg: minGain,
    maxGainKg: maxGain,
    minWeightKg: weightKg + minGain,
    maxWeightKg: weightKg + maxGain,
    formattedMinGain: formatWeight(minGain, input.weightUnit),
    formattedMaxGain: formatWeight(maxGain, input.weightUnit),
    formattedMinWeight: formatWeight(weightKg + minGain, input.weightUnit),
    formattedMaxWeight: formatWeight(weightKg + maxGain, input.weightUnit),
    weightUnit: input.weightUnit,
    guidanceNote: GUIDANCE_NOTE,
    disclaimer: DISCLAIMER,
    sourceNote: SOURCE_NOTE,
  };
}
