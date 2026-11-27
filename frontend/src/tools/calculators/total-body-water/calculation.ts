/**
 * Total body water — Watson 1980 (educational, ADR-018).
 *
 * Male:   TBW_L = 2.447 − 0.09516·A + 0.1074·H + 0.3362·W
 * Female: TBW_L = −2.097 + 0.1069·H + 0.2466·W
 * A years, H cm, W kg. Female equation has no age term.
 *
 * Water mass ≈ volume with density 1 kg/L.
 * % body weight = 100 × TBW_kg / body_mass_kg.
 */

import type {
  HeightUnit,
  Sex,
  TotalBodyWaterInput,
  TotalBodyWaterResult,
  VolumeUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Watson et al. 1980 TBW: male 2.447−0.09516A+0.1074H+0.3362W; female −2.097+0.1069H+0.2466W (A years, H cm, W kg). Educational estimate.';

export const DISCLAIMER =
  'Educational anthropometric estimate only — not a dilution assay or clinical fluid-status diagnosis.';

/** Teaching approximation: 1 L body water ≈ 1 kg. */
export const WATER_KG_PER_L = 1;

const KG_PER_LB = 0.45359237;
const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_LB : value;
}

export function fromKg(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / KG_PER_LB : kg;
}

export function toCm(value: number, unit: HeightUnit): number {
  switch (unit) {
    case 'cm':
      return value;
    case 'm':
      return value * 100;
    case 'in':
      return value * CM_PER_INCH;
    case 'ft':
      return value * CM_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function fromCm(cm: number, unit: HeightUnit): number {
  switch (unit) {
    case 'cm':
      return cm;
    case 'm':
      return cm / 100;
    case 'in':
      return cm / CM_PER_INCH;
    case 'ft':
      return cm / CM_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function litersToVolume(liters: number, unit: VolumeUnit): number {
  return unit === 'mL' ? liters * 1000 : liters;
}

export function volumeToLiters(value: number, unit: VolumeUnit): number {
  return unit === 'mL' ? value / 1000 : value;
}

export function watsonTbwLiters(
  sex: Sex,
  ageYears: number,
  heightCm: number,
  weightKg: number,
): number {
  if (sex === 'male') {
    return 2.447 - 0.09516 * ageYears + 0.1074 * heightCm + 0.3362 * weightKg;
  }
  // Female — age intentionally unused (Watson 1980).
  return -2.097 + 0.1069 * heightCm + 0.2466 * weightKg;
}

export function formatFixed(value: number, digits: number): string {
  return (Math.round(value * 10 ** digits) / 10 ** digits).toFixed(digits);
}

function emptyResult(
  partial?: Partial<TotalBodyWaterResult>,
): TotalBodyWaterResult {
  return {
    tbwLiters: null,
    tbwKg: null,
    percentBodyWeight: null,
    formattedVolume: '',
    formattedMass: '',
    formattedPercent: '',
    statusHeadline: 'Enter age, height, and weight.',
    statusDetail: 'Watson TBW uses sex-specific anthropometric coefficients.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateTotalBodyWater(
  input: TotalBodyWaterInput,
): TotalBodyWaterResult {
  const age = parseNumber(input.ageText);
  const heightRaw = parseNumber(input.heightText);
  const weightRaw = parseNumber(input.weightText);

  if (age === null || heightRaw === null || weightRaw === null) {
    return emptyResult();
  }

  if (!(age > 0) || !(heightRaw > 0) || !(weightRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Age, height, and weight must be positive.',
      statusDetail: 'Nonpositive anthropometrics are rejected.',
    });
  }

  const heightCm = toCm(heightRaw, input.heightUnit);
  const weightKg = toKg(weightRaw, input.weightUnit);
  if (!(heightCm > 0) || !(weightKg > 0)) {
    return emptyResult({
      statusHeadline: 'Unit conversion is invalid.',
      statusDetail: 'Check height and weight units.',
    });
  }

  const tbwLiters = watsonTbwLiters(input.sex, age, heightCm, weightKg);
  if (!Number.isFinite(tbwLiters)) {
    return emptyResult({
      statusHeadline: 'Unable to estimate total body water.',
      statusDetail: 'Check that inputs are finite positive numbers.',
    });
  }

  const tbwKg = tbwLiters * WATER_KG_PER_L;
  const percent = (100 * tbwKg) / weightKg;
  if (!Number.isFinite(percent)) {
    return emptyResult({
      statusHeadline: 'Unable to compute body-water percentage.',
      statusDetail: 'Body weight must be positive.',
    });
  }

  const volDisplay = litersToVolume(tbwLiters, input.volumeUnit);
  const massDisplay = fromKg(tbwKg, input.massUnit);

  return {
    tbwLiters,
    tbwKg,
    percentBodyWeight: percent,
    formattedVolume: formatFixed(volDisplay, 2),
    formattedMass: formatFixed(massDisplay, 2),
    formattedPercent: formatFixed(percent, 1),
    statusHeadline: 'Total body water estimated.',
    statusDetail:
      input.sex === 'female'
        ? 'Female Watson equation (no age coefficient). Water mass uses 1 kg/L.'
        : 'Male Watson equation. Water mass uses 1 kg/L.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
