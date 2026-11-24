/**
 * Hct/Hgb ratio — educational hematology arithmetic (ADR-018).
 *
 * Ratio = hematocrit (%) ÷ hemoglobin (g/dL). The teaching “rule of three”
 * approximates Hct ≈ 3 × Hb (g/dL), so the ratio is often near 3.
 *
 * Sources: standard CBC teaching (rule of three); not a diagnostic cutoff.
 */

import type {
  HematocritHemoglobinRatioInput,
  HematocritHemoglobinRatioResult,
} from './types';

/** Approximate Hct/Hb factor used when inputs are incomplete (screenshot default). */
export const APPROXIMATE_RULE_OF_THREE = 3;

export const SOURCE_NOTE =
  'Hct/Hgb ratio = hematocrit (%) ÷ hemoglobin (g/dL). The “rule of three” teaching approximation is Hct ≈ 3 × Hb (g/dL). Educational only.';

export const DISCLAIMER =
  'Educational hematology calculator — not a diagnosis, treatment decision, or laboratory report.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Hct ÷ Hb. Throws when hemoglobin ≤ 0. */
export function hctToHgbRatio(
  hematocritPercent: number,
  hemoglobinGdl: number,
): number {
  if (!(Number.isFinite(hemoglobinGdl) && hemoglobinGdl > 0)) {
    throw new Error('Hemoglobin must be greater than zero.');
  }
  if (!Number.isFinite(hematocritPercent)) {
    throw new Error('Hematocrit must be finite.');
  }
  return hematocritPercent / hemoglobinGdl;
}

export function formatRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return '';
  const rounded = Math.round(ratio * 100) / 100;
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateHematocritHemoglobinRatio(
  input: HematocritHemoglobinRatioInput,
): HematocritHemoglobinRatioResult {
  const hct = parseNumber(input.hematocritPercentText);
  const hgb = parseNumber(input.hemoglobinGdlText);

  if (hct === null || hgb === null) {
    return {
      ratio: APPROXIMATE_RULE_OF_THREE,
      isApproximateRuleOfThree: true,
      formattedRatio: String(APPROXIMATE_RULE_OF_THREE),
      statusHeadline: 'Approximate rule of three',
      statusDetail:
        'Enter hematocrit (%) and hemoglobin (g/dL) to compute Hct ÷ Hb. Until both are entered, the ratio shows the teaching approximation of 3.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const ratio = hctToHgbRatio(hct, hgb);
  return {
    ratio,
    isApproximateRuleOfThree: false,
    formattedRatio: formatRatio(ratio),
    statusHeadline: 'Hct/Hgb ratio',
    statusDetail: `Hematocrit ${hct}% ÷ hemoglobin ${hgb} g/dL = ${formatRatio(ratio)}. The teaching rule of three is approximate only.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
