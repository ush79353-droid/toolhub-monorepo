/**
 * Pregnancy Weight Gain Calculator — pure IOM 2009 / CDC / National Academies
 * gestational gain engine (ADR-018).
 *
 * Shared entry points are intentionally exportable so Excessive Weight Gain
 * in Pregnancy can reuse the same bands without duplicating catalog math.
 *
 * Sources:
 * - CDC maternal weight gain overview
 * - IOM / National Academies 2009 gestational weight gain guidelines
 */

import type {
  BmiCategoryId,
  GainBandKg,
  HeightUnit,
  PregnancyWeightGainAvailability,
  PregnancyWeightGainInput,
  PregnancyWeightGainResult,
  WeightUnit,
} from './types';

export const CM_PER_INCH = 2.54;
export const KG_PER_LB = 0.45359237;

/** First-trimester cumulative gain assumed by week 13 (kg). */
export const FIRST_TRIMESTER_GAIN: GainBandKg = { minKg: 0.5, maxKg: 2.0 };

/** Term week used for official IOM total bands. */
export const TERM_WEEK = 40;

/** Twin provisional bands apply only in this late/term window. */
export const TWINS_TERM_WEEK_MIN = 37;

export const SOURCE_LABEL =
  'IOM / National Academies 2009 gestational weight-gain guidelines; CDC maternal weight-gain overview. Twin totals are provisional IOM recommendations.';

export const DISCLAIMER =
  'Educational screening ranges only—not medical advice. Individual targets depend on clinical context. Discuss weight-gain goals with a qualified clinician.';

export const TWINS_UNDERWEIGHT_MESSAGE =
  'IOM provisional twin guidelines do not provide a recommended total gain band for underweight pre-pregnancy BMI. Ask your clinician for individualized twin targets.';

export const TWINS_MIDPREGNANCY_MESSAGE =
  'Provisional twin total-gain bands apply near term (week 37+). Mid-pregnancy twin week-by-week rates are not extrapolated here.';

type SingletonProfile = {
  category: BmiCategoryId;
  label: string;
  /** Official total gain at term (week 40). */
  total: GainBandKg;
  /** 2nd/3rd trimester weekly rate range (kg/wk). */
  rate: GainBandKg;
};

/** Pre-pregnancy BMI cut-offs and singleton bands (IOM 2009). */
const SINGLETON_PROFILES: readonly SingletonProfile[] = [
  {
    category: 'underweight',
    label: 'Underweight (BMI < 18.5)',
    total: { minKg: 12.5, maxKg: 18 },
    rate: { minKg: 0.44, maxKg: 0.58 },
  },
  {
    category: 'normal',
    label: 'Normal weight (BMI 18.5–24.9)',
    total: { minKg: 11.5, maxKg: 16 },
    rate: { minKg: 0.35, maxKg: 0.5 },
  },
  {
    category: 'overweight',
    label: 'Overweight (BMI 25–29.9)',
    total: { minKg: 7, maxKg: 11.5 },
    rate: { minKg: 0.23, maxKg: 0.33 },
  },
  {
    category: 'obese',
    label: 'Obese (BMI ≥ 30)',
    total: { minKg: 5, maxKg: 9 },
    rate: { minKg: 0.17, maxKg: 0.27 },
  },
];

/** Provisional twin total bands (normal / overweight / obese only). */
const TWIN_TOTALS: Partial<Record<BmiCategoryId, GainBandKg>> = {
  normal: { minKg: 17, maxKg: 25 },
  overweight: { minKg: 14, maxKg: 23 },
  obese: { minKg: 11, maxKg: 19 },
};

export function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function heightToMeters(value: number, unit: HeightUnit): number {
  if (!Number.isFinite(value) || value <= 0) return NaN;
  if (unit === 'cm') return value / 100;
  return (value * CM_PER_INCH) / 100;
}

export function metersToHeight(meters: number, unit: HeightUnit): number {
  if (!Number.isFinite(meters) || meters <= 0) return NaN;
  if (unit === 'cm') return meters * 100;
  return (meters * 100) / CM_PER_INCH;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  if (!Number.isFinite(value)) return NaN;
  return unit === 'kg' ? value : value * KG_PER_LB;
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  if (!Number.isFinite(kg)) return NaN;
  return unit === 'kg' ? kg : kg / KG_PER_LB;
}

export function calculateBmi(heightMeters: number, weightKg: number): number {
  if (
    !Number.isFinite(heightMeters) ||
    !Number.isFinite(weightKg) ||
    heightMeters <= 0 ||
    weightKg <= 0
  ) {
    return NaN;
  }
  return weightKg / (heightMeters * heightMeters);
}

export function formatBmi(bmi: number): string {
  if (!Number.isFinite(bmi)) return '';
  return bmi.toFixed(2);
}

export function formatWeightDisplay(kg: number, unit: WeightUnit): string {
  if (!Number.isFinite(kg)) return '';
  const value = kgToWeight(kg, unit);
  return value.toFixed(unit === 'kg' ? 1 : 1);
}

export function classifyPrepregnancyBmi(bmi: number): SingletonProfile | null {
  if (!Number.isFinite(bmi) || bmi <= 0) return null;
  if (bmi < 18.5) return SINGLETON_PROFILES[0]!;
  if (bmi < 25) return SINGLETON_PROFILES[1]!;
  if (bmi < 30) return SINGLETON_PROFILES[2]!;
  return SINGLETON_PROFILES[3]!;
}

