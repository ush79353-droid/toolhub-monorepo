/**
 * Insulin Dosage Calculator — pure educational arithmetic (ADR-018).
 *
 * Carb coverage = carbs_g / ICR (g per unit)
 * Correction = max(0, (current − target) / ISF)  [low-glucose / below-target → 0]
 * Total = coverage + correction (when either component is defined)
 *
 * Rule of 500 / 1800 suggestions from TDD are educational labels only —
 * they never overwrite user ICR/ISF fields.
 */

import type {
  GlucoseUnit,
  InsulinDosageInput,
  InsulinDosageResult,
} from './types';

/** Conventional mg/dL per mmol/L factor used in glucose unit conversion. */
export const MGDL_PER_MMOL = 18.0182;

/** Educational Rule of 500 (ICR ≈ 500 / TDD). */
export const RULE_OF_500 = 500;
/** Educational Rule of 1800 for mg/dL ISF (ISF ≈ 1800 / TDD). */
export const RULE_OF_1800_MGDL = 1800;

/** Soft guard threshold (mg/dL) — warn; correction still clamped at target. */
export const LOW_GLUCOSE_MGDL = 70;

export const DISCLAIMER =
  'Always double-check the calculations, the dosing information, and contraindications on the leaflet. Consult your health provider before administering any medication. This tool performs illustrative arithmetic on values you enter — it does not prescribe insulin.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function glucoseToMgDl(value: number, unit: GlucoseUnit): number {
  return unit === 'mg/dL' ? value : value * MGDL_PER_MMOL;
}

export function glucoseFromMgDl(mgDl: number, unit: GlucoseUnit): number {
  return unit === 'mg/dL' ? mgDl : mgDl / MGDL_PER_MMOL;
}

export function convertGlucoseValue(
  value: number,
  from: GlucoseUnit,
  to: GlucoseUnit,
): number {
  if (from === to) return value;
  return glucoseFromMgDl(glucoseToMgDl(value, from), to);
}

export function formatUnits(units: number): string {
  if (!Number.isFinite(units)) return '';
  const rounded = Math.round(units * 100) / 100;
  return String(rounded);
}

export function carbCoverageUnits(carbsGrams: number, carbRatio: number): number {
  if (!(carbRatio > 0) || !Number.isFinite(carbRatio)) {
    throw new RangeError('Carb ratio must be positive.');
  }
  if (!Number.isFinite(carbsGrams) || carbsGrams < 0) {
    throw new RangeError('Carbohydrates must be a non-negative finite number.');
  }
  return carbsGrams / carbRatio;
}

/**
 * Correction bolus. Below-target (or equal) → 0 units (low-glucose / no positive correction).
 * ISF must be positive in the same unit as glucose.
 */
export function correctionUnits(
  current: number,
  target: number,
  sensitivity: number,
): number {
  if (!(sensitivity > 0) || !Number.isFinite(sensitivity)) {
    throw new RangeError('Sensitivity must be positive.');
  }
  if (!Number.isFinite(current) || !Number.isFinite(target)) {
    throw new RangeError('Glucose values must be finite.');
  }
  const delta = current - target;
  if (delta <= 0) return 0;
  return delta / sensitivity;
}

export function suggestedIcrFromTdd(tdd: number): number | null {
  if (!(tdd > 0) || !Number.isFinite(tdd)) return null;
  return RULE_OF_500 / tdd;
}

export function suggestedIsfMgDlFromTdd(tdd: number): number | null {
  if (!(tdd > 0) || !Number.isFinite(tdd)) return null;
  return RULE_OF_1800_MGDL / tdd;
}

export function calculateInsulinDosage(
  input: InsulinDosageInput,
): InsulinDosageResult | null {
  const carbs = parseNumber(input.carbsGrams);
  const ratio = parseNumber(input.carbRatio);
  const current = parseNumber(input.currentGlucose);
  const target = parseNumber(input.targetGlucose);
  const sensitivity = parseNumber(input.sensitivity);
  const tdd = parseNumber(input.totalDailyDose);

  const notes: string[] = [];

  let carbCoverage: number | null = null;
  if (carbs != null && ratio != null) {
    if (!(ratio > 0)) return null;
    if (carbs < 0) return null;
    carbCoverage = carbCoverageUnits(carbs, ratio);
  }

  let correction: number | null = null;
  if (current != null && target != null && sensitivity != null) {
    if (!(sensitivity > 0)) return null;
    correction = correctionUnits(current, target, sensitivity);
    const currentMgDl = glucoseToMgDl(current, input.glucoseUnit);
    if (currentMgDl < LOW_GLUCOSE_MGDL) {
      notes.push(
        `Current glucose is below ${LOW_GLUCOSE_MGDL} mg/dL (or mmol/L equivalent). Correction is clamped to zero when at or below target — seek clinical guidance for hypoglycemia.`,
      );
    }
  }

  if (carbCoverage == null && correction == null) {
    // Still allow TDD educational suggestions with empty meal math.
    if (!input.knowTotalDailyDose) {
      return null;
    }
  }

  const total =
    carbCoverage == null && correction == null
      ? null
      : (carbCoverage ?? 0) + (correction ?? 0);

  const suggestedCarbRatio =
    input.knowTotalDailyDose && tdd != null ? suggestedIcrFromTdd(tdd) : null;
  const suggestedSensitivityMgDl =
    input.knowTotalDailyDose && tdd != null
      ? suggestedIsfMgDlFromTdd(tdd)
      : null;

  if (suggestedCarbRatio != null && suggestedSensitivityMgDl != null) {
    notes.push(
      `Educational Rule of 500 / 1800 from TDD ${tdd}: ICR ≈ ${formatUnits(suggestedCarbRatio)} g/unit; ISF ≈ ${formatUnits(suggestedSensitivityMgDl)} mg/dL. These are not applied automatically.`,
    );
  }

  return {
    carbCoverageUnits: carbCoverage,
    correctionUnits: correction,
    totalUnits: total,
    formattedCarbCoverage:
      carbCoverage == null ? '' : formatUnits(carbCoverage),
    formattedCorrection: correction == null ? '' : formatUnits(correction),
    formattedTotal: total == null ? '' : formatUnits(total),
    suggestedCarbRatio,
    suggestedSensitivityMgDl,
    lowGlucoseGuard:
      current != null &&
      glucoseToMgDl(current, input.glucoseUnit) < LOW_GLUCOSE_MGDL,
    notes,
    disclaimer: DISCLAIMER,
  };
}
