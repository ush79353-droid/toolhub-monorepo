/**
 * 6 Minute Walk Test — Enright–Sherrill (1998) predicted 6MWD (ADR-018).
 *
 * Male:   7.57×H − 5.02×A − 1.76×W − 309
 * Female: 2.11×H − 2.29×W − 5.78×A + 667
 * (H cm, A years, W kg → metres)
 *
 * Percent of expected = 100 × observed / predicted.
 *
 * Population: healthy adults 40–80 years (Am J Respir Crit Care Med
 * 1998;158:1384–1387). Out-of-domain ages and non-positive predictions
 * are suppressed (no invented extrapolation).
 *
 * Educational reference estimate only — not a clinical interpretation.
 */

import type {
  DistanceUnit,
  HeightUnit,
  Sex,
  SixMinuteWalkTestInput,
  SixMinuteWalkTestResult,
  WeightUnit,
} from './types';

export const SOURCE_LABEL =
  'Enright PL, Sherrill DL. Reference equations for the six-minute walk in healthy adults. Am J Respir Crit Care Med. 1998;158(5):1384–1387 (healthy adults 40–80 y).';

export const DISCLAIMER =
  'Educational Enright–Sherrill reference estimate only. It does not diagnose disease, grade functional capacity, or replace a supervised 6-minute walk test interpreted by a clinician.';

/** Inclusive derivation age band from Enright & Sherrill 1998. */
export const MIN_AGE_YEARS = 40;
export const MAX_AGE_YEARS = 80;

export const M_PER_FT = 0.3048;
export const M_PER_YD = 0.9144;
export const M_PER_KM = 1000;
export const CM_PER_IN = 2.54;
export const CM_PER_FT = 30.48;
export const KG_PER_LB = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: HeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'cm':
      return value;
    case 'm':
      return value * 100;
    case 'in':
      return value * CM_PER_IN;
    case 'ft':
      return value * CM_PER_FT;
    default:
      return null;
  }
}

export function cmToHeight(cm: number, unit: HeightUnit): number {
  switch (unit) {
    case 'cm':
      return cm;
    case 'm':
      return cm / 100;
    case 'in':
      return cm / CM_PER_IN;
    case 'ft':
      return cm / CM_PER_FT;
  }
}

export function weightToKg(value: number, unit: WeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'lb' ? value * KG_PER_LB : value;
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / KG_PER_LB : kg;
}

export function distanceToMeters(
  value: number,
  unit: DistanceUnit,
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  switch (unit) {
    case 'm':
      return value;
    case 'ft':
      return value * M_PER_FT;
    case 'yd':
      return value * M_PER_YD;
    case 'km':
      return value * M_PER_KM;
    default:
      return null;
  }
}

export function metersToDistance(meters: number, unit: DistanceUnit): number {
  switch (unit) {
    case 'm':
      return meters;
    case 'ft':
      return meters / M_PER_FT;
    case 'yd':
      return meters / M_PER_YD;
    case 'km':
      return meters / M_PER_KM;
  }
}

export function formatDistanceDisplay(
  meters: number,
  unit: DistanceUnit,
): string {
  const v = metersToDistance(meters, unit);
  const digits = unit === 'km' ? 4 : 1;
  return Number(v.toFixed(digits)).toString();
}

/**
 * Enright–Sherrill predicted 6MWD (metres). Returns null when inputs are
 * outside the supported domain or the equation yields a non-positive value.
 */
export function predictSixMinuteWalkMeters(args: {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
}): { meters: number | null; domainOk: boolean; domainMessage: string | null } {
  const { sex, ageYears, heightCm, weightKg } = args;

  if (
    !Number.isFinite(ageYears) ||
    !Number.isFinite(heightCm) ||
    !Number.isFinite(weightKg)
  ) {
    return {
      meters: null,
      domainOk: false,
      domainMessage: 'Enter valid age, height, and weight.',
    };
  }

  if (ageYears < MIN_AGE_YEARS || ageYears > MAX_AGE_YEARS) {
    return {
      meters: null,
      domainOk: false,
      domainMessage: `Enright–Sherrill equations apply to ages ${MIN_AGE_YEARS}–${MAX_AGE_YEARS} years. Prediction suppressed outside that band.`,
    };
  }

  if (!(heightCm > 0) || !(weightKg > 0)) {
    return {
      meters: null,
      domainOk: false,
      domainMessage: 'Height and weight must be positive.',
    };
  }

  const meters =
    sex === 'male'
      ? 7.57 * heightCm - 5.02 * ageYears - 1.76 * weightKg - 309
      : 2.11 * heightCm - 2.29 * weightKg - 5.78 * ageYears + 667;

  if (!Number.isFinite(meters) || meters <= 0) {
    return {
      meters: null,
      domainOk: false,
      domainMessage:
        'Predicted distance is non-positive for these inputs and was suppressed.',
    };
  }

  return { meters, domainOk: true, domainMessage: null };
}

export function percentOfExpected(
  observedMeters: number,
  predictedMeters: number,
): number | null {
  if (
    !Number.isFinite(observedMeters) ||
    !Number.isFinite(predictedMeters) ||
    predictedMeters <= 0 ||
    observedMeters < 0
  ) {
    return null;
  }
  return (100 * observedMeters) / predictedMeters;
}

export function calculateSixMinuteWalkTest(
  input: SixMinuteWalkTestInput,
  ageYears: number,
  heightCm: number,
  weightKg: number,
  observedMeters: number | null,
): SixMinuteWalkTestResult {
  const predicted = predictSixMinuteWalkMeters({
    sex: input.sex,
    ageYears,
    heightCm,
    weightKg,
  });

  const predictedDisplay =
    predicted.meters != null
      ? formatDistanceDisplay(predicted.meters, input.predictedUnit)
      : '';

  let percent: number | null = null;
  if (predicted.meters != null && observedMeters != null) {
    percent = percentOfExpected(observedMeters, predicted.meters);
  }

  const percentDisplay =
    percent != null ? Number(percent.toFixed(1)).toString() : '';

  const explanation =
    predicted.meters != null
      ? input.sex === 'male'
        ? `Male Enright–Sherrill predicted 6MWD = 7.57×${Number(heightCm.toFixed(2))} − 5.02×${ageYears} − 1.76×${Number(weightKg.toFixed(2))} − 309 ≈ ${Number(predicted.meters.toFixed(1))} m.`
        : `Female Enright–Sherrill predicted 6MWD = 2.11×${Number(heightCm.toFixed(2))} − 2.29×${Number(weightKg.toFixed(2))} − 5.78×${ageYears} + 667 ≈ ${Number(predicted.meters.toFixed(1))} m.`
      : predicted.domainMessage ??
        'Prediction unavailable for the current inputs.';

  return {
    predictedMeters: predicted.meters,
    predictedDisplay,
    predictedUnit: input.predictedUnit,
    observedMeters,
    percentOfExpected: percent,
    percentDisplay,
    domainOk: predicted.domainOk,
    domainMessage: predicted.domainMessage,
    explanation,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
