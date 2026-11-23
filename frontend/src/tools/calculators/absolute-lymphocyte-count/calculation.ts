/**
 * Absolute lymphocyte count (ALC) — educational hematology arithmetic (ADR-018).
 *
 *   ALC (×10³/µL) = WBC (×10³/µL) × (lymphocyte % ÷ 100)
 *
 * Reporting WBC and ALC in ×10³/µL uses the same numeric value as ×10⁹/L
 * (thousands per microliter ≡ billions per liter for these conventional units).
 *
 * cells/µL = ALC (×10³/µL) × 1000 — do not confuse “thousands” with absolute cells.
 *
 * Sources: standard CBC differential arithmetic; NEJM / lab-medicine teaching.
 */

import type {
  AbsoluteLymphocyteCountInput,
  AbsoluteLymphocyteCountResult,
} from './types';

export const UNIT_EQUIVALENCE_NOTE =
  'Note that ×10³/µL is the same as ×10⁹/L.';

export const CELLS_PER_MICROLITER_NOTE =
  'To express ALC in cells/µL (not thousands), multiply the ×10³/µL value by 1000. Example: 1.5 ×10³/µL = 1500 cells/µL.';

export const SOURCE_NOTE =
  'Absolute lymphocyte count = white blood cell count × (lymphocyte percentage ÷ 100), with WBC and ALC in ×10³/µL (equivalent to ×10⁹/L). Educational arithmetic only.';

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
 * Core ALC formula.
 * @throws if WBC is non-finite or ≤ 0, or lymphocyte % is out of range
 */
export function absoluteLymphocyteCount(
  wbcTimes10e3PerMicroliter: number,
  lymphocytePercent: number,
): number {
  if (!(Number.isFinite(wbcTimes10e3PerMicroliter) && wbcTimes10e3PerMicroliter > 0)) {
    throw new Error('WBC must be a positive finite number.');
  }
  if (
    !(
      Number.isFinite(lymphocytePercent) &&
      lymphocytePercent >= 0 &&
      lymphocytePercent <= 100
    )
  ) {
    throw new Error('Lymphocyte percentage must be between 0 and 100.');
  }
  return wbcTimes10e3PerMicroliter * (lymphocytePercent / 100);
}

/** Convert ALC in ×10³/µL to cells/µL. */
export function alcToCellsPerMicroliter(alcTimes10e3PerMicroliter: number): number {
  return alcTimes10e3PerMicroliter * 1000;
}

export function calculateAbsoluteLymphocyteCount(
  input: AbsoluteLymphocyteCountInput,
): AbsoluteLymphocyteCountResult {
  const wbc = parseNumber(input.wbcText);
  const lymphPct = parseNumber(input.lymphocytePercentText);

  const empty = {
    absoluteCount: null,
    absoluteCountPerLiter: null,
    absoluteCountCellsPerMicroliter: null,
    unitEquivalenceNote: UNIT_EQUIVALENCE_NOTE,
    cellsPerMicroliterNote: CELLS_PER_MICROLITER_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (wbc === null || lymphPct === null) {
    return {
      ...empty,
      statusHeadline: 'Enter WBC and lymphocyte %',
      statusDetail:
        'Enter white blood cell count (×10³/µL) and lymphocyte differential (%) to compute the absolute lymphocyte count.',
    };
  }

  if (!(wbc > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid WBC',
      statusDetail: 'White blood cell count must be positive.',
    };
  }

  if (!(lymphPct >= 0 && lymphPct <= 100)) {
    return {
      ...empty,
      statusHeadline: 'Invalid lymphocyte %',
      statusDetail: 'Lymphocyte percentage must be between 0 and 100.',
    };
  }

  const absoluteCount = absoluteLymphocyteCount(wbc, lymphPct);
  const cellsPerUl = alcToCellsPerMicroliter(absoluteCount);

  return {
    absoluteCount,
    absoluteCountPerLiter: absoluteCount,
    absoluteCountCellsPerMicroliter: cellsPerUl,
    statusHeadline: 'Absolute lymphocyte count',
    statusDetail: `ALC = ${wbc} × (${lymphPct} ÷ 100) = ${formatAlc(absoluteCount)} ×10³/µL (${formatAlc(absoluteCount)} ×10⁹/L) = ${formatCellsPerUl(cellsPerUl)} cells/µL.`,
    unitEquivalenceNote: UNIT_EQUIVALENCE_NOTE,
    cellsPerMicroliterNote: CELLS_PER_MICROLITER_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** Display formatting for ALC values in ×10³/µL. */
export function formatAlc(value: number | null): string {
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

/** Integer-style display for cells/µL. */
export function formatCellsPerUl(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(value));
}