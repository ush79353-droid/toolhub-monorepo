/**
 * tPA Stroke Dosing worksheet (ADR-018) — educational only.
 *
 * Product / indication: Activase (alteplase) — Acute Ischemic Stroke (AIS).
 *
 * FDA/DailyMed §2.1 (and matching FDA prescribing information):
 *   recommended dose = 0.9 mg/kg (not to exceed 90 mg total)
 *   10% of the total dose as an initial IV bolus over 1 minute
 *   remainder infused over 60 minutes
 *
 * Incomplete cases (blank/invalid weight) stay unscored.
 * Weight alone cannot determine eligibility or treatment decisions.
 *
 * Sources (labeled only — do not invent):
 * - DailyMed ACTIVASE-alteplase kit
 *   https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c669f77c-fa48-478b-a14b-80b20a0139c2
 * - FDA Activase label (BLA 103172), Dosage and Administration §2.1 Acute Ischemic Stroke
 */

import {
  ALTEPLASE_AIS_BOLUS_FRACTION,
  ALTEPLASE_AIS_MAX_TOTAL_MG,
  ALTEPLASE_AIS_MG_PER_KG,
  type TpaStrokeInput,
  type TpaStrokeResult,
} from './types';

export const LB_PER_KG = 2.2046226218;

export const SOURCE_NOTE =
  'Activase (alteplase) acute ischemic stroke dosing follows FDA/DailyMed labeling: 0.9 mg/kg total (not to exceed 90 mg), 10% IV bolus over 1 minute, remainder infused over 60 minutes.';

export const DISCLAIMER =
  'Educational worksheet only — not a prescription, eligibility decision, or medical advice. Confirm the product label, indication, timing window, imaging, contraindications, and institutional protocol with a licensed clinician before any use. Weight alone cannot determine thrombolysis eligibility.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? value : value / LB_PER_KG;
}

export function formatFixed(n: number, digits: number): string {
  const f = n.toFixed(digits);
  return f.replace(/\.?0+$/, '');
}

export function formatMg(n: number): string {
  return formatFixed(n, 2);
}

function unscored(headline: string, detail: string): TpaStrokeResult {
  return {
    weightKg: null,
    totalDoseMg: null,
    bolusMg: null,
    infusionMg: null,
    cappedAtMax: false,
    statusHeadline: headline,
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function calculateTpaStroke(input: TpaStrokeInput): TpaStrokeResult {
  const weightRaw = parseNumber(input.weightText);
  if (weightRaw === null) {
    return unscored(
      'Enter weight',
      'Enter body weight to compute the labeled Activase acute ischemic stroke total dose.',
    );
  }
  if (!(weightRaw > 0)) {
    throw new Error('Weight must be greater than zero.');
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const byWeightMg = weightKg * ALTEPLASE_AIS_MG_PER_KG;
  const totalDoseMg = Math.min(byWeightMg, ALTEPLASE_AIS_MAX_TOTAL_MG);
  const cappedAtMax = byWeightMg > ALTEPLASE_AIS_MAX_TOTAL_MG;
  const bolusMg = totalDoseMg * ALTEPLASE_AIS_BOLUS_FRACTION;
  const infusionMg = totalDoseMg - bolusMg;

  return {
    weightKg,
    totalDoseMg,
    bolusMg,
    infusionMg,
    cappedAtMax,
    statusHeadline: 'Labeled total dose',
    statusDetail: cappedAtMax
      ? `Weight-based ${formatFixed(byWeightMg, 2)} mg exceeds the labeled absolute maximum of ${ALTEPLASE_AIS_MAX_TOTAL_MG} mg — using ${formatFixed(totalDoseMg, 2)} mg (bolus ${formatFixed(bolusMg, 2)} mg over 1 min; infusion ${formatFixed(infusionMg, 2)} mg over 60 min). Educational only — not an eligibility decision.`
      : `${formatFixed(weightKg, 2)} kg × ${ALTEPLASE_AIS_MG_PER_KG} mg/kg = ${formatFixed(totalDoseMg, 2)} mg (bolus ${formatFixed(bolusMg, 2)} mg over 1 min; infusion ${formatFixed(infusionMg, 2)} mg over 60 min). Educational only — not an eligibility decision.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
