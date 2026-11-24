/**
 * Katch–McArdle Calculator — basal metabolic rate (ADR-018).
 *
 * BMR (kcal/day) = 370 + 21.6 × LBM (kg)
 *
 * LBM sources (screenshot modes):
 * - known LBM: direct entry (kg)
 * - body fat %: LBM = weight × (1 − fat%/100)
 * - unknown: Boer (1984) sex-specific estimate from weight (kg) + height (cm)
 *
 * Primary sources:
 * - Katch FI, McArdle WD. Nutrition, Weight Control, and Exercise
 *   (Lippincott; commonly cited Katch–McArdle BMR coefficients).
 * - Boer P. Estimated lean body mass as an index for normalization of body
 *   fluid volumes in humans. Am J Physiol. 1984;247:F632–F636.
 *
 * Scope: basal kcal/day only — no activity / stress multipliers. No FX.
 */

import type {
  HeightUnit,
  KatchMcardleInput,
  KatchMcardleResult,
  MassUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Katch–McArdle BMR = 370 + 21.6 × LBM (kg); unknown LBM uses Boer (1984). Educational estimate only.';

export const DISCLAIMER =
  'Educational resting-energy estimate — not individualized medical nutrition therapy.';

export const EQUATION_LABEL = 'Katch–McArdle (LBM-based BMR)';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

/** Katch–McArdle intercept (kcal/day). */
export const KATCH_INTERCEPT = 370;
/** Katch–McArdle slope (kcal/day per kg LBM). */
export const KATCH_SLOPE = 21.6;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  return unit === 'cm' ? value : value * IN_TO_CM;
}

export function weightToKg(value: number, unit: WeightUnit | MassUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

/**
 * Boer (1984) lean body mass estimate.
 * Men:   0.407×W + 0.267×H − 19.2
 * Women: 0.252×W + 0.473×H − 48.3
 * W in kg, H in cm.
 */
export function boerLeanBodyMassKg(
  sex: 'male' | 'female',
  weightKg: number,
  heightCm: number,
): number {
  if (sex === 'male') {
    return 0.407 * weightKg + 0.267 * heightCm - 19.2;
  }
  return 0.252 * weightKg + 0.473 * heightCm - 48.3;
}

/** LBM from total mass and body-fat percent. */
export function leanMassFromBodyFatKg(
  weightKg: number,
  bodyFatPercent: number,
): number {
  return weightKg * (1 - bodyFatPercent / 100);
}

/** Published Katch–McArdle BMR. */
export function katchMcardleBmrKcalPerDay(lbmKg: number): number {
  return KATCH_INTERCEPT + KATCH_SLOPE * lbmKg;
}

/** Round BMR for display only — engine keeps full precision in bmrKcalPerDay. */
export function formatBmrKcal(kcalPerDay: number | null): string {
  if (kcalPerDay == null || !Number.isFinite(kcalPerDay)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(kcalPerDay));
}

export function formatLbmKg(lbmKg: number | null): string {
  if (lbmKg == null || !Number.isFinite(lbmKg)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(lbmKg);
}

export function emptyResult(
  headline = 'Enter lean mass or anthropometrics',
  detail = 'Choose how you know lean body mass, then complete the fields to estimate BMR.',
): KatchMcardleResult {
  return {
    lbmKg: null,
    lbmDisplay: '',
    bmrKcalPerDay: null,
    bmrDisplay: '',
    statusHeadline: headline,
    statusDetail: detail,
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

function finishFromLbm(
  lbmKg: number,
  lbmSourceDetail: string,
): KatchMcardleResult {
  if (!(lbmKg > 0) || !Number.isFinite(lbmKg)) {
    return emptyResult(
      'Invalid lean body mass',
      'Lean body mass must be a positive finite value in kilograms.',
    );
  }

  const bmr = katchMcardleBmrKcalPerDay(lbmKg);
  if (!Number.isFinite(bmr) || bmr <= 0) {
    return emptyResult(
      'Unable to calculate',
      'Resulting BMR was not a positive finite value.',
    );
  }

  const lbmDisplay = formatLbmKg(lbmKg);
  const bmrDisplay = formatBmrKcal(bmr);

  return {
    lbmKg,
    lbmDisplay,
    bmrKcalPerDay: bmr,
    bmrDisplay,
    statusHeadline: 'Basal metabolic rate estimate',
    statusDetail: `LBM ≈ ${lbmDisplay} kg (${lbmSourceDetail}). BMR ≈ ${bmrDisplay} kcal/day (Katch–McArdle; resting only).`,
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function calculateKatchMcardle(
  input: KatchMcardleInput,
): KatchMcardleResult {
  if (input.lbmMode === 'known_lbm') {
    const raw = parseNumber(input.leanMassText);
    if (raw === null) {
      return emptyResult(
        'Enter lean body mass',
        'Provide measured lean body mass to estimate BMR.',
      );
    }
    if (!(raw > 0)) {
      return emptyResult(
        'Invalid lean body mass',
        'Lean body mass must be positive.',
      );
    }
    const lbmKg = weightToKg(raw, input.leanMassUnit);
    return finishFromLbm(lbmKg, 'entered');
  }

  if (input.lbmMode === 'body_fat') {
    const wRaw = parseNumber(input.weightText);
    const fatRaw = parseNumber(input.bodyFatText);
    if (wRaw === null || fatRaw === null) {
      return emptyResult(
        'Enter weight and body fat %',
        'Lean mass is weight × (1 − fat%/100); then apply Katch–McArdle.',
      );
    }
    if (!(wRaw > 0)) {
      return emptyResult('Invalid weight', 'Weight must be positive.');
    }
    if (!(fatRaw >= 0 && fatRaw < 100)) {
      return emptyResult(
        'Invalid body fat %',
        'Body fat must be ≥ 0 and < 100%.',
      );
    }
    const weightKg = weightToKg(wRaw, input.weightUnit);
    const lbmKg = leanMassFromBodyFatKg(weightKg, fatRaw);
    return finishFromLbm(lbmKg, `${fatRaw}% body fat`);
  }

  // unknown → Boer estimate
  const wRaw = parseNumber(input.weightText);
  const hRaw = parseNumber(input.heightText);
  if (wRaw === null || hRaw === null) {
    return emptyResult(
      'Enter weight and height',
      'When LBM is unknown, Boer (1984) estimates lean mass from sex, weight, and height.',
    );
  }
  if (!(wRaw > 0) || !(hRaw > 0)) {
    return emptyResult(
      'Invalid height or weight',
      'Height and weight must be positive numbers.',
    );
  }

  const weightKg = weightToKg(wRaw, input.weightUnit);
  const heightCm = heightToCm(hRaw, input.heightUnit);
  const lbmKg = boerLeanBodyMassKg(input.sex, weightKg, heightCm);
  return finishFromLbm(lbmKg, `Boer ${input.sex}`);
}
