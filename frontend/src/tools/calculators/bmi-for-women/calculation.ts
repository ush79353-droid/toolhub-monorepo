/**
 * BMI Calculator for Women — pure engine (ADR-018).
 *
 * BMI = weight_kg / height_m² (Quetelet).
 * BMI Prime = BMI / 25 (upper bound of WHO adult “normal” range).
 * WHO adult cut-offs are sex-independent; this variant has no sex control.
 * Adult interpretation (categories + healthy weight band) only for ages ≥ 20.
 * Pregnancy: adult weight-status labels must not be used to evaluate gestational weight.
 */

import type {
  AgeInterpretation,
  BmiForWomenInput,
  BmiForWomenResult,
  HeightUnit,
  WeightUnit,
  WhoBmiCategory,
  WhoBmiCategoryId,
} from './types';

export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const CM_PER_METER = 100;
export const KG_PER_POUND = 0.45359237;
export const KG_PER_STONE = KG_PER_POUND * 14;

/** Upper limit of WHO adult normal BMI (kg/m²) — BMI Prime denominator. */
export const BMI_PRIME_REFERENCE = 25;

export const WHO_HEALTHY_BMI_MIN = 18.5;
export const WHO_HEALTHY_BMI_MAX = 24.9;

export const ADULT_AGE_MIN = 20;
export const AGE_MAX = 120;

export const CLASSIFICATION_SOURCE =
  'WHO adult BMI cut-offs (kg/m²): severe thinness <16; moderate 16–16.99; mild 17–18.49; normal 18.5–24.99; overweight 25–29.99; obese I 30–34.99; II 35–39.99; III ≥40. BMI Prime = BMI ÷ 25. Same cut-offs for women and men.';

export const DISCLAIMER =
  'BMI is a screening index only. It does not diagnose disease, body fat, or athletic readiness. Seek clinical advice for personal health decisions.';

export const PREGNANCY_NOTE =
  'Do not use adult BMI weight-status labels to evaluate weight during pregnancy. Gestational weight guidance uses pre-pregnancy BMI and trimester-specific ranges from clinical sources (e.g. IOM/ACOG)—not the adult WHO categories shown here.';

