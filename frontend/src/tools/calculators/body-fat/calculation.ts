/**
 * Body Fat Calculator — pure engine (ADR-018).
 *
 * Methods (screenshot labels):
 * 1) American Diabetes Association (most common) — CUN-BAE adiposity estimator
 *    published in Diabetes Care 2012;35(2):383–388 (Gómez-Ambrosi et al.):
 *    BF% = −44.988 + 0.503·age + 10.689·sex + 3.172·BMI − 0.026·BMI²
 *          + 0.181·BMI·sex − 0.02·BMI·age − 0.005·BMI²·sex + 0.00021·BMI²·age
 *    sex: male = 0, female = 1. Validated adults ~18–80 y.
 *
 * 2) U.S. Navy (most precise) — Hodgdon & Beckett / NHRC circumference equations
 *    (metric cm, log10):
 *    Male:   %BF = 495/(1.0324 − 0.19077·log10(waist−neck) + 0.15456·log10(height)) − 450
 *    Female: %BF = 495/(1.29579 − 0.35004·log10(waist+hip−neck) + 0.22100·log10(height)) − 450
 *
 * 3) BMI (least precise) — Deurenberg et al. adult equations:
 *    Male:   BF% = 1.20·BMI + 0.23·age − 16.2
 *    Female: BF% = 1.20·BMI + 0.23·age − 5.4
 *
 * Fat mass = weight × (BF%/100); lean mass = weight − fat mass; BMI = kg/m².
 */

import type {
  BodyFatInput,
  BodyFatMethod,
  BodyFatResult,
  LengthUnit,
  MassUnit,
  Sex,
} from './types';

export const CM_PER_INCH = 2.54;
export const LB_PER_KG = 2.2046226218;

const DISCLAIMER =
  'Informational body-fat estimate only — not a medical diagnosis, DXA/Bod Pod substitute, or fitness clearance. Equations have population limits and typical errors of several percentage points.';

export function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function toCm(value: number, unit: LengthUnit): number {
  if (!Number.isFinite(value)) return NaN;
  return unit === 'cm' ? value : value * CM_PER_INCH;
}

export function toKg(value: number, unit: MassUnit): number {
  if (!Number.isFinite(value)) return NaN;
  return unit === 'kg' ? value : value / LB_PER_KG;
}

export function computeBmi(weightKg: number, heightCm: number): number {
  if (!(weightKg > 0) || !(heightCm > 0)) return NaN;
  const m = heightCm / 100;
  return weightKg / (m * m);
}

/** CUN-BAE (Diabetes Care / ADA journal). sexCode: male=0, female=1. */
export function adaCunBaePercent(
  bmi: number,
  ageYears: number,
  sex: Sex,
): number {
  const sexCode = sex === 'female' ? 1 : 0;
  const bmi2 = bmi * bmi;
  return (
    -44.988 +
    0.503 * ageYears +
    10.689 * sexCode +
    3.172 * bmi -
    0.026 * bmi2 +
    0.181 * bmi * sexCode -
    0.02 * bmi * ageYears -
    0.005 * bmi2 * sexCode +
    0.00021 * bmi2 * ageYears
  );
}

/** Deurenberg adult BMI method. */
export function deurenbergBmiPercent(
  bmi: number,
  ageYears: number,
  sex: Sex,
): number {
  return sex === 'male'
    ? 1.2 * bmi + 0.23 * ageYears - 16.2
    : 1.2 * bmi + 0.23 * ageYears - 5.4;
}

/** U.S. Navy metric (cm) male. */
export function navyMalePercent(
  heightCm: number,
  waistCm: number,
  neckCm: number,
): number | null {
  const circ = waistCm - neckCm;
  if (!(circ > 0) || !(heightCm > 0)) return null;
  const denom =
    1.0324 -
    0.19077 * Math.log10(circ) +
    0.15456 * Math.log10(heightCm);
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const pct = 495 / denom - 450;
  return Number.isFinite(pct) ? pct : null;
}

/** U.S. Navy metric (cm) female. */
export function navyFemalePercent(
  heightCm: number,
  waistCm: number,
  hipCm: number,
  neckCm: number,
): number | null {
  const circ = waistCm + hipCm - neckCm;
  if (!(circ > 0) || !(heightCm > 0)) return null;
  const denom =
    1.29579 -
    0.35004 * Math.log10(circ) +
    0.221 * Math.log10(heightCm);
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const pct = 495 / denom - 450;
  return Number.isFinite(pct) ? pct : null;
}

export function methodLabel(method: BodyFatMethod): string {
  switch (method) {
    case 'ada':
      return 'American Diabetes Association (CUN-BAE)';
    case 'navy':
      return 'U.S. Navy circumference';
    case 'bmi':
      return 'BMI (Deurenberg)';
  }
}

