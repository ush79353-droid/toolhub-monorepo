/**
 * Continuous MIPI / MIPI-b — educational (ADR-018).
 *
 * Source: Hoster E et al. A new prognostic index (MIPI) for patients with
 * advanced-stage mantle cell lymphoma. Blood. 2008;111(2):558–565.
 *
 * MIPI = 0.03535×age + 0.6978(if ECOG>1) + 1.367×log10(LDH/ULN)
 *      + 0.9393×log10(WBC per 10⁶/L)
 * MIPI-b adds 0.02142×Ki-67(%).
 *
 * WBC screenshot unit is ×1000/µL → multiply by 1000 for per-µL (10⁶/L) count.
 */

import type { MipiInput, MipiResult, MipiRiskGroup, MipiVariant } from './types';

export const COEF_AGE = 0.03535;
export const COEF_ECOG = 0.6978;
export const COEF_LDH = 1.367;
export const COEF_WBC = 0.9393;
export const COEF_KI67 = 0.02142;

/** Convert ×1000/µL entry → WBC per µL (= per 10⁶/L). */
export const WBC_SCREENSHOT_TO_PER_UL = 1000;

export const MIPI_LOW_MAX = 5.7;
export const MIPI_INT_MAX = 6.2;
export const MIPIB_INT_MAX = 6.5;

export const SOURCE_NOTE =
  'Continuous MIPI / MIPI-b (Hoster et al., Blood 2008). WBC enters as count per 10⁶/L (per µL); screenshot ×1000/µL values are multiplied by 1000 before log10.';

export const DISCLAIMER =
  'Educational mantle cell lymphoma prognostic index only — not treatment planning or individualized prognosis.';

export function parseNumber(text: string): number | null {
  const t = text.trim();
  if (t === '') return null;
  const n = Number(t.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

export function formatScore(score: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(score);
}

export function wbcPerUlFromScreenshotThousands(thousandsPerUl: number): number {
  return thousandsPerUl * WBC_SCREENSHOT_TO_PER_UL;
}

export function computeContinuousMipi(params: {
  ageYears: number;
  ecogTwoToFour: boolean;
  ldh: number;
  uln: number;
  wbcPerUl: number;
  ki67Percent: number | null;
}): { score: number; variant: MipiVariant } {
  const { ageYears, ecogTwoToFour, ldh, uln, wbcPerUl, ki67Percent } = params;
  const ratio = ldh / uln;
  let score =
    COEF_AGE * ageYears +
    (ecogTwoToFour ? COEF_ECOG : 0) +
    COEF_LDH * Math.log10(ratio) +
    COEF_WBC * Math.log10(wbcPerUl);

  if (ki67Percent != null) {
    score += COEF_KI67 * ki67Percent;
    return { score, variant: 'mipi_b' };
  }
  return { score, variant: 'mipi' };
}

export function riskGroupForScore(score: number, variant: MipiVariant): MipiRiskGroup {
  if (score < MIPI_LOW_MAX) return 'low';
  const intMax = variant === 'mipi_b' ? MIPIB_INT_MAX : MIPI_INT_MAX;
  if (score < intMax) return 'intermediate';
  return 'high';
}

export function riskGroupLabel(group: MipiRiskGroup, variant: MipiVariant): string {
  const name = variant === 'mipi_b' ? 'MIPI-b' : 'MIPI';
  switch (group) {
    case 'low':
      return `${name} low risk (< ${MIPI_LOW_MAX})`;
    case 'intermediate': {
      const hi = variant === 'mipi_b' ? MIPIB_INT_MAX : MIPI_INT_MAX;
      return `${name} intermediate risk (${MIPI_LOW_MAX}–<${hi})`;
    }
    case 'high': {
      const cut = variant === 'mipi_b' ? MIPIB_INT_MAX : MIPI_INT_MAX;
      return `${name} high risk (≥ ${cut})`;
    }
    default:
      return '';
  }
}

export function medianOsNote(group: MipiRiskGroup, variant: MipiVariant): string {
  if (variant === 'mipi_b') {
    switch (group) {
      case 'low':
        return 'Published MIPI-b low-risk cohort: median OS not reached.';
      case 'intermediate':
        return 'Published MIPI-b intermediate cohort: median OS ≈ 58 months.';
      case 'high':
        return 'Published MIPI-b high-risk cohort: median OS ≈ 37 months.';
      default:
        return '';
    }
  }
  switch (group) {
    case 'low':
      return 'Published MIPI low-risk cohort: median OS not reached (≈60% 5-year OS).';
    case 'intermediate':
      return 'Published MIPI intermediate cohort: median OS ≈ 51 months.';
    case 'high':
      return 'Published MIPI high-risk cohort: median OS ≈ 29 months.';
    default:
      return '';
  }
}

export function calculateMipi(input: MipiInput): MipiResult {
  const empty: MipiResult = {
    score: null,
    formattedScore: '',
    variant: input.knowKi67 ? 'mipi_b' : 'mipi',
    riskGroup: null,
    riskGroupLabel: '',
    medianOsNote: '',
    statusHeadline: 'Enter age, LDH, ULN, and WBC',
    statusDetail: 'Continuous MIPI needs age, ECOG band, serum LDH, ULN, and WBC.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const age = parseNumber(input.ageYearsText);
  const ldh = parseNumber(input.serumLdhText);
  const uln = parseNumber(input.ldhUlnText);
  const wbcThousands = parseNumber(input.wbcThousandPerUlText);
  const ki67 = input.knowKi67 ? parseNumber(input.ki67PercentText) : null;

  if (age === null || ldh === null || uln === null || wbcThousands === null) {
    return empty;
  }
  if (!(age >= 0 && age <= 120)) return empty;
  if (!(ldh > 0) || !(uln > 0) || !(wbcThousands > 0)) return empty;
  if (input.knowKi67 && (ki67 === null || !(ki67 >= 0 && ki67 <= 100))) {
    return {
      ...empty,
      statusHeadline: 'Enter Ki-67 %',
      statusDetail: 'MIPI-b needs Ki-67 between 0 and 100%.',
    };
  }

  const wbcPerUl = wbcPerUlFromScreenshotThousands(wbcThousands);
  const { score, variant } = computeContinuousMipi({
    ageYears: age,
    ecogTwoToFour: input.ecog === 'two_four',
    ldh,
    uln,
    wbcPerUl,
    ki67Percent: input.knowKi67 ? ki67 : null,
  });

  const group = riskGroupForScore(score, variant);
  return {
    score,
    formattedScore: formatScore(score),
    variant,
    riskGroup: group,
    riskGroupLabel: riskGroupLabel(group, variant),
    medianOsNote: medianOsNote(group, variant),
    statusHeadline: riskGroupLabel(group, variant),
    statusDetail: medianOsNote(group, variant),
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
