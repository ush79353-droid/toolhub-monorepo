/**
 * MME Calculator — UI stub (engine commit replaces with CDC 2022 math).
 * ADR-018: keep presentation compiling without inventing opioid factors here.
 */

import type { MmeInput, MmeResult } from './types';

export const SOURCE_NOTE =
  'CDC Clinical Practice Guideline for Prescribing Opioids for Pain — United States, 2022 (MMWR).';

export const DISCLAIMER =
  'Educational MME comparison only — not for selecting a replacement opioid dose, tapering, or prescribing. Confirm product labeling with a licensed clinician.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatMme(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

function unscored(headline: string, detail: string): MmeResult {
  return {
    opioidId: null,
    doseCanonical: null,
    conversionFactor: null,
    mme: null,
    statusHeadline: headline,
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** Stub: blank until engine wires CDC conversion factors. */
export function calculateMme(_input: MmeInput): MmeResult {
  return unscored(
    'Enter dose',
    'Enter the daily opioid amount to see morphine milligram equivalents (engine pending).',
  );
}
