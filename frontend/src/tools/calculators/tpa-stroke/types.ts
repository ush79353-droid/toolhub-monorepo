/**
 * tPA Calculator – Stroke Dosing — types & defaults (ADR-018 / ADR-023).
 *
 * Screenshot scope: blank Weight (kg|lb) → read-only “tPA needed” (mg).
 * Indication locked to FDA/DailyMed Activase (alteplase) acute ischemic stroke.
 * No FX. No medically actionable seeded defaults.
 */

export type WeightUnit = 'kg' | 'lb';

/**
 * Activase (alteplase) — Acute Ischemic Stroke (FDA/DailyMed §2.1):
 * 0.9 mg/kg total, not to exceed 90 mg; 10% IV bolus over 1 minute;
 * remainder infused over 60 minutes.
 */
export const ALTEPLASE_AIS_MG_PER_KG = 0.9;
export const ALTEPLASE_AIS_MAX_TOTAL_MG = 90;
export const ALTEPLASE_AIS_BOLUS_FRACTION = 0.1;

export interface TpaStrokeInput {
  weightText: string;
  weightUnit: WeightUnit;
}

export interface TpaStrokeResult {
  weightKg: number | null;
  /** min(weightKg × 0.9, 90) when scored. */
  totalDoseMg: number | null;
  /** 10% of total — labeled bolus over 1 minute. */
  bolusMg: number | null;
  /** 90% of total — labeled infusion over 60 minutes. */
  infusionMg: number | null;
  cappedAtMax: boolean;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type TpaStrokeFieldErrors = {
  weightText?: string;
};

export function createDefaultInput(): TpaStrokeInput {
  return {
    weightText: '',
    weightUnit: 'kg',
  };
}

export function createEmptyInput(): TpaStrokeInput {
  return createDefaultInput();
}

export function inputsEqual(a: TpaStrokeInput, b: TpaStrokeInput): boolean {
  return a.weightText === b.weightText && a.weightUnit === b.weightUnit;
}
