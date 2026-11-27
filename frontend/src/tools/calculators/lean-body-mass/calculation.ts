/**
 * Lean Body Mass (Boer) — educational (ADR-018).
 *
 * Male:   LBM_kg = 0.407·W + 0.267·H − 19.2
 * Female: LBM_kg = 0.252·W + 0.473·H − 48.3
 * W in kg, H in cm (Boer 1984; Omni lean-body-mass).
 */

import type {
  HeightUnit,
  LbmInput,
  LbmResult,
  Sex,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Boer lean body mass: male 0.407·W + 0.267·H − 19.2; female 0.252·W + 0.473·H − 48.3 (W kg, H cm). Educational estimate — not DXA.';

export const DISCLAIMER =
  'Lean body mass estimates depend on the equation chosen. This tool uses the Boer formulas only.';

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

/** Boer LBM in kg. */
export function boerLeanKg(sex: Sex, weightKg: number, heightCm: number): number {
  if (!(weightKg > 0) || !(heightCm > 0)) {
    throw new RangeError('Weight and height must be positive.');
  }
  if (sex === 'male') {
    return 0.407 * weightKg + 0.267 * heightCm - 19.2;
  }
  return 0.252 * weightKg + 0.473 * heightCm - 48.3;
}

export function formatLean(value: number): string {
  return String(Number(value.toFixed(3)));
}

function emptyResult(partial?: Partial<LbmResult>): LbmResult {
  return {
    weightKg: null,
    heightCm: null,
    leanKg: null,
    formattedLean: '',
    statusHeadline: 'Enter weight and height.',
    statusDetail: 'Boer lean body mass updates when both values are positive.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateLeanBodyMass(input: LbmInput): LbmResult {
  const wRaw = parseNumber(input.weightText);
  const hRaw = parseNumber(input.heightText);
  if (wRaw === null || hRaw === null) {
    return emptyResult();
  }
  if (!(wRaw > 0) || !(hRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Weight and height must be greater than zero.',
      statusDetail: 'Lean body mass is undefined for zero or negative inputs.',
    });
  }

  const weightKg = toKg(wRaw, input.weightUnit);
  const heightCm = toCm(hRaw, input.heightUnit);

  try {
    const leanKg = boerLeanKg(input.sex, weightKg, heightCm);
    if (!Number.isFinite(leanKg)) {
      return emptyResult({
        statusHeadline: 'Unable to compute lean body mass.',
        statusDetail: 'Result was non-finite.',
      });
    }
    const display = fromKg(leanKg, input.resultUnit);
    return {
      weightKg,
      heightCm,
      leanKg,
      formattedLean: formatLean(display),
      statusHeadline: 'Lean body mass computed.',
      statusDetail: 'Boer equation for the selected sex.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  } catch {
    return emptyResult({
      statusHeadline: 'Unable to compute lean body mass.',
      statusDetail: 'Check that weight and height are positive finite numbers.',
    });
  }
}

/** Screenshot / Omni male example. */
export const EXAMPLE_MALE: LbmInput = {
  sex: 'male',
  weightText: '75',
  weightUnit: 'kg',
  heightText: '180',
  heightUnit: 'cm',
  resultUnit: 'kg',
};

/** Common female demo (Omni-style). */
export const EXAMPLE_FEMALE: LbmInput = {
  sex: 'female',
  weightText: '65',
  weightUnit: 'kg',
  heightText: '165',
  heightUnit: 'cm',
  resultUnit: 'kg',
};
