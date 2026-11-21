/**
 * BMI Weight Loss Calculator — pure engine (ADR-018).
 *
 * Current: BMI = kg / m²; BMI Prime = BMI / 25.
 * Target: weight_kg = targetBMI × m²; Prime ↔ BMI via ×/÷ 25.
 * Weight change = currentKg − targetKg (positive = loss, negative = gain).
 * Unsafe targets: BMI < 16 rejected; < 18.5 warned; ≥ 40 warned.
 * Optional CDC BMI-for-age percentile reuses bmi-kids LMS helpers (ages 2–<20).
 */

import {
  bmiLmsZScore,
  classifyCdcPercentile,
  interpolateLms,
  normalCdf,
  yearsToAgemos,
} from '../bmi-kids/calculation';
import { CDC_BMI_LMS_SOURCE } from '../bmi-kids/cdc-bmi-lms';
import type { Sex as KidsSex } from '../bmi-kids/types';
import type {
  BmiWeightLossInput,
  BmiWeightLossResult,
  HeightUnit,
  PercentileStatus,
  TargetEditField,
  TargetSafety,
  WeightChangeKind,
  WeightUnit,
  WhoBmiCategory,
  WhoBmiCategoryId,
} from './types';

export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const CM_PER_METER = 100;
export const KG_PER_POUND = 0.45359237;
export const KG_PER_STONE = KG_PER_POUND * 14;

export const BMI_PRIME_REFERENCE = 25;
export const WHO_HEALTHY_BMI_MIN = 18.5;
export const WHO_HEALTHY_BMI_MAX = 24.9;
export const SEVERE_THINNESS_BMI_MAX = 16;
export const HIGH_BMI_WARN = 40;
export const ADULT_AGE_MIN = 20;
export const CHILD_AGE_MIN = 2;
export const AGE_MAX = 120;

export const CLASSIFICATION_SOURCE =
  'WHO adult BMI cut-offs (kg/m²). BMI Prime = BMI ÷ 25. Target weight = target BMI × height(m)². Childhood BMI-for-age uses CDC 2000 LMS when age/sex are provided.';

export const DISCLAIMER =
  'BMI and target-weight figures are screening estimates only. They do not diagnose disease, prescribe diets, or replace clinical advice.';

const WHO_CATEGORIES: readonly {
  id: WhoBmiCategoryId;
  label: string;
  min: number;
  maxExclusive: number | null;
  rangeLabel: string;
}[] = [
  {
    id: 'severe_thinness',
    label: 'Severe thinness',
    min: Number.NEGATIVE_INFINITY,
    maxExclusive: 16,
    rangeLabel: '< 16.0',
  },
  {
    id: 'moderate_thinness',
    label: 'Moderate thinness',
    min: 16,
    maxExclusive: 17,
    rangeLabel: '16.0 – 16.99',
  },
  {
    id: 'mild_thinness',
    label: 'Mild thinness',
    min: 17,
    maxExclusive: 18.5,
    rangeLabel: '17.0 – 18.49',
  },
  {
    id: 'normal',
    label: 'Normal range',
    min: 18.5,
    maxExclusive: 25,
    rangeLabel: '18.5 – 24.99',
  },
  {
    id: 'overweight',
    label: 'Overweight',
    min: 25,
    maxExclusive: 30,
    rangeLabel: '25.0 – 29.99',
  },
  {
    id: 'obese_i',
    label: 'Obese class I',
    min: 30,
    maxExclusive: 35,
    rangeLabel: '30.0 – 34.99',
  },
  {
    id: 'obese_ii',
    label: 'Obese class II',
    min: 35,
    maxExclusive: 40,
    rangeLabel: '35.0 – 39.99',
  },
  {
    id: 'obese_iii',
    label: 'Obese class III',
    min: 40,
    maxExclusive: null,
    rangeLabel: '≥ 40.0',
  },
];

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
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

