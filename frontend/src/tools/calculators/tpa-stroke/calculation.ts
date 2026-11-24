/**
 * tPA Stroke Dosing — UI stub (ADR-018).
 * Engine commit replaces this with FDA/DailyMed Activase AIS math.
 */

import type { TpaStrokeInput, TpaStrokeResult } from './types';

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

export function formatMg(n: number): string {
  const f = n.toFixed(2);
  return f.replace(/\.?0+$/, '');
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

/** UI stub — always unscored until the engine commit. */
export function calculateTpaStroke(_input: TpaStrokeInput): TpaStrokeResult {
  return unscored(
    'Enter weight',
    'Enter body weight to compute the labeled Activase acute ischemic stroke total dose.',
  );
}
