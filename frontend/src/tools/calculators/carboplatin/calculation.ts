/**
 * Carboplatin dosing — Cockcroft–Gault GFR and Calvert formula (ADR-018).
 *
 * GFR (mL/min) = ((140 − age) × weight_kg) / (72 × Scr_mg/dL) × (0.85 if female)
 * Dose (mg) = Target AUC × (GFR + 25)
 * Maximum dose uses GFR capped at 125 mL/min (common oncology practice).
 */

import type { CarboplatinInput, CarboplatinResult } from './types';

export const GFR_CAP_ML_MIN = 125;
export const CALVERT_OFFSET = 25;

export const SOURCE_NOTE =
  'Cockcroft–Gault creatinine clearance as GFR surrogate; Calvert dose = AUC × (GFR + 25). Educational oncology arithmetic.';

export const DISCLAIMER =
  'Oncology dosing requires protocol confirmation — not for independent prescribing.';

const LB_TO_KG = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

/** Absolute GFR mL/min (Cockcroft–Gault). */
export function cockcroftGaultGfrMlMin(
  sex: 'male' | 'female',
  ageYears: number,
  weightKg: number,
  scrMgDl: number,
): number {
  if (!(ageYears > 0 && weightKg > 0 && scrMgDl > 0)) {
    throw new Error('Age, weight, and creatinine must be positive.');
  }
  let gfr = ((140 - ageYears) * weightKg) / (72 * scrMgDl);
  if (sex === 'female') gfr *= 0.85;
  return gfr;
}

/** Calvert carboplatin dose in mg. */
export function calvertDoseMg(targetAuc: number, gfrMlMin: number): number {
  if (!(targetAuc > 0 && gfrMlMin >= 0)) {
    throw new Error('Invalid AUC or GFR for Calvert dose.');
  }
  return targetAuc * (gfrMlMin + CALVERT_OFFSET);
}

export function formatMg(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
}

export function formatGfr(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
}

export function calculateCarboplatin(input: CarboplatinInput): CarboplatinResult {
  const empty: CarboplatinResult = {
    gfrMlMin: null,
    carboplatinDoseMg: null,
    maximumDoseMg: null,
    gfrUsedForMax: null,
    statusHeadline: 'Enter patient data',
    statusDetail:
      'Provide sex, age, weight, serum creatinine (mg/dL), and target AUC to estimate GFR and Calvert carboplatin dose.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const age = parseNumber(input.ageYearsText);
  const wRaw = parseNumber(input.weightText);
  const scr = parseNumber(input.scrMgDlText);
  const auc = parseNumber(input.targetAucText);

  if (age === null || wRaw === null || scr === null || auc === null) {
    return empty;
  }

  if (!(age > 0 && age <= 120)) {
    return { ...empty, statusHeadline: 'Invalid age', statusDetail: 'Age must be 1–120 years.' };
  }
  if (!(wRaw > 0)) {
    return { ...empty, statusHeadline: 'Invalid weight', statusDetail: 'Weight must be positive.' };
  }
  if (!(scr > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid creatinine',
      statusDetail: 'Serum creatinine must be positive (mg/dL).',
    };
  }
  if (!(auc > 0)) {
    return { ...empty, statusHeadline: 'Invalid AUC', statusDetail: 'Target AUC must be positive.' };
  }

  const weightKg = weightToKg(wRaw, input.weightUnit);
  const gfr = cockcroftGaultGfrMlMin(input.sex, age, weightKg, scr);
  const dose = calvertDoseMg(auc, gfr);
  const gfrCapped = Math.min(gfr, GFR_CAP_ML_MIN);
  const maxDose = calvertDoseMg(auc, gfrCapped);

  return {
    gfrMlMin: gfr,
    carboplatinDoseMg: dose,
    maximumDoseMg: maxDose,
    gfrUsedForMax: gfrCapped,
    statusHeadline: 'Calvert carboplatin dose',
    statusDetail: `GFR ${formatGfr(gfr)} mL/min → dose ${formatMg(dose)} mg. Maximum uses GFR capped at ${GFR_CAP_ML_MIN} mL/min → ${formatMg(maxDose)} mg.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** Example fixture: male 50y, 80 kg, Cr 1.0, AUC 5 → GFR 100, dose 625 mg. */
export const EXAMPLE_MALE = {
  sex: 'male' as const,
  age: 50,
  weightKg: 80,
  scrMgDl: 1,
  targetAuc: 5,
};