/**
 * FENa — fractional excretion of sodium (ADR-018).
 *
 * FENa (%) = 100 × (UNa × SCr) / (SNa × UCr)
 * Units: Na mmol/L (≡ mEq/L); creatinine mg/dL (matched serum/urine).
 *
 * Educational framing only — not an AKI diagnosis. Diuretics, CKD, and
 * mixed injuries limit classic <1% / >2% bands (Espiner / clinical reviews).
 */

import type { FenaInput, FenaResult } from './types';

export const SOURCE_NOTE =
  'FENa (%) = 100 × (urine Na × serum creatinine) ÷ (serum Na × urine creatinine) with matched analyte units. Classic <1% / 1–2% / >2% bands are educational only and unreliable on diuretics or advanced CKD.';

export const DISCLAIMER =
  'Educational worksheet only — not a diagnosis of AKI or volume status. Confirm with clinical context and laboratory units.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Pure FENa percent; rejects non-positive denominators. */
export function computeFenaPercent(
  urineSodiumMmolL: number,
  serumCreatinineMgDl: number,
  serumSodiumMmolL: number,
  urineCreatinineMgDl: number,
): number {
  if (!(serumSodiumMmolL > 0) || !(urineCreatinineMgDl > 0)) {
    throw new Error('Serum sodium and urine creatinine must be positive.');
  }
  if (
    !Number.isFinite(urineSodiumMmolL) ||
    !Number.isFinite(serumCreatinineMgDl) ||
    !Number.isFinite(serumSodiumMmolL) ||
    !Number.isFinite(urineCreatinineMgDl)
  ) {
    throw new Error('FENa inputs must be finite.');
  }
  return (
    (100 * (urineSodiumMmolL * serumCreatinineMgDl)) /
    (serumSodiumMmolL * urineCreatinineMgDl)
  );
}

export function interpretFenaBand(fenaPercent: number): {
  bandLabel: string;
  statusDetail: string;
} {
  if (fenaPercent < 1) {
    return {
      bandLabel: '<1%',
      statusDetail:
        'Classic teaching often associates FENa <1% with a prerenal (volume-responsive) pattern when diuretics are absent and CKD is not advanced — not a standalone AKI diagnosis.',
    };
  }
  if (fenaPercent <= 2) {
    return {
      bandLabel: '1–2%',
      statusDetail:
        'FENa 1–2% is often treated as indeterminate. Diuretics, CKD, and mixed injury blunt classic thresholds.',
    };
  }
  return {
    bandLabel: '>2%',
    statusDetail:
      'Classic teaching often associates FENa >2% with an intrinsic renal pattern when context fits — still not a standalone AKI diagnosis; diuretics and CKD limit interpretation.',
  };
}

export function calculateFena(input: FenaInput): FenaResult {
  const empty: FenaResult = {
    serumCreatinineMgDl: null,
    serumSodiumMmolL: null,
    urineCreatinineMgDl: null,
    urineSodiumMmolL: null,
    fenaPercent: null,
    bandLabel: null,
    statusHeadline: 'Enter serum and urine labs',
    statusDetail:
      'Enter serum creatinine (mg/dL), serum sodium (mmol/L), urine creatinine (mg/dL), and urine sodium (mmol/L).',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const serumCreatinineMgDl = parseNumber(input.serumCreatinineText);
  const serumSodiumMmolL = parseNumber(input.serumSodiumText);
  const urineCreatinineMgDl = parseNumber(input.urineCreatinineText);
  const urineSodiumMmolL = parseNumber(input.urineSodiumText);

  if (
    serumCreatinineMgDl === null ||
    serumSodiumMmolL === null ||
    urineCreatinineMgDl === null ||
    urineSodiumMmolL === null
  ) {
    return empty;
  }

  if (
    serumCreatinineMgDl < 0 ||
    serumSodiumMmolL < 0 ||
    urineCreatinineMgDl < 0 ||
    urineSodiumMmolL < 0
  ) {
    return {
      ...empty,
      statusHeadline: 'Invalid values',
      statusDetail: 'All lab values must be non-negative.',
    };
  }

  if (!(serumSodiumMmolL > 0) || !(urineCreatinineMgDl > 0)) {
    return {
      serumCreatinineMgDl,
      serumSodiumMmolL,
      urineCreatinineMgDl,
      urineSodiumMmolL,
      fenaPercent: null,
      bandLabel: null,
      statusHeadline: 'FENa undefined',
      statusDetail:
        'Serum sodium and urine creatinine must be greater than zero (denominator).',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const raw = computeFenaPercent(
    urineSodiumMmolL,
    serumCreatinineMgDl,
    serumSodiumMmolL,
    urineCreatinineMgDl,
  );
  const fenaPercent = Math.round(raw * 100) / 100;
  const { bandLabel, statusDetail } = interpretFenaBand(fenaPercent);

  return {
    serumCreatinineMgDl,
    serumSodiumMmolL,
    urineCreatinineMgDl,
    urineSodiumMmolL,
    fenaPercent,
    bandLabel,
    statusHeadline: `FENa ${formatFena(fenaPercent)}%`,
    statusDetail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatFena(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}