export function targetWeightFromBmi(
  targetBmi: number,
  heightMeters: number,
): number {
  if (!(targetBmi > 0) || !Number.isFinite(targetBmi)) {
    throw new RangeError('Target BMI must be a positive finite number.');
  }
  if (!(heightMeters > 0) || !Number.isFinite(heightMeters)) {
    throw new RangeError('Height must be a positive finite number.');
  }
  return targetBmi * heightMeters * heightMeters;
}

export function bmiFromWeight(weightKg: number, heightMeters: number): number {
  return calculateBmi(heightMeters, weightKg);
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
      };
    }
  }
  const last = WHO_CATEGORIES[WHO_CATEGORIES.length - 1]!;
  return {
    id: last.id,
    label: last.label,
    rangeLabel: last.rangeLabel,
  };
}

export function assessTargetSafety(targetBmi: number): {
  safety: TargetSafety;
  note: string | null;
} {
  if (!(targetBmi > 0) || !Number.isFinite(targetBmi)) {
    return { safety: 'ok', note: null };
  }
  if (targetBmi < SEVERE_THINNESS_BMI_MAX) {
    return {
      safety: 'severe_thinness_reject',
      note: 'Target BMI below 16 (severe thinness) is not supported. Choose a safer target at or above 16, ideally within the WHO adult healthy band 18.5–24.9.',
    };
  }
  if (targetBmi < WHO_HEALTHY_BMI_MIN) {
    return {
      safety: 'underweight_warn',
      note: 'Target BMI is below the WHO adult healthy band (18.5–24.9). Underweight targets can carry health risks — seek clinical advice before pursuing them.',
    };
  }
  if (targetBmi >= HIGH_BMI_WARN) {
    return {
      safety: 'high_warn',
      note: 'Target BMI is in the WHO obese class III range (≥ 40). Consider intermediate milestones and clinical guidance.',
    };
  }
  return { safety: 'ok', note: null };
}

export function formatBmi(bmi: number): string {
  if (!Number.isFinite(bmi)) return '';
  return bmi.toFixed(2);
}

export function formatBmiPrime(prime: number): string {
  if (!Number.isFinite(prime)) return '';
  return prime.toFixed(2);
}

