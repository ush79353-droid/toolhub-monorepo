/**
 * Urine anion gap (UAG) — educational urine electrolyte arithmetic (ADR-018).
 *
 *   UAG (mEq/L) = (Na⁺ + K⁺) − Cl⁻
 *
 * Monovalent ions: mEq/L ≡ mmol/L numerically. Negative results are kept.
 * Sources: standard nephrology teaching for urine AG (not serum AG).
 */

import type { UrineAnionGapInput, UrineAnionGapResult } from './types';

export const SOURCE_NOTE =
  'Urine AG = (urine Na⁺ + urine K⁺) − urine Cl⁻ (mEq/L ≡ mmol/L). Distinct from serum anion gap. Educational only.';

export const DISCLAIMER =
  'Educational urine electrolyte worksheet — not a diagnosis or serum anion-gap report.';

export const UNIT_NOTE =
  'In this case, the values in mEq/L are equal to those in mmol/L. If you have values in mmol/L, type them in.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Core UAG formula; preserves negative results. */
export function urineAnionGap(
  sodium: number,
  potassium: number,
  chloride: number,
): number {
  if (
    !Number.isFinite(sodium) ||
    !Number.isFinite(potassium) ||
    !Number.isFinite(chloride)
  ) {
    throw new Error('Electrolytes must be finite numbers.');
  }
  return sodium + potassium - chloride;
}

export function formatGap(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  const rounded = Math.round(value * 10) / 10;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
    useGrouping: false,
  }).format(rounded);
}

function emptyResult(partial?: Partial<UrineAnionGapResult>): UrineAnionGapResult {
  return {
    urineAnionGap: null,
    formattedGap: '',
    statusHeadline: 'Enter urinary Na⁺, K⁺, and Cl⁻.',
    statusDetail: 'Urine anion gap updates when all three values are valid.',
    unitNote: UNIT_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateUrineAnionGap(
  input: UrineAnionGapInput,
): UrineAnionGapResult {
  const na = parseNumber(input.sodiumText);
  const k = parseNumber(input.potassiumText);
  const cl = parseNumber(input.chlorideText);

  if (na === null || k === null || cl === null) {
    return emptyResult();
  }

  try {
    const gap = urineAnionGap(na, k, cl);
    if (!Number.isFinite(gap)) {
      return emptyResult({
        statusHeadline: 'Unable to compute urine anion gap.',
        statusDetail: 'Result was non-finite.',
      });
    }
    return {
      urineAnionGap: gap,
      formattedGap: formatGap(gap),
      statusHeadline: 'Urine anion gap',
      statusDetail: `UAG = (${na} + ${k}) − ${cl} = ${formatGap(gap)} mEq/L.`,
      unitNote: UNIT_NOTE,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  } catch {
    return emptyResult({
      statusHeadline: 'Unable to compute urine anion gap.',
      statusDetail: 'Check that all electrolytes are valid finite numbers.',
    });
  }
}
