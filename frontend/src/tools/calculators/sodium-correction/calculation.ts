/**
 * Corrected serum sodium for hyperglycemia — educational (ADR-018).
 *
 * Hillier (1999, primary): Na_corr = Na + 0.024 × (glucose_mg/dL − 100)
 * Katz (1973, older):     Na_corr = Na + 0.016 × (glucose_mg/dL − 100)
 *
 * Glucose must be in mg/dL for these coefficients. mmol/L → mg/dL uses
 * 18.0182 (clinical glucose MW/10). Sodium is mEq/L (= mmol/L for Na+).
 *
 * Estimation only — not a treatment target or fluid-order calculator.
 */

import type {
  GlucoseUnit,
  SodiumCorrectionInput,
  SodiumCorrectionResult,
} from './types';

export const SOURCE_NOTE =
  'Hillier 1999: corrected Na (mEq/L) = measured Na + 0.024 × (glucose mg/dL − 100). Katz 1973 older factor 0.016. Glucose mmol/L ×18.0182 → mg/dL. Educational estimate — not a treatment target.';

export const DISCLAIMER =
  'Not a lab report, diagnosis, or treatment plan — confirm with your clinician; recheck sodium as glucose is corrected.';

/** Clinical teaching factor: mmol/L glucose ↔ mg/dL. */
export const GLUCOSE_MG_DL_PER_MMOL_L = 18.0182;

/** Hillier overall average (mEq/L Na per mg/dL glucose above 100). */
export const HILLIER_FACTOR = 0.024;

/** Katz classic factor (mEq/L Na per mg/dL glucose above 100). */
export const KATZ_FACTOR = 0.016;

/** Reference glucose for both formulas (mg/dL). */
export const GLUCOSE_REFERENCE_MG_DL = 100;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function glucoseToMgDl(value: number, unit: GlucoseUnit): number {
  return unit === 'mmol_l' ? value * GLUCOSE_MG_DL_PER_MMOL_L : value;
}

export function glucoseFromMgDl(mgDl: number, unit: GlucoseUnit): number {
  return unit === 'mmol_l' ? mgDl / GLUCOSE_MG_DL_PER_MMOL_L : mgDl;
}

export function correctedSodiumHillier(
  sodiumMeqL: number,
  glucoseMgDl: number,
): number {
  return (
    sodiumMeqL + HILLIER_FACTOR * (glucoseMgDl - GLUCOSE_REFERENCE_MG_DL)
  );
}

export function correctedSodiumKatz(
  sodiumMeqL: number,
  glucoseMgDl: number,
): number {
  return sodiumMeqL + KATZ_FACTOR * (glucoseMgDl - GLUCOSE_REFERENCE_MG_DL);
}

export function formatSodium(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatGlucose(value: number | null, unit: GlucoseUnit): string {
  if (value == null || !Number.isFinite(value)) return '';
  const digits = unit === 'mmol_l' ? 2 : 1;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function calculateSodiumCorrection(
  input: SodiumCorrectionInput,
): SodiumCorrectionResult {
  const empty = {
    sodiumMeqL: null,
    glucoseMgDl: null,
    correctedHillier: null,
    correctedKatz: null,
    formattedHillier: '',
    formattedKatz: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const sodiumRaw = parseNumber(input.sodiumText);
  const glucoseRaw = parseNumber(input.glucoseText);

  if (sodiumRaw === null || glucoseRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter sodium and glucose',
      statusDetail:
        'Enter measured serum sodium and glucose to estimate hyperglycemia-corrected sodium.',
    };
  }

  if (!(sodiumRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid sodium',
      statusDetail: 'Patient sodium must be greater than zero.',
    };
  }

  if (!(glucoseRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid glucose',
      statusDetail: 'Serum glucose must be greater than zero.',
    };
  }

  const glucoseMgDl = glucoseToMgDl(glucoseRaw, input.glucoseUnit);
  const hillier = correctedSodiumHillier(sodiumRaw, glucoseMgDl);
  const katz = correctedSodiumKatz(sodiumRaw, glucoseMgDl);
  const roundedHillier = Math.round(hillier * 10) / 10;
  const roundedKatz = Math.round(katz * 10) / 10;

  return {
    sodiumMeqL: sodiumRaw,
    glucoseMgDl,
    correctedHillier: roundedHillier,
    correctedKatz: roundedKatz,
    formattedHillier: formatSodium(roundedHillier),
    formattedKatz: formatSodium(roundedKatz),
    statusHeadline: 'Corrected sodium',
    statusDetail: `Corrected sodium ≈ ${formatSodium(roundedHillier)} mEq/L (Hillier 2.4). Estimation only — not a treatment target.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
