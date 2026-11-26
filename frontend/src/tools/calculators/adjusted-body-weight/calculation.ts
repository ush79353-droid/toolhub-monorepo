/**
 * Adjusted body weight (AjBW) — educational (ADR-018).
 *
 * Robinson IBW (kg), inches over 5 ft (60 in):
 *   male:   52 + 1.9 × (height_in − 60)
 *   female: 49 + 1.7 × (height_in − 60)
 *
 * Nutritional adjusted weight (factor 0.4):
 *   when actual > IBW: AjBW = IBW + 0.4 × (actual − IBW)
 *   when actual ≤ IBW: AjBW = actual (adjustment does not apply)
 *
 * Fixture (prompt): female 65 in · 80 kg → IBW 57.5 · AjBW 66.5.
 */

import type {
  AdjustedBodyWeightInput,
  AdjustedBodyWeightResult,
  HeightUnit,
  Sex,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Robinson IBW (kg): ♂ 52+1.9×(in−60), ♀ 49+1.7×(in−60). When actual > IBW, AjBW = IBW + 0.4×(actual−IBW); otherwise AjBW = actual. Educational nutrition worksheet only.';

export const DISCLAIMER =
  'Not a dosing order, diagnosis, or individualized nutrition prescription — confirm with a clinician or registered dietitian.';

export const ADJUSTMENT_FACTOR = 0.4;
export const FIVE_FEET_INCHES = 60;
export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const KG_PER_POUND = 0.45359237;
export const KG_PER_STONE = KG_PER_POUND * 14;

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
      return meters * 100;
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

export function metersToInches(meters: number): number {
  return meters / METERS_PER_INCH;
}

/** Robinson ideal body weight in kilograms. */
export function robinsonIbwKg(heightInches: number, sex: Sex): number {
  const excess = heightInches - FIVE_FEET_INCHES;
  if (sex === 'male') return 52 + 1.9 * excess;
  return 49 + 1.7 * excess;
}

/**
 * Nutritional adjusted body weight.
 * Applies 0.4 factor only when actual weight exceeds IBW.
 */
export function adjustedBodyWeightKg(
  ibwKg: number,
  actualKg: number,
): { adjKg: number; adjustmentApplied: boolean } {
  if (!(actualKg > ibwKg)) {
    return { adjKg: actualKg, adjustmentApplied: false };
  }
  return {
    adjKg: ibwKg + ADJUSTMENT_FACTOR * (actualKg - ibwKg),
    adjustmentApplied: true,
  };
}

export function formatWeightDisplay(kg: number, unit: WeightUnit): string {
  const v = kgToWeight(kg, unit);
  const rounded = Math.round(v * 10) / 10;
  return `${rounded.toFixed(1)} ${unit}`;
}

function emptyResult(
  partial?: Partial<AdjustedBodyWeightResult>,
): AdjustedBodyWeightResult {
  return {
    heightInches: null,
    actualWeightKg: null,
    ibwKg: null,
    adjBwKg: null,
    formattedIbw: '',
    formattedAdjBw: '',
    adjustmentApplied: false,
    statusHeadline: 'Enter sex, height, and actual body weight.',
    statusDetail:
      'Robinson IBW and adjusted body weight (0.4 factor when actual > IBW) appear when inputs are valid.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateAdjustedBodyWeight(
  input: AdjustedBodyWeightInput,
): AdjustedBodyWeightResult {
  const heightRaw = parseNumber(input.heightText);
  const weightRaw = parseNumber(input.weightText);

  if (
    heightRaw === null ||
    weightRaw === null ||
    !(heightRaw > 0) ||
    !(weightRaw > 0)
  ) {
    return emptyResult();
  }

  const meters = heightToMeters(heightRaw, input.heightUnit);
  const actualKg = weightToKg(weightRaw, input.weightUnit);
  if (!(meters > 0) || !Number.isFinite(meters) || !Number.isFinite(actualKg)) {
    return emptyResult({
      statusHeadline: 'Unable to interpret height or weight.',
      statusDetail: 'Enter positive finite values.',
    });
  }

  const heightInches = metersToInches(meters);
  const ibwKg = robinsonIbwKg(heightInches, input.sex);
  if (!Number.isFinite(ibwKg)) {
    return emptyResult({
      statusHeadline: 'Unable to compute ideal body weight.',
      statusDetail: 'Check height units and magnitude.',
    });
  }

  const { adjKg, adjustmentApplied } = adjustedBodyWeightKg(ibwKg, actualKg);

  return {
    heightInches,
    actualWeightKg: actualKg,
    ibwKg,
    adjBwKg: adjKg,
    formattedIbw: formatWeightDisplay(ibwKg, input.resultWeightUnit),
    formattedAdjBw: formatWeightDisplay(adjKg, input.resultWeightUnit),
    adjustmentApplied,
    statusHeadline: adjustmentApplied
      ? 'Ideal and adjusted body weight computed.'
      : 'Ideal body weight computed; adjustment not applied.',
    statusDetail: adjustmentApplied
      ? `AjBW = IBW + ${ADJUSTMENT_FACTOR}×(actual − IBW) because actual weight exceeds Robinson IBW.`
      : 'Actual weight is at or below Robinson IBW, so AjBW equals actual body weight.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