export function formatMass(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPercentile(pct: number): string {
  if (!Number.isFinite(pct)) return '';
  return pct.toFixed(1);
}

export function resolveWeightChange(
  currentKg: number,
  targetKg: number,
): {
  changeKg: number;
  kind: WeightChangeKind;
  formatted: string;
} {
  const changeKg = currentKg - targetKg;
  let kind: WeightChangeKind = 'same';
  if (changeKg > 1e-9) kind = 'loss';
  else if (changeKg < -1e-9) kind = 'gain';
  const abs = Math.abs(changeKg);
  const formatted =
    kind === 'same'
      ? '0.00 kg (already at target)'
      : kind === 'loss'
        ? `${formatMass(abs)} kg to lose`
        : `${formatMass(abs)} kg to gain`;
  return { changeKg, kind, formatted };
}

/**
 * Derive the three linked target fields from the last-edited one.
 * Returns nulls when height or the authoritative target is missing/invalid.
 */
export function deriveTargetFields(
  heightMeters: number | null,
  input: BmiWeightLossInput,
): {
  targetBmi: number | null;
  targetPrime: number | null;
  targetWeightKg: number | null;
  rejected: boolean;
  rejectReason: string | null;
} {
  if (heightMeters == null || !(heightMeters > 0)) {
    return {
      targetBmi: null,
      targetPrime: null,
      targetWeightKg: null,
      rejected: false,
      rejectReason: null,
    };
  }

  const edit: TargetEditField | null = input.lastTargetEdit;
  let targetBmi: number | null = null;

  if (edit === 'bmi' || (edit == null && input.targetBmi.trim() !== '')) {
    targetBmi = parseNumber(input.targetBmi);
  } else if (edit === 'prime') {
    const prime = parseNumber(input.targetPrime);
    targetBmi =
      prime != null && Number.isFinite(prime)
        ? prime * BMI_PRIME_REFERENCE
        : null;
  } else if (edit === 'weight') {
    const w = parseNumber(input.targetWeight);
    if (w != null && w > 0) {
      const kg = weightToKg(w, input.targetWeightUnit);
      targetBmi = bmiFromWeight(kg, heightMeters);
    }
  } else if (input.targetPrime.trim() !== '') {
    const prime = parseNumber(input.targetPrime);
    targetBmi =
      prime != null && Number.isFinite(prime)
        ? prime * BMI_PRIME_REFERENCE
        : null;
  } else if (input.targetWeight.trim() !== '') {
    const w = parseNumber(input.targetWeight);
    if (w != null && w > 0) {
      const kg = weightToKg(w, input.targetWeightUnit);
      targetBmi = bmiFromWeight(kg, heightMeters);
    }
  }

  if (targetBmi == null || !(targetBmi > 0) || !Number.isFinite(targetBmi)) {
    return {
      targetBmi: null,
      targetPrime: null,
      targetWeightKg: null,
      rejected: false,
      rejectReason: null,
    };
  }

  const safety = assessTargetSafety(targetBmi);
  if (safety.safety === 'severe_thinness_reject') {
    return {
      targetBmi,
      targetPrime: calculateBmiPrime(targetBmi),
      targetWeightKg: null,
      rejected: true,
      rejectReason: safety.note,
    };
  }

  const targetWeightKg = targetWeightFromBmi(targetBmi, heightMeters);
  return {
    targetBmi,
    targetPrime: calculateBmiPrime(targetBmi),
    targetWeightKg,
    rejected: false,
    rejectReason: null,
  };
}

function resolvePercentile(
  bmi: number,
  input: BmiWeightLossInput,
): {
  status: PercentileStatus;
  percentile: number | null;
  note: string | null;
} {
  const ageBlank = input.age.trim() === '';
  const sexBlank = input.sex === '';
  if (ageBlank && sexBlank) {
    return {
      status: 'not_requested',
      percentile: null,
      note: null,
    };
  }
  if (ageBlank || sexBlank) {
    return {
      status: 'need_age_sex',
      percentile: null,
      note: 'Enter both exact age (years) and sex to compute a CDC BMI-for-age percentile.',
    };
  }

  const age = parseNumber(input.age);
  if (age == null || age < 0 || age > AGE_MAX) {
    return {
      status: 'out_of_range',
      percentile: null,
      note: 'Age is out of range for percentile lookup.',
    };
  }

  if (age >= ADULT_AGE_MIN) {
    return {
      status: 'adult_no_cdc',
      percentile: null,
      note: `CDC BMI-for-age charts apply to ages ${CHILD_AGE_MIN}–${ADULT_AGE_MIN - 1}. Adults use WHO BMI categories above instead of a childhood percentile. (${CDC_BMI_LMS_SOURCE})`,
    };
  }

  if (age < CHILD_AGE_MIN) {
    return {
      status: 'out_of_range',
      percentile: null,
      note: `CDC BMI-for-age starts at age ${CHILD_AGE_MIN}.`,
    };
  }

  const sex = input.sex as KidsSex;
  const agemos = yearsToAgemos(age);
  const lms = interpolateLms(sex, agemos);
  if (!lms) {
    return {
      status: 'unavailable',
      percentile: null,
      note: 'CDC LMS parameters unavailable for this age.',
    };
  }

  try {
    const z = bmiLmsZScore(bmi, lms.L, lms.M, lms.S);
    const pct = normalCdf(z) * 100;
    const band = classifyCdcPercentile(pct);
    return {
      status: 'ready',
      percentile: pct,
      note: `CDC BMI-for-age ≈ ${formatPercentile(pct)}th percentile (${band.label}). ${CDC_BMI_LMS_SOURCE}.`,
    };
  } catch {
    return {
      status: 'unavailable',
      percentile: null,
      note: 'Unable to compute CDC percentile for these inputs.',
    };
  }
}

/**
 * Sync display strings for the three target fields after a derivation.
 * Preserves the authoritative field’s raw string; fills the other two.
 */
export function syncTargetInputStrings(
  input: BmiWeightLossInput,
  derived: {
    targetBmi: number | null;
    targetPrime: number | null;
    targetWeightKg: number | null;
  },
): Pick<BmiWeightLossInput, 'targetBmi' | 'targetPrime' | 'targetWeight'> {
  const edit = input.lastTargetEdit;
  let targetBmi = input.targetBmi;
  let targetPrime = input.targetPrime;
  let targetWeight = input.targetWeight;

  if (derived.targetBmi != null && edit !== 'bmi') {
    targetBmi = formatBmi(derived.targetBmi);
  }
  if (derived.targetPrime != null && edit !== 'prime') {
    targetPrime = formatBmiPrime(derived.targetPrime);
  }
  if (derived.targetWeightKg != null && edit !== 'weight') {
    const display = kgToWeight(derived.targetWeightKg, input.targetWeightUnit);
    targetWeight = formatMass(display, 3).replace(/,/g, '');
  }

  return { targetBmi, targetPrime, targetWeight };
}

export function calculateBmiWeightLoss(
  input: BmiWeightLossInput,
): BmiWeightLossResult | null {
  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);
  if (heightVal == null || weightVal == null) return null;
  if (!(heightVal > 0) || !(weightVal > 0)) return null;

  const heightMeters = heightToMeters(heightVal, input.heightUnit);
  const weightKg = weightToKg(weightVal, input.weightUnit);
  if (!(heightMeters > 0) || !(weightKg > 0)) return null;
  if (heightMeters > 3.5 || weightKg > 500) return null;

  const bmi = calculateBmi(heightMeters, weightKg);
  const bmiPrime = calculateBmiPrime(bmi);
  const category = classifyWhoAdultBmi(bmi);

  const derived = deriveTargetFields(heightMeters, input);
  let targetSafety: TargetSafety | null = null;
  let targetSafetyNote: string | null = null;
  let weightChangeKg: number | null = null;
  let weightChangeKind: WeightChangeKind | null = null;
  let formattedWeightChange: string | null = null;

  if (derived.targetBmi != null) {
    const assessed = assessTargetSafety(derived.targetBmi);
    targetSafety = assessed.safety;
    targetSafetyNote = assessed.note;
  }

  if (derived.rejected) {
    targetSafety = 'severe_thinness_reject';
    targetSafetyNote = derived.rejectReason;
  } else if (derived.targetWeightKg != null) {
    const wc = resolveWeightChange(weightKg, derived.targetWeightKg);
    weightChangeKg = wc.changeKg;
    weightChangeKind = wc.kind;
    formattedWeightChange = wc.formatted;
  }

  const pct = resolvePercentile(bmi, input);

  return {
    heightMeters,
    weightKg,
    bmi,
    bmiPrime,
    formattedBmi: formatBmi(bmi),
    formattedBmiPrime: formatBmiPrime(bmiPrime),
    category,
    targetBmi: derived.targetBmi,
    targetPrime: derived.targetPrime,
    targetWeightKg: derived.rejected ? null : derived.targetWeightKg,
    formattedTargetBmi:
      derived.targetBmi != null ? formatBmi(derived.targetBmi) : null,
    formattedTargetPrime:
      derived.targetPrime != null ? formatBmiPrime(derived.targetPrime) : null,
    formattedTargetWeight:
      derived.targetWeightKg != null && !derived.rejected
        ? formatMass(
            kgToWeight(derived.targetWeightKg, input.targetWeightUnit),
            2,
          )
        : null,
    weightChangeKg,
    weightChangeKind,
    formattedWeightChange,
    targetSafety,
    targetSafetyNote,
    percentileStatus: pct.status,
    percentile: pct.percentile,
    formattedPercentile:
      pct.percentile != null ? formatPercentile(pct.percentile) : null,
    percentileNote: pct.note,
    classificationSource: CLASSIFICATION_SOURCE,
    disclaimer: DISCLAIMER,
  };
}
