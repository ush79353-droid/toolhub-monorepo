/**
 * INR — WHO International Normalized Ratio (ADR-018).
 *
 *   INR = (patient PT / MNPT)^ISI
 *
 * Sources:
 * - WHO Technical Report Series 979, Annex 6 (Guidelines for thromboplastins
 *   and plasma used to control oral anticoagulant therapy), §8:
 *   INR = (PT/MNPT)^ISI where MNPT is mean normal PT for the same system.
 * - Poller L. International Normalized Ratios (INR): the first 20 years.
 *   J Thromb Haemost. 2004;2(6):849–860.
 *
 * Control PT in the UI is the lab mean normal PT (MNPT). ISI is
 * reagent-/method-specific. No therapeutic target ranges are invented.
 */

import type { InrInput, InrResult } from './types';

export const SOURCE_NOTE =
  'INR = (patient PT ÷ mean normal PT)^ISI. WHO Technical Report Series 979, Annex 6; ISI is reagent- and method-specific.';

export const DISCLAIMER =
  'Educational coagulation calculator — not a laboratory report, diagnosis, or anticoagulation order.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * WHO INR power formula. Requires positive finite patient PT, MNPT, and ISI.
 * Equal patient and MNPT → 1 for any positive ISI.
 */
export function inrFromPts(
  patientPtSec: number,
  meanNormalPtSec: number,
  isi: number,
): number {
  if (!(Number.isFinite(patientPtSec) && patientPtSec > 0)) {
    throw new Error('Patient PT must be greater than zero.');
  }
  if (!(Number.isFinite(meanNormalPtSec) && meanNormalPtSec > 0)) {
    throw new Error('Mean normal PT must be greater than zero.');
  }
  if (!(Number.isFinite(isi) && isi > 0)) {
    throw new Error('ISI must be greater than zero.');
  }
  return Math.pow(patientPtSec / meanNormalPtSec, isi);
}

/** Round for display only (two decimal places; strip trailing zeros). */
export function formatInr(inr: number): string {
  if (!Number.isFinite(inr)) return '';
  const rounded = Math.round(inr * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/\.?0+$/, '');
}

export function roundInr(inr: number): number {
  return Math.round(inr * 100) / 100;
}

function emptyResult(
  headline: string,
  detail: string,
): InrResult {
  return {
    inr: null,
    formattedInr: '',
    statusHeadline: headline,
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function calculateInr(input: InrInput): InrResult {
  const patient = parseNumber(input.patientPtText);
  const control = parseNumber(input.controlPtText);
  const isi = parseNumber(input.isiText);

  if (patient === null || control === null || isi === null) {
    return emptyResult(
      'Enter PT values',
      'Enter patient PT (sec), control/mean normal PT (sec), and ISI to compute INR.',
    );
  }

  const raw = inrFromPts(patient, control, isi);
  const rounded = roundInr(raw);

  return {
    inr: rounded,
    formattedInr: formatInr(raw),
    statusHeadline: 'INR',
    statusDetail: `INR = (${patient} ÷ ${control})^${isi} = ${formatInr(raw)}.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
