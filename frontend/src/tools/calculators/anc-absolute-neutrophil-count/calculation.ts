/**
 * Absolute neutrophil count (ANC) — educational hematology arithmetic (ADR-018).
 *
 *   ANC (×10³/µL) = WBC (×10³/µL) × ((segs % + bands %) ÷ 100)
 *
 * Reporting WBC and ANC in ×10³/µL uses the same numeric value as ×10⁹/L
 * (thousands per microliter ≡ billions per liter for these conventional units).
 *
 * Sources: standard CBC differential arithmetic; neutrophil granulocyte + band forms.
 */

import type {
  AncAbsoluteNeutrophilCountInput,
  AncAbsoluteNeutrophilCountResult,
} from './types';

export const UNIT_EQUIVALENCE_NOTE =
  'Note that ×10³/µL is the same as ×10⁹/L.';

export const SOURCE_NOTE =
  'Absolute neutrophil count = white blood cell count × ((neutrophil segs % + band forms %) ÷ 100), with WBC and ANC in ×10³/µL (equivalent to ×10⁹/L). Educational arithmetic only.';

export const DISCLAIMER =
  'Educational hematology calculator — not a diagnosis, treatment decision, or laboratory report.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function isPercentInRange(p: number): boolean {
  return Number.isFinite(p) && p >= 0 && p <= 100;
}

/**
 * Core ANC formula.
 * @throws if WBC is non-finite or ≤ 0, percents out of range, or segs+bands > 100
 */
export function absoluteNeutrophilCount(
  wbcTimes10e3PerMicroliter: number,
  segsPercent: number,
  bandsPercent: number,
): number {
  if (!(Number.isFinite(wbcTimes10e3PerMicroliter) && wbcTimes10e3PerMicroliter > 0)) {
    throw new Error('WBC must be a positive finite number.');
  }
  if (!isPercentInRange(segsPercent)) {
    throw new Error('Segs percentage must be between 0 and 100.');
  }
  if (!isPercentInRange(bandsPercent)) {
    throw new Error('Bands percentage must be between 0 and 100.');
  }
  const combined = segsPercent + bandsPercent;
  if (combined > 100) {
    throw new Error('Segs and bands percentages combined must not exceed 100.');
  }
  return wbcTimes10e3PerMicroliter * (combined / 100);
}

export function calculateAncAbsoluteNeutrophilCount(
  input: AncAbsoluteNeutrophilCountInput,
): AncAbsoluteNeutrophilCountResult {
  const wbc = parseNumber(input.wbcText);
  const segsPct = parseNumber(input.segsPercentText);
  const bandsPct = parseNumber(input.bandsPercentText);

  const empty = {
    absoluteCount: null,
    absoluteCountPerLiter: null,
    unitEquivalenceNote: UNIT_EQUIVALENCE_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (wbc === null || segsPct === null || bandsPct === null) {
    return {
      ...empty,
      statusHeadline: 'Enter WBC, segs %, and bands %',
      statusDetail:
        'Enter white blood cell count (×10³/µL), neutrophil granulocytes (segs %), and neutrophilic band forms (bands %) to compute the absolute neutrophil count.',
    };
  }

  if (!(wbc > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid WBC',
      statusDetail: 'White blood cell count must be positive.',
    };
  }

  if (!isPercentInRange(segsPct)) {
    return {
      ...empty,
      statusHeadline: 'Invalid segs %',
      statusDetail: 'Neutrophil granulocytes (segs) percentage must be between 0 and 100.',
    };
  }

  if (!isPercentInRange(bandsPct)) {
    return {
      ...empty,
      statusHeadline: 'Invalid bands %',
      statusDetail:
        'Neutrophilic band forms (bands) percentage must be between 0 and 100.',
    };
  }

  if (segsPct + bandsPct > 100) {
    return {
      ...empty,
      statusHeadline: 'Invalid differential',
      statusDetail:
        'Segs and bands percentages combined must not exceed 100%.',
    };
  }

  const absoluteCount = absoluteNeutrophilCount(wbc, segsPct, bandsPct);
  const combined = segsPct + bandsPct;

  return {
    absoluteCount,
    absoluteCountPerLiter: absoluteCount,
    statusHeadline: 'Absolute neutrophil count',
    statusDetail: `ANC = ${wbc} × ((${segsPct} + ${bandsPct}) ÷ 100) = ${wbc} × (${combined} ÷ 100) = ${formatAnc(absoluteCount)} ×10³/µL (${formatAnc(absoluteCount)} ×10⁹/L).`,
    unitEquivalenceNote: UNIT_EQUIVALENCE_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** Display formatting for ANC values in ×10³/µL. */
export function formatAnc(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  const maxFrac = abs >= 100 ? 2 : abs >= 1 ? 3 : 4;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}