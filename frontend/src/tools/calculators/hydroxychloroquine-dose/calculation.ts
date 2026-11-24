/**
 * Hydroxychloroquine Dose Calculator — educational daily-dose checker (ADR-018).
 *
 * Scope (screenshot + ADR-023): weight + custom daily dose only.
 * Computes mg/kg/day using actual body weight and compares against the FDA
 * PLAQUENIL retinopathy risk threshold. Does NOT invent a prescription from
 * weight alone.
 *
 * Sources (hydroxychloroquine sulfate labeling):
 * - FDA PLAQUENIL label (NDA 009768, revised 2023/2024): daily doses exceeding
 *   5 mg/kg (actual weight) of hydroxychloroquine sulfate increase retinopathy
 *   incidence; risk factors include daily dosages ≥5 mg/kg actual body weight.
 * - DailyMed PLAQUENIL / hydroxychloroquine sulfate: RA adults initial
 *   400–600 mg daily, chronic 200–400 mg daily; SLE and chronic discoid lupus
 *   adults 200 mg once daily or 400 mg once daily (or two divided doses).
 * - Tablets: 200 mg hydroxychloroquine sulfate ≈ 155 mg base.
 *
 * Body-weight definition: actual body weight (FDA label wording). Ideal body
 * weight is not used here.
 */

import type {
  DoseUnit,
  HydroxychloroquineDoseInput,
  HydroxychloroquineDoseResult,
  WeightUnit,
} from './types';

/** Exact lb→kg factor used across ToolHub calculators. */
export const LB_PER_KG = 2.2046226218;

/** FDA PLAQUENIL retinopathy threshold (mg sulfate / kg actual body weight / day). */
export const RETINOPATHY_THRESHOLD_MG_PER_KG_ABW = 5;

export const SOURCE_NOTE =
  'Comparison uses FDA PLAQUENIL (hydroxychloroquine sulfate) labeling: daily doses ≥5 mg/kg actual body weight increase retinopathy risk. Absolute adult ranges — RA initial 400–600 mg/day, chronic 200–400 mg/day; SLE and discoid lupus 200 or 400 mg/day — are from DailyMed/FDA dosage sections. Educational check of a supplied regimen only; not a prescription.';

export const DISCLAIMER =
  'Educational worksheet only — not a prescription, dosing order, or medical advice. Always confirm the current FDA/DailyMed label, contraindications, and monitoring (including ophthalmology) with a licensed clinician.';

export const ABSOLUTE_RANGE_NOTE =
  'Labeled adult absolute daily ranges (hydroxychloroquine sulfate): rheumatoid arthritis initial 400–600 mg daily, chronic 200–400 mg daily; systemic lupus erythematosus and chronic discoid lupus erythematosus 200 mg once daily or 400 mg once daily (or in two divided doses). This tool does not pick a dose from weight alone.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value / LB_PER_KG;
}

export function doseToMg(value: number, unit: DoseUnit): number {
  return unit === 'mg' ? value : value * 1000;
}

export function formatFixed(n: number, digits: number): string {
  const f = n.toFixed(digits);
  return f.replace(/\.?0+$/, '');
}

function emptyResult(
  headline: string,
  detail: string,
  extras: Partial<HydroxychloroquineDoseResult> = {},
): HydroxychloroquineDoseResult {
  return {
    weightKg: extras.weightKg ?? null,
    dailyDoseMg: extras.dailyDoseMg ?? null,
    mgPerKgPerDay: null,
    thresholdMgPerKg: RETINOPATHY_THRESHOLD_MG_PER_KG_ABW,
    band: 'incomplete',
    statusHeadline: headline,
    statusDetail: detail,
    absoluteRangeNote: ABSOLUTE_RANGE_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function calculateHydroxychloroquineDose(
  input: HydroxychloroquineDoseInput,
): HydroxychloroquineDoseResult {
  const weightRaw = parseNumber(input.weightText);
  const doseRaw = parseNumber(input.dailyDoseText);

  if (weightRaw === null && doseRaw === null) {
    return emptyResult(
      'Enter weight and your custom daily dose',
      'This checker compares a supplied hydroxychloroquine sulfate regimen to the FDA ≥5 mg/kg/day actual-body-weight retinopathy threshold. It does not invent a dose from weight alone.',
    );
  }

  if (weightRaw === null) {
    return emptyResult(
      'Enter weight',
      'Enter actual body weight so the custom daily dose can be expressed as mg/kg/day. No prescription is generated from dose alone.',
      {
        dailyDoseMg: doseRaw !== null ? doseToMg(doseRaw, input.doseUnit) : null,
      },
    );
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);

  if (doseRaw === null) {
    return emptyResult(
      'Enter your custom daily dose',
      `Weight ≈ ${formatFixed(weightKg, 2)} kg (actual body weight). Enter the daily hydroxychloroquine sulfate amount already prescribed or under review — this tool will not invent a mg/day dose from weight.`,
      { weightKg },
    );
  }

  const dailyDoseMg = doseToMg(doseRaw, input.doseUnit);
  if (!(weightKg > 0) || !(dailyDoseMg > 0)) {
    throw new Error('Weight and daily dose must be greater than zero.');
  }

  const mgPerKgPerDay = dailyDoseMg / weightKg;
  const atOrAbove = mgPerKgPerDay >= RETINOPATHY_THRESHOLD_MG_PER_KG_ABW;

  return {
    weightKg,
    dailyDoseMg,
    mgPerKgPerDay,
    thresholdMgPerKg: RETINOPATHY_THRESHOLD_MG_PER_KG_ABW,
    band: atOrAbove ? 'at_or_above_threshold' : 'below_threshold',
    statusHeadline: atOrAbove
      ? 'At or above FDA retinopathy threshold'
      : 'Below FDA retinopathy threshold',
    statusDetail: atOrAbove
      ? `Custom regimen ≈ ${formatFixed(mgPerKgPerDay, 2)} mg/kg/day actual body weight (${formatFixed(dailyDoseMg, 1)} mg ÷ ${formatFixed(weightKg, 2)} kg). FDA labeling associates daily hydroxychloroquine sulfate dosages ≥${RETINOPATHY_THRESHOLD_MG_PER_KG_ABW} mg/kg actual body weight with higher retinopathy risk. Educational comparison only — not a stop/start order.`
      : `Custom regimen ≈ ${formatFixed(mgPerKgPerDay, 2)} mg/kg/day actual body weight (${formatFixed(dailyDoseMg, 1)} mg ÷ ${formatFixed(weightKg, 2)} kg), below the FDA ≥${RETINOPATHY_THRESHOLD_MG_PER_KG_ABW} mg/kg/day actual-body-weight retinopathy risk threshold. Educational comparison only — monitoring and labeled absolute ranges still apply.`,
    absoluteRangeNote: ABSOLUTE_RANGE_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
