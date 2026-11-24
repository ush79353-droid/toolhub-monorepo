/**
 * Local anesthetic plain (no epinephrine) max subcutaneous/infiltration dose worksheet.
 *
 * max_mg = min(mg/kg × weight_kg, absolute_cap) when mg/kg is defined; else absolute_cap.
 * max_mL = max_mg ÷ (concentration% × 10)   // % w/v → mg/mL
 *
 * Sources (plain / without epinephrine):
 * - Lidocaine: FDA Xylocaine — 4.5 mg/kg, generally ≤300 mg total.
 * - Bupivacaine: FDA Marcaine — single doses up to 175 mg without epinephrine;
 *   teaching weight-based ceiling commonly 2.5 mg/kg (take the smaller of the two).
 * - Mepivacaine: FDA Carbocaine/Polocaine — usual adult single dose ≤400 mg.
 * - Ropivacaine: teaching 3 mg/kg with absolute guide ≤225 mg (Naropin has no adult mg/kg
 *   on label; absolute used as conservative educational ceiling).
 */

import { limitFor } from './labeling-data';
import type { LocalAnestheticInput, LocalAnestheticResult } from './types';

export const LB_PER_KG = 2.2046226218;

export const SOURCE_NOTE =
  'Plain (no epinephrine) educational ceilings: lidocaine 4.5 mg/kg ≤300 mg (FDA Xylocaine); bupivacaine min(2.5 mg/kg, 175 mg) with FDA 175 mg single-dose note; mepivacaine usual ≤400 mg (FDA Carbocaine); ropivacaine teaching 3 mg/kg ≤225 mg. Not a prescription.';

export const DISCLAIMER =
  'Educational only — always verify against current product labeling and clinical judgment. This tool cannot replace medical consultation.';

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

/** % w/v → mg/mL (1% = 10 mg/mL). */
export function percentToMgPerMl(percent: number): number {
  return percent * 10;
}

export function maxDoseMgPlain(
  drug: LocalAnestheticInput['drug'],
  weightKg: number,
): number {
  const lim = limitFor(drug);
  if (!(weightKg > 0)) throw new Error('Weight must be positive.');
  if (lim.mgPerKg == null) return lim.absoluteCapMg;
  return Math.min(lim.mgPerKg * weightKg, lim.absoluteCapMg);
}

export function formatDose(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateLocalAnesthetic(
  input: LocalAnestheticInput,
): LocalAnestheticResult {
  const lim = limitFor(input.drug);
  const empty = (
    headline: string,
    detail: string,
  ): LocalAnestheticResult => ({
    maxDoseMg: null,
    maxDoseMl: null,
    formattedMaxDoseMg: '',
    formattedMaxDoseMl: '',
    warningNote: lim.warningNote,
    statusHeadline: headline,
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  });

  const wRaw = parseNumber(input.weightText);
  const conc = parseNumber(input.concentrationPercentText);
  if (wRaw === null) {
    return empty('Enter weight', 'Enter body weight to compute maximum plain dose.');
  }
  if (conc === null || !(conc > 0)) {
    return empty('Enter concentration', 'Select a positive concentration (%).');
  }

  const weightKg = weightToKg(wRaw, input.weightUnit);
  const maxMg = maxDoseMgPlain(input.drug, weightKg);
  const mgPerMl = percentToMgPerMl(conc);
  const maxMl = maxMg / mgPerMl;

  return {
    maxDoseMg: maxMg,
    maxDoseMl: maxMl,
    formattedMaxDoseMg: formatDose(maxMg),
    formattedMaxDoseMl: formatDose(maxMl),
    warningNote: lim.warningNote,
    statusHeadline: 'Maximum plain dose',
    statusDetail: `${lim.label}: ${formatDose(maxMg)} mg → ${formatDose(maxMl)} mL at ${conc}%. Educational only.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
