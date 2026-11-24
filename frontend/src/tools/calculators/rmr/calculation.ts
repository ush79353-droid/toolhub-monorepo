/**
 * RMR Calculator — resting metabolic rate (ADR-018).
 *
 * Equation: original Harris–Benedict (1919) × TEF 1.1.
 * Reuses `harrisBenedictBmrKcal` from the DRI calculator (same coefficients).
 *
 * Men:   (66.473 + 13.7516×kg + 5.0033×cm − 6.755×age) × 1.1
 * Women: (655.0955 + 9.5634×kg + 1.8496×cm − 4.6756×age) × 1.1
 *
 * Primary sources:
 * - Harris JA, Benedict FG. A Biometric Study of Human Basal Metabolism.
 *   Proc Natl Acad Sci USA. 1918;4(12):370-373.
 * - Omni RMR educational model: HB × thermic effect of food (~10% / 1.1),
 *   not an activity / PAL multiplier.
 *
 * Scope: resting kcal/day only — no activity / stress multipliers. No FX.
 * Screenshot has no body-fat field → Katch–McArdle out of scope.
 */

import { harrisBenedictBmrKcal } from '../dri/calculation';
import type { HeightUnit, RmrInput, RmrResult, WeightUnit } from './types';

export const SOURCE_NOTE =
  'Original Harris–Benedict (1919) × TEF 1.1 for resting metabolic rate (kcal/day); shares DRI HB helper. Educational estimate only.';

export const DISCLAIMER =
  'Educational resting-energy estimate — not individualized medical nutrition therapy.';

export const EQUATION_LABEL = 'Harris–Benedict (1919) × TEF 1.1';

/** Thermic effect of food factor (Omni RMR educational model; not activity). */
export const TEF_FACTOR = 1.1;

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

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

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

/** Round RMR for display only — engine keeps full precision in rmrKcalPerDay. */
export function formatRmrKcal(kcalPerDay: number | null): string {
  if (kcalPerDay == null || !Number.isFinite(kcalPerDay)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(kcalPerDay));
}

/** RMR = original Harris–Benedict BMR × TEF 1.1. */
export function rmrFromHarrisBenedictKcal(
  sex: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  ageYears: number,
): number {
  return harrisBenedictBmrKcal(sex, weightKg, heightCm, ageYears) * TEF_FACTOR;
}

export function calculateRmr(input: RmrInput): RmrResult {
  const empty: RmrResult = {
    rmrKcalPerDay: null,
    rmrDisplay: '',
    statusHeadline: 'Enter age, height, and weight',
    statusDetail:
      'Complete anthropometrics to estimate resting metabolic rate (kcal/day).',
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const age = parseNumber(input.ageYearsText);
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);

  if (age === null || hRaw === null || wRaw === null) {
    return empty;
  }

  if (!(age >= 15 && age <= 100)) {
    return {
      ...empty,
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be between 15 and 100 years for this equation.',
    };
  }

  if (!(hRaw > 0) || !(wRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid height or weight',
      statusDetail: 'Height and weight must be positive numbers.',
    };
  }

  const heightCm = heightToCm(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);

  const rmr = rmrFromHarrisBenedictKcal(input.sex, weightKg, heightCm, age);

  if (!Number.isFinite(rmr) || rmr <= 0) {
    return {
      ...empty,
      statusHeadline: 'Unable to calculate',
      statusDetail: 'Resulting RMR was not a positive finite value.',
    };
  }

  const display = formatRmrKcal(rmr);

  return {
    rmrKcalPerDay: rmr,
    rmrDisplay: display,
    statusHeadline: 'Resting metabolic rate estimate',
    statusDetail: `RMR ≈ ${display} kcal/day (Harris–Benedict × TEF; resting only).`,
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
