/**
 * Absolute eosinophil count (AEC) — educational hematology arithmetic (ADR-018).
 *
 *   AEC (×10³/µL) = WBC (×10³/µL) × (eosinophil % ÷ 100)
 *
 * Reporting WBC and AEC in ×10³/µL uses the same numeric value as ×10⁹/L
 * (thousands per microliter ≡ billions per liter for these conventional units).
 *
 * Sources: standard CBC differential arithmetic; NEJM / lab-medicine teaching.
 */

import type {
  AbsoluteEosinophilCountInput,
  AbsoluteEosinophilCountResult,
} from './types';

export const UNIT_EQUIVALENCE_NOTE =
  'Note that ×10³/µL is the same as ×10⁹/L.';

export const SOURCE_NOTE =
  'Absolute eosinophil count = white blood cell count × (eosinophil percentage ÷ 100), with WBC and AEC in ×10³/µL (equivalent to ×10⁹/L). Educational arithmetic only.';

export const DISCLAIMER =
  'Educational hematology calculator — not a diagnosis, treatment decision, or laboratory report.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * Core AEC formula.
 * @throws if WBC is non-finite or ≤ 0, or eosinophil % is out of range
 */
export function absoluteEosinophilCount(
  wbcTimes10e3PerMicroliter: number,
  eosinophilPercent: number,
): number {
  if (!(Number.isFinite(wbcTimes10e3PerMicroliter) && wbcTimes10e3PerMicroliter > 0)) {
    throw new Error('WBC must be a positive finite number.');
  }
  if (
    !(
      Number.isFinite(eosinophilPercent) &&
      eosinophilPercent >= 0 &&
      eosinophilPercent <= 100
    )
  ) {
    throw new Error('Eosinophil percentage must be between 0 and 100.');
  }
  return wbcTimes10e3PerMicroliter * (eosinophilPercent / 100);
}

export function calculateAbsoluteEosinophilCount(
  input: AbsoluteEosinophilCountInput,
): AbsoluteEosinophilCountResult {
  const wbc = parseNumber(input.wbcText);
  const eosPct = parseNumber(input.eosinophilPercentText);

  const empty = {
    absoluteCount: null,
    absoluteCountPerLiter: null,
    unitEquivalenceNote: UNIT_EQUIVALENCE_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (wbc === null || eosPct === null) {
    return {
      ...empty,
      statusHeadline: 'Enter WBC and eosinophil %',
      statusDetail:
        'Enter white blood cell count (×10³/µL) and eosinophil differential (%) to compute the absolute eosinophil count.',
    };
  }

  if (!(wbc > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid WBC',
      statusDetail: 'White blood cell count must be positive.',
    };
  }

  if (!(eosPct >= 0 && eosPct <= 100)) {
    return {
      ...empty,
      statusHeadline: 'Invalid eosinophil %',
      statusDetail: 'Eosinophil percentage must be between 0 and 100.',
    };
  }

  const absoluteCount = absoluteEosinophilCount(wbc, eosPct);

  return {
    absoluteCount,
    absoluteCountPerLiter: absoluteCount,
    statusHeadline: 'Absolute eosinophil count',
    statusDetail: `AEC = ${wbc} × (${eosPct} ÷ 100) = ${formatAec(absoluteCount)} ×10³/µL (${formatAec(absoluteCount)} ×10⁹/L).`,
    unitEquivalenceNote: UNIT_EQUIVALENCE_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** Display formatting for AEC values in ×10³/µL. */
export function formatAec(value: number | null): string {
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