/**
 * Singleton recommended gain at gestational week W.
 * W ≤ 13: linear ramp of first-trimester 0.5–2.0 kg.
 * W > 13: FT bound + rate × (W − 13).
 * W ≥ 40: official IOM total bands (authoritative at term).
 */
export function singletonGainAtWeek(
  category: BmiCategoryId,
  week: number,
): GainBandKg | null {
  const profile = SINGLETON_PROFILES.find((p) => p.category === category);
  if (!profile || !Number.isFinite(week) || week < 1) return null;

  const w = Math.min(week, TERM_WEEK);
  if (w >= TERM_WEEK) {
    return { ...profile.total };
  }
  if (w <= 13) {
    const frac = w / 13;
    return {
      minKg: FIRST_TRIMESTER_GAIN.minKg * frac,
      maxKg: FIRST_TRIMESTER_GAIN.maxKg * frac,
    };
  }
  const after = w - 13;
  return {
    minKg: FIRST_TRIMESTER_GAIN.minKg + profile.rate.minKg * after,
    maxKg: FIRST_TRIMESTER_GAIN.maxKg + profile.rate.maxKg * after,
  };
}

/**
 * Twin provisional totals — only near term (week ≥ 37).
 * Underweight twins: unavailable. Mid-pregnancy: unavailable (no linear extrapolation).
 */
export function twinGainAtWeek(
  category: BmiCategoryId,
  week: number,
): {
  availability: PregnancyWeightGainAvailability;
  band: GainBandKg | null;
  message: string | null;
} {
  if (category === 'underweight') {
    return {
      availability: 'twins_underweight_unavailable',
      band: null,
      message: TWINS_UNDERWEIGHT_MESSAGE,
    };
  }
  if (!Number.isFinite(week) || week < TWINS_TERM_WEEK_MIN) {
    return {
      availability: 'twins_midpregnancy_unavailable',
      band: null,
      message: TWINS_MIDPREGNANCY_MESSAGE,
    };
  }
  const band = TWIN_TOTALS[category];
  if (!band) {
    return {
      availability: 'twins_underweight_unavailable',
      band: null,
      message: TWINS_UNDERWEIGHT_MESSAGE,
    };
  }
  return { availability: 'ok', band: { ...band }, message: null };
}

/** Core numeric path used by this calculator and Excessive Weight Gain. */
export function computeGestationalGainBounds(params: {
  heightMeters: number;
  weightKg: number;
  week: number;
  twins: boolean;
}): {
  bmi: number;
  category: BmiCategoryId;
  categoryLabel: string;
  availability: PregnancyWeightGainAvailability;
  message: string | null;
  gain: GainBandKg | null;
} | null {
  const bmi = calculateBmi(params.heightMeters, params.weightKg);
  const profile = classifyPrepregnancyBmi(bmi);
  if (!profile) return null;

  if (params.twins) {
    const twin = twinGainAtWeek(profile.category, params.week);
    return {
      bmi,
      category: profile.category,
      categoryLabel: profile.label,
      availability: twin.availability,
      message: twin.message,
      gain: twin.band,
    };
  }

  const gain = singletonGainAtWeek(profile.category, params.week);
  return {
    bmi,
    category: profile.category,
    categoryLabel: profile.label,
    availability: gain ? 'ok' : 'twins_midpregnancy_unavailable',
    message: gain ? null : TWINS_MIDPREGNANCY_MESSAGE,
    gain,
  };
}

export function calculatePregnancyWeightGain(
  input: PregnancyWeightGainInput,
): PregnancyWeightGainResult | null {
  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);
  const weekVal = parseNumber(input.week);
  if (heightVal == null || weightVal == null || weekVal == null) return null;

  const heightMeters = heightToMeters(heightVal, input.heightUnit);
  const weightKg = weightToKg(weightVal, input.weightUnit);
  if (!(heightMeters > 0) || !(weightKg > 0) || !(weekVal >= 1)) return null;

  const computed = computeGestationalGainBounds({
    heightMeters,
    weightKg,
    week: weekVal,
    twins: input.twins,
  });
  if (!computed) return null;

  const minGainKg = computed.gain?.minKg ?? null;
  const maxGainKg = computed.gain?.maxKg ?? null;
  const minWeightKg =
    minGainKg != null ? weightKg + minGainKg : null;
  const maxWeightKg =
    maxGainKg != null ? weightKg + maxGainKg : null;

  return {
    bmi: computed.bmi,
    formattedBmi: formatBmi(computed.bmi),
    bmiCategory: computed.category,
    bmiCategoryLabel: computed.categoryLabel,
    week: weekVal,
    twins: input.twins,
    availability: computed.availability,
    unavailableMessage: computed.message,
    minGainKg,
    maxGainKg,
    minWeightKg,
    maxWeightKg,
    formattedMinGain:
      minGainKg != null
        ? formatWeightDisplay(minGainKg, input.resultGainUnit)
        : '',
    formattedMaxGain:
      maxGainKg != null
        ? formatWeightDisplay(maxGainKg, input.resultGainUnit)
        : '',
    formattedMinWeight:
      minWeightKg != null
        ? formatWeightDisplay(minWeightKg, input.resultWeightUnit)
        : '',
    formattedMaxWeight:
      maxWeightKg != null
        ? formatWeightDisplay(maxWeightKg, input.resultWeightUnit)
        : '',
    sourceLabel: SOURCE_LABEL,
    disclaimer: DISCLAIMER,
  };
}
