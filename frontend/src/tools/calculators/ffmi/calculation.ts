/**
 * Fat-Free Mass Index (FFMI) — educational (ADR-018).
 *
 *   FFM_kg = weight_kg × (1 − bodyFat%/100)
 *   fat_mass_kg = weight_kg × bodyFat%/100
 *   FFMI = FFM_kg / height_m²
 *   normalized FFMI = FFMI + 6.1 × (1.8 − height_m)
 *
 * Prompt fixture: 80 kg, 25% fat, height 2 m → FFM 60 kg, FFMI 15.
 * Sex is collected for UI parity / educational framing; index math is sex-independent.
 */

import type {
  FfmiInput,
  FfmiResult,
  HeightUnit,
  MassUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'FFMI = fat-free mass (kg) ÷ height (m)². Normalized FFMI = FFMI + 6.1×(1.8 − height_m). Educational estimate — not a clinical diagnosis.';

export const DISCLAIMER =
  'Requires a reliable body-fat estimate. Not a medical or doping assessment — interpret with training context.';

export const LB_PER_KG = 2.2046226218;
export const CM_PER_IN = 2.54;
export const NORMALIZE_REF_HEIGHT_M = 1.8;
export const NORMALIZE_COEF = 6.1;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatMeasure(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

export function heightToMeters(value: number, unit: HeightUnit): number {
  if (unit === 'm') return value;
  if (unit === 'cm') return value / 100;
  if (unit === 'in') return (value * CM_PER_IN) / 100;
  return (value * 12 * CM_PER_IN) / 100; // ft
}

export function metersToHeight(meters: number, unit: HeightUnit): number {
  if (unit === 'm') return meters;
  if (unit === 'cm') return meters * 100;
  if (unit === 'in') return (meters * 100) / CM_PER_IN;
  return (meters * 100) / (12 * CM_PER_IN);
}

export function weightToKg(value: number, unit: WeightUnit): number {
  if (unit === 'kg') return value;
  if (unit === 'lb') return value / LB_PER_KG;
  return (value * 14) / LB_PER_KG; // stone
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  if (unit === 'kg') return kg;
  if (unit === 'lb') return kg * LB_PER_KG;
  return (kg * LB_PER_KG) / 14;
}

export function kgToMass(kg: number, unit: MassUnit): number {
  return unit === 'kg' ? kg : kg * LB_PER_KG;
}

export function massToKg(value: number, unit: MassUnit): number {
  return unit === 'kg' ? value : value / LB_PER_KG;
}

export function fatFreeMassKg(weightKg: number, bodyFatPct: number): number {
  return weightKg * (1 - bodyFatPct / 100);
}

export function fatMassKg(weightKg: number, bodyFatPct: number): number {
  return weightKg * (bodyFatPct / 100);
}

export function ffmiFrom(ffmKg: number, heightM: number): number {
  return ffmKg / (heightM * heightM);
}

export function normalizedFfmi(ffmi: number, heightM: number): number {
  return ffmi + NORMALIZE_COEF * (NORMALIZE_REF_HEIGHT_M - heightM);
}

export function formatIndex(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2).replace(/\.?0+$/, '') || '0';
}

function emptyResult(partial?: Partial<FfmiResult>): FfmiResult {
  return {
    ffmi: null,
    normalizedFfmi: null,
    fatFreeMassKg: null,
    fatMassKg: null,
    formattedFfmi: '',
    formattedNormalizedFfmi: '',
    formattedFfm: '',
    formattedFatMass: '',
    statusHeadline: 'Enter height, weight, and body fat %.',
    statusDetail:
      'FFMI uses fat-free mass over height squared; normalized FFMI adjusts to a 1.8 m reference height.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateFfmi(input: FfmiInput): FfmiResult {
  const heightRaw = parseNumber(input.heightText);
  const weightRaw = parseNumber(input.weightText);
  const fatRaw = parseNumber(input.bodyFatText);

  if (heightRaw === null || weightRaw === null || fatRaw === null) {
    return emptyResult();
  }

  if (!(heightRaw > 0) || !(weightRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Height and weight must be positive.',
      statusDetail: 'Nonpositive stature or mass is rejected.',
    });
  }

  if (!(fatRaw >= 0) || !(fatRaw < 100)) {
    return emptyResult({
      statusHeadline: 'Body fat % must be ≥ 0 and < 100.',
      statusDetail: '100% body fat would leave zero fat-free mass.',
    });
  }

  const heightM = heightToMeters(heightRaw, input.heightUnit);
  const weightKg = weightToKg(weightRaw, input.weightUnit);
  if (!(heightM > 0) || !(weightKg > 0)) {
    return emptyResult({
      statusHeadline: 'Unit conversion produced a nonpositive value.',
      statusDetail: 'Check the selected height and weight units.',
    });
  }

  const ffm = fatFreeMassKg(weightKg, fatRaw);
  const fat = fatMassKg(weightKg, fatRaw);
  const ffmi = ffmiFrom(ffm, heightM);
  const norm = normalizedFfmi(ffmi, heightM);

  if (![ffm, fat, ffmi, norm].every(Number.isFinite)) {
    return emptyResult({
      statusHeadline: 'Unable to compute FFMI.',
      statusDetail: 'Check that inputs are finite numbers.',
    });
  }

  const ffmDisplay = kgToMass(ffm, input.ffmUnit);
  const fatDisplay = kgToMass(fat, input.fatMassUnit);

  return {
    ffmi,
    normalizedFfmi: norm,
    fatFreeMassKg: ffm,
    fatMassKg: fat,
    formattedFfmi: formatIndex(ffmi),
    formattedNormalizedFfmi: formatIndex(norm),
    formattedFfm: formatMeasure(ffmDisplay, 2),
    formattedFatMass: formatMeasure(fatDisplay, 2),
    statusHeadline: 'FFMI computed.',
    statusDetail: `Sex (${input.sex}) is for framing only; index math uses FFM and height. Normalized to ${NORMALIZE_REF_HEIGHT_M} m.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
