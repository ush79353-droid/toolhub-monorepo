/**
 * Lidocaine max subcutaneous dose worksheet (ADR-018) — educational only.
 *
 * Formulation: lidocaine HCl injection WITHOUT epinephrine.
 * Route: percutaneous / subcutaneous infiltration (screenshot “subQ”).
 *
 * FDA/DailyMed adult maximums (plain):
 *   individual max ≤ 4.5 mg/kg body weight
 *   general absolute max ≤ 300 mg
 *
 * Concentration: % w/v × 10 = mg/mL (e.g. 0.25% → 2.5 mg/mL).
 * max_mg = min(weight_kg × 4.5, 300)
 * max_mL = max_mg ÷ mg_per_mL
 *
 * Incomplete clinical cases (blank/invalid weight) stay unscored.
 *
 * Sources:
 * - DailyMed lidocaine hydrochloride injection (e.g. setid cffda6fc-7e85-4c48-9623-2551d3552d7d)
 * - FDA XYLOCAINE / XYLOCAINE WITH EPINEPHRINE label (NDA 006488), §2.6 Maximum Recommended Dosage
 */

import {
  LIDOCAINE_PLAIN_ABSOLUTE_MAX_MG,
  LIDOCAINE_PLAIN_MG_PER_KG,
  type LidocaineDoseInput,
  type LidocaineDoseResult,
} from './types';

export const LB_PER_KG = 2.2046226218;

export const SOURCE_NOTE =
  'Maximums follow FDA/DailyMed lidocaine hydrochloride injection labeling for adults without epinephrine: individual dose ≤ 4.5 mg/kg and general total ≤ 300 mg. Concentration % w/v × 10 = mg/mL. Epinephrine-containing solutions (≤ 7 mg/kg / 500 mg) are not modeled.';

export const DISCLAIMER =
  'Educational worksheet only — not a prescription, dosing order, or medical advice. Confirm the product leaflet (formulation, epinephrine, route, and patient factors) with a licensed clinician before any use.';

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

/** % w/v → mg/mL. */
export function concentrationToMgPerMl(percent: number): number {
  return percent * 10;
}

export function formatFixed(n: number, digits: number): string {
  const f = n.toFixed(digits);
  return f.replace(/\.?0+$/, '');
}

export function formatMl(n: number): string {
  return formatFixed(n, 2);
}

export function formatMg(n: number): string {
  return formatFixed(n, 1);
}

function unscored(
  headline: string,
  detail: string,
): LidocaineDoseResult {
  return {
    weightKg: null,
    concentrationPercent: null,
    mgPerMl: null,
    maxDoseMg: null,
    maxDoseMl: null,
    statusHeadline: headline,
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function calculateLidocaineDose(
  input: LidocaineDoseInput,
): LidocaineDoseResult {
  const weightRaw = parseNumber(input.weightText);
  if (weightRaw === null) {
    return unscored(
      'Enter weight',
      'Enter body weight to compute the FDA plain-lidocaine maximum subcutaneous dose.',
    );
  }
  if (!(weightRaw > 0)) {
    throw new Error('Weight must be greater than zero.');
  }

  const concentrationPercent = Number(input.concentrationPercent);
  if (
    !Number.isFinite(concentrationPercent) ||
    !(concentrationPercent > 0)
  ) {
    return unscored(
      'Select concentration',
      'Choose a lidocaine % w/v concentration.',
    );
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const mgPerMl = concentrationToMgPerMl(concentrationPercent);
  const byWeightMg = weightKg * LIDOCAINE_PLAIN_MG_PER_KG;
  const maxDoseMg = Math.min(byWeightMg, LIDOCAINE_PLAIN_ABSOLUTE_MAX_MG);
  const maxDoseMl = maxDoseMg / mgPerMl;
  const cappedByAbsolute = byWeightMg > LIDOCAINE_PLAIN_ABSOLUTE_MAX_MG;

  return {
    weightKg,
    concentrationPercent,
    mgPerMl,
    maxDoseMg,
    maxDoseMl,
    statusHeadline: 'Maximum subcutaneous dose',
    statusDetail: cappedByAbsolute
      ? `Weight-based ceiling ${formatFixed(byWeightMg, 1)} mg exceeds the labeled absolute maximum of ${LIDOCAINE_PLAIN_ABSOLUTE_MAX_MG} mg — using ${formatFixed(maxDoseMg, 1)} mg (${formatFixed(mgPerMl, 2)} mg/mL → ${formatFixed(maxDoseMl, 2)} mL). Educational only.`
      : `${formatFixed(weightKg, 2)} kg × ${LIDOCAINE_PLAIN_MG_PER_KG} mg/kg = ${formatFixed(maxDoseMg, 1)} mg at ${formatFixed(mgPerMl, 2)} mg/mL → ${formatFixed(maxDoseMl, 2)} mL. Educational only.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
