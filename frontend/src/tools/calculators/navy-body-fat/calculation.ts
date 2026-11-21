/**
 * Navy Body Fat Calculator — pure engine (ADR-018).
 *
 * Model: Hodgdon & Beckett / NHRC U.S. Navy circumference equations (metric cm).
 * Reuses the same formulas as Body Fat Calculator’s Navy method.
 *
 * Male:   %BF = 495/(1.0324 − 0.19077·log10(waist−neck) + 0.15456·log10(height)) − 450
 * Female: %BF = 495/(1.29579 − 0.35004·log10(waist+hip−neck) + 0.22100·log10(height)) − 450
 *
 * Educational estimate only — not current Navy BCA official scoring or a medical diagnosis.
 * Age is collected for UI parity / optional range notes; it is not an equation input.
 */

import {
  navyFemalePercent,
  navyMalePercent,
} from '../body-fat/calculation';
import type {
  LengthUnit,
  NavyBodyFatInput,
  NavyBodyFatResult,
  NavySex,
} from './types';

export const CM_PER_INCH = 2.54;

export const MODEL_SOURCE =
  'Hodgdon & Beckett / Naval Health Research Center U.S. Navy circumference equations (metric). Educational estimate — distinct from current Navy Body Composition Assessment official protocol paperwork.';

export const DISCLAIMER =
  'Educational circumference estimate only. Not an official Navy BCA score, medical diagnosis, or fitness-for-duty determination. Tape technique and current Navy policy may differ.';

export const AGE_MIN = 17;
export const AGE_MAX = 120;

export function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function toCm(value: number, unit: LengthUnit): number {
  return unit === 'cm' ? value : value * CM_PER_INCH;
}

export function fromCm(cm: number, unit: LengthUnit): number {
  return unit === 'cm' ? cm : cm / CM_PER_INCH;
}

export function formatBodyFatPercent(pct: number): string {
  if (!Number.isFinite(pct)) return '—';
  return pct.toFixed(1);
}

export function calculateNavyBodyFat(
  input: NavyBodyFatInput,
): NavyBodyFatResult | null {
  const heightVal = parseNumber(input.height);
  const neckVal = parseNumber(input.neck);
  const waistVal = parseNumber(input.waist);
  if (heightVal == null || neckVal == null || waistVal == null) return null;
  if (!(heightVal > 0) || !(neckVal > 0) || !(waistVal > 0)) return null;

  const heightCm = toCm(heightVal, input.heightUnit);
  const neckCm = toCm(neckVal, input.neckUnit);
  const waistCm = toCm(waistVal, input.waistUnit);
  if (!(heightCm > 0) || heightCm > 275) return null;

  let hipCm: number | null = null;
  let pct: number | null = null;
  const sex: NavySex = input.sex;

  if (sex === 'male') {
    pct = navyMalePercent(heightCm, waistCm, neckCm);
  } else {
    const hipVal = parseNumber(input.hip);
    if (hipVal == null || !(hipVal > 0)) return null;
    hipCm = toCm(hipVal, input.hipUnit);
    pct = navyFemalePercent(heightCm, waistCm, hipCm, neckCm);
  }

  if (pct == null || !Number.isFinite(pct)) return null;

  let ageYears: number | null = null;
  if (input.age.trim() !== '') {
    ageYears = parseNumber(input.age);
  }

  return {
    sex,
    ageYears,
    heightCm,
    neckCm,
    waistCm,
    hipCm,
    bodyFatPercent: pct,
    formattedBodyFatPercent: formatBodyFatPercent(pct),
    modelSource: MODEL_SOURCE,
    disclaimer: DISCLAIMER,
  };
}