export function methodSourceNote(method: BodyFatMethod): string {
  switch (method) {
    case 'ada':
      return 'CUN-BAE equation (Diabetes Care 2012;35:383–388); adults ≈18–80 y.';
    case 'navy':
      return 'Hodgdon & Beckett / NHRC U.S. Navy circumference equations (metric).';
    case 'bmi':
      return 'Deurenberg et al. adult BMI-based estimate (least precise).';
  }
}

function formatPercent(value: number): string {
  return value.toFixed(1);
}

function formatMass(value: number): string {
  return value.toFixed(2);
}

function formatBmi(value: number): string {
  return value.toFixed(2);
}

export interface NormalizedBodyFatMeasures {
  ageYears: number;
  heightCm: number;
  weightKg: number;
  neckCm: number | null;
  waistCm: number | null;
  hipCm: number | null;
  bmi: number;
}

export function normalizeMeasures(
  input: BodyFatInput,
): NormalizedBodyFatMeasures | null {
  const ageYears = parseLoose(input.age);
  const heightRaw = parseLoose(input.height);
  const weightRaw = parseLoose(input.weight);
  if (ageYears === null || heightRaw === null || weightRaw === null) return null;

  const heightCm = toCm(heightRaw, input.heightUnit);
  const weightKg = toKg(weightRaw, input.weightUnit);
  const bmi = computeBmi(weightKg, heightCm);
  if (!Number.isFinite(bmi)) return null;

  let neckCm: number | null = null;
  let waistCm: number | null = null;
  let hipCm: number | null = null;

  if (input.method === 'navy') {
    const neckRaw = parseLoose(input.neck);
    const waistRaw = parseLoose(input.waist);
    if (neckRaw === null || waistRaw === null) return null;
    neckCm = toCm(neckRaw, input.circumferenceUnit);
    waistCm = toCm(waistRaw, input.circumferenceUnit);
    if (input.sex === 'female') {
      const hipRaw = parseLoose(input.hip);
      if (hipRaw === null) return null;
      hipCm = toCm(hipRaw, input.circumferenceUnit);
    }
  }

  return { ageYears, heightCm, weightKg, neckCm, waistCm, hipCm, bmi };
}

export function computeBodyFatPercent(
  method: BodyFatMethod,
  sex: Sex,
  measures: NormalizedBodyFatMeasures,
): number | null {
  const { ageYears, heightCm, bmi, neckCm, waistCm, hipCm } = measures;

  if (method === 'ada' || method === 'bmi') {
    if (!(ageYears >= 18 && ageYears <= 120)) return null;
    if (!(bmi > 0 && bmi < 200)) return null;
    const raw =
      method === 'ada'
        ? adaCunBaePercent(bmi, ageYears, sex)
        : deurenbergBmiPercent(bmi, ageYears, sex);
    return Number.isFinite(raw) ? raw : null;
  }

  // Navy: typical adult service ages; still allow broader educational range.
  if (!(ageYears >= 17 && ageYears <= 120)) return null;
  if (neckCm === null || waistCm === null) return null;
  if (sex === 'male') {
    return navyMalePercent(heightCm, waistCm, neckCm);
  }
  if (hipCm === null) return null;
  return navyFemalePercent(heightCm, waistCm, hipCm, neckCm);
}

export function computeBodyFat(input: BodyFatInput): BodyFatResult | null {
  const measures = normalizeMeasures(input);
  if (!measures) return null;

  const raw = computeBodyFatPercent(input.method, input.sex, measures);
  if (raw === null || !Number.isFinite(raw)) return null;
  // Reject non-physical extremes rather than showing Infinity/NaN UI.
  if (raw < 0 || raw > 75) return null;

  const bodyFatPercent = raw;
  const fatMassKg = measures.weightKg * (bodyFatPercent / 100);
  const leanMassKg = measures.weightKg - fatMassKg;
  if (!Number.isFinite(fatMassKg) || !Number.isFinite(leanMassKg)) return null;

  return {
    method: input.method,
    sex: input.sex,
    ageYears: measures.ageYears,
    bodyFatPercent,
    formattedBodyFatPercent: formatPercent(bodyFatPercent),
    fatMassKg,
    formattedFatMassKg: formatMass(fatMassKg),
    leanMassKg,
    formattedLeanMassKg: formatMass(leanMassKg),
    bmi: measures.bmi,
    formattedBmi: formatBmi(measures.bmi),
    weightKg: measures.weightKg,
    heightCm: measures.heightCm,
    methodLabel: methodLabel(input.method),
    sourceNote: methodSourceNote(input.method),
    disclaimer: DISCLAIMER,
  };
}
