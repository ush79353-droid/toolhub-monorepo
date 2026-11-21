/**
 * Geriatric BMI — Quetelet BMI with older-adult interpretation bands.
 * BMI = kg / m².
 * Categories (screenshot table): <23 underweight; 23–29.9 normal; ≥30 overweight/obese.
 */

import {
  GERIATRIC_NORMAL_MAX,
  GERIATRIC_UNDERWEIGHT_MAX,
  type GeriatricBmiCategory,
  type GeriatricBmiInput,
  type GeriatricBmiResult,
  type HeightUnit,
  type WeightUnit,
} from './types';

export function heightToMeters(value: number, unit: HeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'm':
      return value;
    case 'cm':
      return value / 100;
    case 'in':
      return value * 0.0254;
    case 'ft':
      return value * 0.3048;
    default:
      return null;
  }
}

export function weightToKg(value: number, unit: WeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
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

export function convertHeight(
  value: number,
  from: HeightUnit,
  to: HeightUnit
): number | null {
  const m = heightToMeters(value, from);
  if (m == null) return null;
  switch (to) {
    case 'm':
      return m;
    case 'cm':
      return m * 100;
    case 'in':
      return m / 0.0254;
    case 'ft':
      return m / 0.3048;
    default:
      return null;
  }
}

export function convertWeight(
  value: number,
  from: WeightUnit,
  to: WeightUnit
): number | null {
  const kg = weightToKg(value, from);
  if (kg == null) return null;
  switch (to) {
    case 'kg':
      return kg;
    case 'lb':
      return kg / 0.45359237;
    case 'st':
      return kg / 6.35029318;
    default:
      return null;
  }
}

export function queteletBmi(weightKg: number, heightM: number): number | null {
  if (
    !Number.isFinite(weightKg) ||
    !Number.isFinite(heightM) ||
    weightKg <= 0 ||
    heightM <= 0
  ) {
    return null;
  }
  const bmi = weightKg / (heightM * heightM);
  return Number.isFinite(bmi) ? bmi : null;
}

export function classifyGeriatricBmi(bmi: number): GeriatricBmiCategory {
  if (bmi < GERIATRIC_UNDERWEIGHT_MAX) return 'underweight';
  if (bmi < GERIATRIC_NORMAL_MAX) return 'normal';
  return 'overweight_obese';
}

export function categoryLabel(category: GeriatricBmiCategory): string {
  switch (category) {
    case 'underweight':
      return 'Underweight';
    case 'normal':
      return 'Normal';
    case 'overweight_obese':
      return 'Overweight/obese';
    default:
      return '—';
  }
}

export function formatBmi(bmi: number): string {
  return bmi.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function calculateGeriatricBmi(
  input: GeriatricBmiInput
): GeriatricBmiResult | null {
  const age = Number(input.ageYears.trim().replace(/,/g, ''));
  const wRaw = Number(input.weightValue.trim().replace(/,/g, ''));
  const hRaw = Number(input.heightValue.trim().replace(/,/g, ''));
  if (![age, wRaw, hRaw].every(Number.isFinite)) return null;

  const heightM = heightToMeters(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);
  if (heightM == null || weightKg == null) return null;

  const bmi = queteletBmi(weightKg, heightM);
  if (bmi == null) return null;

  const category = classifyGeriatricBmi(bmi);
  return {
    ageYears: age,
    heightM,
    weightKg,
    bmi,
    formattedBmi: formatBmi(bmi),
    category,
    categoryLabel: categoryLabel(category),
    explanation: `BMI = ${formatBmi(bmi)} kg/m² → ${categoryLabel(category)} on older-adult bands (<23 / 23–29.9 / ≥30).`,
  };
}
