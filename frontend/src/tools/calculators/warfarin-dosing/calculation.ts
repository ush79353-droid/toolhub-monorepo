/**
 * Warfarin dosing — educational maintenance adjustment (ADR-018).
 *
 * Stub for UI commit: returns incomplete empty-state only.
 * Engine commit replaces with UW Medicine / ACCP published tables.
 */

import type { WarfarinDosingInput, WarfarinDosingResult } from './types';

export const SOURCE_NOTE =
  'Educational worksheet only. Maintenance bands and bleeding pathways are wired in the engine commit from published clinic/ACCP tables.';

export const DISCLAIMER =
  'Educational anticoagulation worksheet — not a prescription, reversal order, or substitute for anticoagulation-clinic judgment.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function emptyIncomplete(detail: string): WarfarinDosingResult {
  return {
    kind: 'incomplete',
    inr: null,
    weeklyDoseMg: null,
    adjustedWeeklyLowMg: null,
    adjustedWeeklyHighMg: null,
    adjustedDailyLowMg: null,
    adjustedDailyHighMg: null,
    percentLow: null,
    percentHigh: null,
    statusHeadline: 'Enter INR and total dose',
    statusDetail: detail,
    actionNotes: [],
    recheckNote: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** UI stub — engine commit implements published nomogram lookup. */
export function calculateWarfarinDosing(
  _input: WarfarinDosingInput,
): WarfarinDosingResult {
  return emptyIncomplete(
    'Enter current INR and total warfarin dose. Results appear after the engine tables are wired.',
  );
}
