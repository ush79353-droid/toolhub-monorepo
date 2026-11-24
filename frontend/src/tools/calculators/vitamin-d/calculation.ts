/**
 * Vitamin D Calculator — UI stub (engine commit replaces with NIH ODS / DRI math).
 */

import type { VitaminDInput, VitaminDResult } from './types';

export const SOURCE_NOTE =
  'NIH ODS Vitamin D fact sheet / IOM DRI — engine wiring pending.';

export const DISCLAIMER =
  'Always double-check the calculations, the dosing information, and the contraindications on the leaflet. Consult your health provider before administering any medication or supplements. This tool cannot replace real medical consultation.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatMeasure(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  return value.toFixed(digits).replace(/\.?0+$/, '');
}

export function calculateVitaminD(_input: VitaminDInput): VitaminDResult {
  return {
    ageYears: null,
    dri: null,
    serum: null,
    statusHeadline: 'Enter age',
    statusDetail:
      'Enter chronological age for the vitamin D AI/RDA lookup. Optional serum 25(OH)D uses published status bands only.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
