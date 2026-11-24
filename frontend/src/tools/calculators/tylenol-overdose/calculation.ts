/**
 * Tylenol Overdose Calculator — UI stub (engine commit replaces with formulas).
 * ADR-018: pure module; no React/HTTP/Mongo. No FX.
 * Educational only — Rumack–Matthew / published APAP guidance; never invent thresholds.
 */

import type { TylenolOverdoseInput, TylenolOverdoseResult } from './types';

export const SOURCE_NOTE =
  'Educational Rumack–Matthew nomogram framing for single acute oral acetaminophen ingestion (probable line 200 µg/mL at 4 h; US treatment/possible line 150 µg/mL at 4 h; both decline with a 4-hour half-life). Classic timed window 4–24 h. µg/mL ≡ mg/L. IV, unknown-time, and out-of-window exposures are not scored on this plot.';

export const DISCLAIMER =
  'Always double-check the calculations, the dosing information, and the contraindications on the leaflet. Consult your health provider before administering. Educational only — not a diagnosis, treatment order, or safe-at-home determination. In any suspected overdose, contact Poison Control (1-800-222-1222 in the US) or emergency services immediately.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function emptyResult(
  partial?: Partial<TylenolOverdoseResult>,
): TylenolOverdoseResult {
  return {
    weightKg: null,
    hoursAfterIngestion: null,
    serumLevelUgPerMl: null,
    pathway: 'incomplete',
    treatmentLineUgPerMl: null,
    probableLineUgPerMl: null,
    aboveTreatmentLine: null,
    aboveProbableLine: null,
    emergencyReferralRequired: true,
    statusHeadline: 'Enter timed oral level data',
    statusDetail:
      'Suspected acetaminophen exposure requires immediate poison-center or emergency evaluation regardless of incomplete fields. The Rumack–Matthew reference plot is shown only for single acute oral ingestions with a serum level drawn in the classic 4–24 hour window.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

/** Stub — real nomogram math lands in the engine commit. */
export function calculateTylenolOverdose(
  _input: TylenolOverdoseInput,
): TylenolOverdoseResult {
  return emptyResult();
}