const WHO_CATEGORIES: readonly {
  id: WhoBmiCategoryId;
  label: string;
  min: number;
  maxExclusive: number | null;
  rangeLabel: string;
  primeRangeLabel: string;
}[] = [
  {
    id: 'severe_thinness',
    label: 'Severe thinness',
    min: Number.NEGATIVE_INFINITY,
    maxExclusive: 16,
    rangeLabel: '< 16.0',
    primeRangeLabel: '< 0.64',
  },
  {
    id: 'moderate_thinness',
    label: 'Moderate thinness',
    min: 16,
    maxExclusive: 17,
    rangeLabel: '16.0 – 16.99',
    primeRangeLabel: '0.64 – 0.68',
  },
  {
    id: 'mild_thinness',
    label: 'Mild thinness',
    min: 17,
    maxExclusive: 18.5,
    rangeLabel: '17.0 – 18.49',
    primeRangeLabel: '0.68 – 0.74',
  },
  {
    id: 'normal',
    label: 'Normal range',
    min: 18.5,
    maxExclusive: 25,
    rangeLabel: '18.5 – 24.99',
    primeRangeLabel: '0.74 – 0.999',
  },
  {
    id: 'overweight',
    label: 'Overweight',
    min: 25,
    maxExclusive: 30,
    rangeLabel: '25.0 – 29.99',
    primeRangeLabel: '1.00 – 1.20',
  },
  {
    id: 'obese_i',
    label: 'Obese class I',
    min: 30,
    maxExclusive: 35,
    rangeLabel: '30.0 – 34.99',
    primeRangeLabel: '1.20 – 1.40',
  },
  {
    id: 'obese_ii',
    label: 'Obese class II',
    min: 35,
    maxExclusive: 40,
    rangeLabel: '35.0 – 39.99',
    primeRangeLabel: '1.40 – 1.60',
  },
  {
    id: 'obese_iii',
    label: 'Obese class III',
    min: 40,
    maxExclusive: null,
    rangeLabel: '≥ 40.0',
    primeRangeLabel: '≥ 1.60',
  },
];

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
      return value / CM_PER_METER;
    case 'in':
      return value * METERS_PER_INCH;
    case 'ft':
      return value * METERS_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function metersToHeight(meters: number, unit: HeightUnit): number {
  switch (unit) {
    case 'm':
      return meters;
    case 'cm':
      return meters * CM_PER_METER;
    case 'in':
      return meters / METERS_PER_INCH;
    case 'ft':
      return meters / METERS_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
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
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
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
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

/** Quetelet index: BMI = mass_kg / height_m². */
export function calculateBmi(heightMeters: number, weightKg: number): number {
  if (!(heightMeters > 0) || !Number.isFinite(heightMeters)) {
    throw new RangeError('Height must be a positive finite number.');
  }
  if (!(weightKg > 0) || !Number.isFinite(weightKg)) {
    throw new RangeError('Weight must be a positive finite number.');
  }
  return weightKg / (heightMeters * heightMeters);
}

export function calculateBmiPrime(bmi: number): number {
  if (!Number.isFinite(bmi)) {
    throw new RangeError('BMI must be finite.');
  }
  return bmi / BMI_PRIME_REFERENCE;
}

export function classifyWhoAdultBmi(bmi: number): WhoBmiCategory {
  if (!Number.isFinite(bmi)) {
    throw new RangeError('BMI must be finite.');
  }
  for (const row of WHO_CATEGORIES) {
    const underMax =
      row.maxExclusive === null ? true : bmi < row.maxExclusive;
    if (bmi >= row.min && underMax) {
      return {
        id: row.id,
        label: row.label,
        rangeLabel: row.rangeLabel,
        primeRangeLabel: row.primeRangeLabel,
      };
    }
  }
  // ponytail: unreachable with finite BMI; last class catches ≥40
  const last = WHO_CATEGORIES[WHO_CATEGORIES.length - 1]!;
  return {
    id: last.id,
    label: last.label,
    rangeLabel: last.rangeLabel,
    primeRangeLabel: last.primeRangeLabel,
  };
}

export function healthyWeightRangeKg(heightMeters: number): {
  minKg: number;
  maxKg: number;
} {
  if (!(heightMeters > 0) || !Number.isFinite(heightMeters)) {
    throw new RangeError('Height must be a positive finite number.');
  }
  const h2 = heightMeters * heightMeters;
  return {
    minKg: WHO_HEALTHY_BMI_MIN * h2,
    maxKg: WHO_HEALTHY_BMI_MAX * h2,
  };
}

export function formatBmi(bmi: number): string {
  if (!Number.isFinite(bmi)) return '';
  return bmi.toFixed(2);
}

export function formatBmiPrime(prime: number): string {
  if (!Number.isFinite(prime)) return '';
  return prime.toFixed(2);
}

export function formatMassKg(kg: number): string {
  if (!Number.isFinite(kg)) return '';
  return kg.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function resolveAgeInterpretation(
  ageRaw: string,
  ageYears: number | null,
): { interpretation: AgeInterpretation; note: string | null } {
  if (ageRaw.trim() === '') {
    return {
      interpretation: 'not_provided',
      note: 'Age left blank. BMI and BMI Prime are shown; WHO adult categories apply for ages 20+. Enter age to confirm the adult path.',
    };
  }
  if (ageYears == null) {
    return {
      interpretation: 'out_of_range',
      note: 'Enter a valid age in years.',
    };
  }
  if (ageYears < ADULT_AGE_MIN) {
    return {
      interpretation: 'under_adult',
      note: `Age ${ageYears} is under ${ADULT_AGE_MIN}. Adult WHO BMI cut-offs are not appropriate for most people under 20 — use age- and sex-specific BMI-for-age percentiles (e.g. CDC growth charts) instead.`,
    };
  }
  if (ageYears > AGE_MAX) {
    return {
      interpretation: 'out_of_range',
      note: `Age must be at most ${AGE_MAX} years for this adult BMI tool.`,
    };
  }
  return {
    interpretation: 'adult',
    note: 'Age ≥ 20: WHO adult BMI categories apply (same cut-offs for women and men).',
  };
}

export function calculateBmiForWomen(
  input: BmiForWomenInput,
): BmiForWomenResult | null {
  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);
  if (heightVal == null || weightVal == null) return null;
  if (heightVal <= 0 || weightVal <= 0) return null;

  const heightMeters = heightToMeters(heightVal, input.heightUnit);
  const weightKg = weightToKg(weightVal, input.weightUnit);
  if (!(heightMeters > 0) || !(weightKg > 0)) return null;
  if (heightMeters > 3.5 || weightKg > 500) return null;

  let bmi: number;
  try {
    bmi = calculateBmi(heightMeters, weightKg);
  } catch {
    return null;
  }
  if (!Number.isFinite(bmi) || bmi <= 0 || bmi > 200) return null;

  const bmiPrime = calculateBmiPrime(bmi);

  const ageParsed = parseNumber(input.age);
  const ageYears =
    ageParsed != null &&
    Number.isFinite(ageParsed) &&
    ageParsed >= 0 &&
    ageParsed <= AGE_MAX
      ? ageParsed
      : null;

  const { interpretation, note } = resolveAgeInterpretation(
    input.age,
    ageYears,
  );

  const showAdult =
    interpretation === 'adult' || interpretation === 'not_provided';

  let category: WhoBmiCategory | null = null;
  let healthyWeightMinKg: number | null = null;
  let healthyWeightMaxKg: number | null = null;
  let formattedHealthyWeightRange: string | null = null;

  if (showAdult) {
    category = classifyWhoAdultBmi(bmi);
    const range = healthyWeightRangeKg(heightMeters);
    healthyWeightMinKg = range.minKg;
    healthyWeightMaxKg = range.maxKg;
    formattedHealthyWeightRange = `${formatMassKg(range.minKg)} – ${formatMassKg(range.maxKg)} kg`;
  }

  return {
    heightMeters,
    weightKg,
    bmi,
    bmiPrime,
    formattedBmi: formatBmi(bmi),
    formattedBmiPrime: formatBmiPrime(bmiPrime),
    category,
    healthyWeightMinKg,
    healthyWeightMaxKg,
    formattedHealthyWeightRange,
    ageYears,
    ageInterpretation: interpretation,
    ageNote: note,
    pregnancyNote: PREGNANCY_NOTE,
    classificationSource: CLASSIFICATION_SOURCE,
    disclaimer: DISCLAIMER,
  };
}
