/**
 * Absolute reticulocyte count (ARC) — educational hematology arithmetic (ADR-018).
 *
 * True ARC (cells/µL) = RBC (cells/µL) × (reticulocyte % ÷ 100).
 * Corrected reticulocyte % = reticulocyte % × (patient Hct ÷ reference Hct).
 *
 * This worksheet does not accept a direct RBC count. When only hematocrit is
 * available, ARC is estimated by scaling a reference RBC of 5,000,000 cells/µL at
 * the reference hematocrit (default 45%). ponytail: assumes normocytic RBC mass
 * tracks hematocrit linearly — upgrade path is an optional direct RBC field.
 *
 * Sources: standard reticulocyte arithmetic; NEJM / lab-medicine teaching.
 */

import type {
  AbsoluteReticulocyteCountInput,
  AbsoluteReticulocyteCountResult,
} from './types';

/** Reference RBC at reference hematocrit (5 M/µL = 5,000,000 cells/µL at Hct 45%). */
export const REFERENCE_RBC_CELLS_PER_MICROLITER = 5_000_000;

export const ASSUMPTION_NOTE =
  'Without a measured RBC count, this tool estimates RBC as (patient Hct ÷ reference Hct) × 5,000,000 cells/µL, then applies ARC = RBC × (reticulocyte % ÷ 100). Corrected reticulocyte % = retic % × (Hct ÷ reference Hct). Enter a laboratory RBC when available for a true count.';

export const SOURCE_NOTE =
  'Absolute reticulocyte count (cells/µL) = red blood cell count (cells/µL) × (reticulocyte % ÷ 100). Educational arithmetic only.';

export const DISCLAIMER =
  'Educational hematology calculator — not a diagnosis, treatment decision, or laboratory report.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Corrected reticulocyte % for anemia (retic % scaled by Hct ratio). */
export function correctedReticulocytePercent(
  reticulocytePercent: number,
  hematocritPercent: number,
  referenceHematocritPercent: number,
): number {
  if (!(referenceHematocritPercent > 0)) {
    throw new Error('Reference hematocrit must be positive.');
  }
  return reticulocytePercent * (hematocritPercent / referenceHematocritPercent);
}

/**
 * True ARC from a measured RBC count (cells/µL).
 * @throws when RBC ≤ 0 or reticulocyte % ∉ [0, 100]
 */
export function absoluteReticulocyteCountFromRbc(
  rbcCellsPerMicroliter: number,
  reticulocytePercent: number,
): number {
  if (!(Number.isFinite(rbcCellsPerMicroliter) && rbcCellsPerMicroliter > 0)) {
    throw new Error('RBC must be a positive finite number.');
  }
  if (
    !(
      Number.isFinite(reticulocytePercent) &&
      reticulocytePercent >= 0 &&
      reticulocytePercent <= 100
    )
  ) {
    throw new Error('Reticulocyte percentage must be between 0 and 100.');
  }
  return rbcCellsPerMicroliter * (reticulocytePercent / 100);
}

/**
 * ARC (cells/µL) estimated from hematocrit ratio and reference RBC anchor.
 */
export function absoluteReticulocyteCountFromHematocrit(
  hematocritPercent: number,
  referenceHematocritPercent: number,
  reticulocytePercent: number,
  referenceRbcCellsPerMicroliter = REFERENCE_RBC_CELLS_PER_MICROLITER,
): number {
  if (!(Number.isFinite(hematocritPercent) && hematocritPercent > 0)) {
    throw new Error('Hematocrit must be a positive finite number.');
  }
  if (!(referenceHematocritPercent > 0)) {
    throw new Error('Reference hematocrit must be positive.');
  }
  if (
    !(
      Number.isFinite(reticulocytePercent) &&
      reticulocytePercent >= 0 &&
      reticulocytePercent <= 100
    )
  ) {
    throw new Error('Reticulocyte percentage must be between 0 and 100.');
  }
  const estimatedRbc =
    (hematocritPercent / referenceHematocritPercent) *
    referenceRbcCellsPerMicroliter;
  return absoluteReticulocyteCountFromRbc(estimatedRbc, reticulocytePercent);
}

export function calculateAbsoluteReticulocyteCount(
  input: AbsoluteReticulocyteCountInput,
): AbsoluteReticulocyteCountResult {
  const hct = parseNumber(input.hematocritPercentText);
  const refHct = parseNumber(input.referenceHematocritPercentText);
  const reticPct = parseNumber(input.reticulocytePercentText);

  const empty = {
    absoluteCountCellsPerMicroliter: null,
    correctedReticulocytePercent: null,
    assumptionNote: ASSUMPTION_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (hct === null || refHct === null || reticPct === null) {
    return {
      ...empty,
      statusHeadline: 'Enter hematocrit and reticulocyte %',
      statusDetail:
        'Enter patient hematocrit (%), reference (normal) hematocrit (%), and reticulocyte differential (%) to compute the absolute reticulocyte count.',
    };
  }

  if (!(hct > 0 && hct <= 100)) {
    return {
      ...empty,
      statusHeadline: 'Invalid hematocrit',
      statusDetail: 'Patient hematocrit must be between 0 and 100% (exclusive of 0).',
    };
  }

  if (!(refHct > 0 && refHct <= 100)) {
    return {
      ...empty,
      statusHeadline: 'Invalid reference hematocrit',
      statusDetail: 'Reference hematocrit must be between 0 and 100% (exclusive of 0).',
    };
  }

  if (!(reticPct >= 0 && reticPct <= 100)) {
    return {
      ...empty,
      statusHeadline: 'Invalid reticulocyte %',
      statusDetail: 'Reticulocyte percentage must be between 0 and 100.',
    };
  }

  const correctedPct = correctedReticulocytePercent(reticPct, hct, refHct);
  const arc = absoluteReticulocyteCountFromHematocrit(hct, refHct, reticPct);

  return {
    absoluteCountCellsPerMicroliter: arc,
    correctedReticulocytePercent: correctedPct,
    statusHeadline: 'Absolute reticulocyte count',
    statusDetail: `Corrected retic % = ${formatPercent(correctedPct)}. Estimated ARC = ${formatCellsPerUl(arc)} cells/µL (RBC estimate from Hct ratio × ${formatCellsPerUl(REFERENCE_RBC_CELLS_PER_MICROLITER)} reference cells/µL).`,
    assumptionNote: ASSUMPTION_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatPercent(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
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