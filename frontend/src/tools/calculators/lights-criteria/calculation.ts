/**
 * Light's criteria — pleural fluid exudate vs transudate (educational).
 *
 * Classic Light 1972 strict inequalities (any one → exudate):
 *   1) pleural protein / serum protein > 0.5
 *   2) pleural LDH / serum LDH > 0.6
 *   3) pleural LDH > (2/3) × serum LDH upper reference limit
 *
 * Incomplete inputs: report exudate as soon as any evaluable criterion is met;
 * do not call transudate until all three criteria can be assessed.
 *
 * Protein g/L ↔ g/dL: g/L = 10 × g/dL (ratio unit-invariant when both match).
 */

import type {
  LightsClassification,
  LightsCriteriaInput,
  LightsCriteriaResult,
  ProteinUnit,
} from './types';

export const SOURCE_NOTE =
  "Light's criteria (Light et al., 1972): exudate if pleural/serum protein >0.5, pleural/serum LDH >0.6, or pleural LDH >(2/3)× serum LDH upper limit — strict inequalities. Educational only.";

export const DISCLAIMER =
  'Educational worksheet only — not a diagnosis of effusion cause, procedure order, or treatment plan. Confirm with clinical context and your laboratory reference ranges.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Normalize protein to g/dL for storage/display consistency. */
export function proteinToGdl(value: number, unit: ProteinUnit): number {
  return unit === 'g_l' ? value / 10 : value;
}

export function proteinFromGdl(gDl: number, unit: ProteinUnit): number {
  return unit === 'g_l' ? gDl * 10 : gDl;
}

export function formatMeasure(value: number | null, digits = 3): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

function emptyBase(): Omit<
  LightsCriteriaResult,
  'classification' | 'statusHeadline' | 'statusDetail'
> {
  return {
    proteinRatio: null,
    ldhRatio: null,
    twoThirdsUpperLimit: null,
    proteinCriterionMet: null,
    ldhRatioCriterionMet: null,
    ldhAbsoluteCriterionMet: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function calculateLightsCriteria(
  input: LightsCriteriaInput,
): LightsCriteriaResult {
  const pleuralProteinRaw = parseNumber(input.pleuralProteinText);
  const serumProteinRaw = parseNumber(input.serumProteinText);
  const pleuralLdh = parseNumber(input.pleuralLdhText);
  const serumLdh = parseNumber(input.serumLdhText);
  const upperLimit = parseNumber(input.ldhUpperLimitText);

  if (
    pleuralProteinRaw !== null &&
    pleuralProteinRaw < 0
  ) {
    return {
      ...emptyBase(),
      classification: 'invalid',
      statusHeadline: 'Invalid pleural protein',
      statusDetail: 'Pleural fluid protein cannot be negative.',
    };
  }
  if (serumProteinRaw !== null && serumProteinRaw < 0) {
    return {
      ...emptyBase(),
      classification: 'invalid',
      statusHeadline: 'Invalid serum protein',
      statusDetail: 'Serum protein cannot be negative.',
    };
  }
  if (pleuralLdh !== null && pleuralLdh < 0) {
    return {
      ...emptyBase(),
      classification: 'invalid',
      statusHeadline: 'Invalid pleural LDH',
      statusDetail: 'Pleural fluid LDH cannot be negative.',
    };
  }
  if (serumLdh !== null && serumLdh < 0) {
    return {
      ...emptyBase(),
      classification: 'invalid',
      statusHeadline: 'Invalid serum LDH',
      statusDetail: 'Serum LDH cannot be negative.',
    };
  }
  if (upperLimit !== null && upperLimit < 0) {
    return {
      ...emptyBase(),
      classification: 'invalid',
      statusHeadline: 'Invalid LDH upper limit',
      statusDetail: 'Serum LDH upper limit cannot be negative.',
    };
  }

  let proteinRatio: number | null = null;
  let proteinCriterionMet: boolean | null = null;
  if (pleuralProteinRaw !== null && serumProteinRaw !== null) {
    if (!(serumProteinRaw > 0)) {
      return {
        ...emptyBase(),
        classification: 'invalid',
        statusHeadline: 'Protein ratio undefined',
        statusDetail:
          'Serum protein must be greater than zero to compute the protein ratio.',
      };
    }
    // Same unit on both fields → ratio identical in g/dL or g/L.
    proteinRatio = pleuralProteinRaw / serumProteinRaw;
    proteinCriterionMet = proteinRatio > 0.5;
  }

  let ldhRatio: number | null = null;
  let ldhRatioCriterionMet: boolean | null = null;
  if (pleuralLdh !== null && serumLdh !== null) {
    if (!(serumLdh > 0)) {
      return {
        ...emptyBase(),
        proteinRatio,
        proteinCriterionMet,
        classification: 'invalid',
        statusHeadline: 'LDH ratio undefined',
        statusDetail:
          'Serum LDH must be greater than zero to compute the LDH ratio.',
      };
    }
    ldhRatio = pleuralLdh / serumLdh;
    ldhRatioCriterionMet = ldhRatio > 0.6;
  }

  let twoThirdsUpperLimit: number | null = null;
  let ldhAbsoluteCriterionMet: boolean | null = null;
  if (pleuralLdh !== null && upperLimit !== null) {
    twoThirdsUpperLimit = (2 / 3) * upperLimit;
    ldhAbsoluteCriterionMet = pleuralLdh > twoThirdsUpperLimit;
  }

  const criteria = [
    proteinCriterionMet,
    ldhRatioCriterionMet,
    ldhAbsoluteCriterionMet,
  ];
  const anyMet = criteria.some((c) => c === true);
  const allAssessed = criteria.every((c) => c !== null);
  const noneMet = allAssessed && criteria.every((c) => c === false);

  let classification: LightsClassification;
  let statusHeadline: string;
  let statusDetail: string;

  if (anyMet) {
    classification = 'exudate';
    statusHeadline = 'Exudate (Light’s criteria met)';
    const parts: string[] = [];
    if (proteinCriterionMet)
      parts.push(`protein ratio ${formatMeasure(proteinRatio, 3)} > 0.5`);
    if (ldhRatioCriterionMet)
      parts.push(`LDH ratio ${formatMeasure(ldhRatio, 3)} > 0.6`);
    if (ldhAbsoluteCriterionMet)
      parts.push(
        `pleural LDH ${formatMeasure(pleuralLdh, 1)} U/L > ⅔×ULN ${formatMeasure(twoThirdsUpperLimit, 1)}`,
      );
    statusDetail = `Exudative by ${parts.join('; ')}. Strict inequalities — equality is not exudate. Educational only.`;
  } else if (noneMet) {
    classification = 'transudate';
    statusHeadline = 'Transudate (no Light’s criterion met)';
    statusDetail = `Protein ratio ${formatMeasure(proteinRatio, 3)} (≤0.5), LDH ratio ${formatMeasure(ldhRatio, 3)} (≤0.6), pleural LDH ${formatMeasure(pleuralLdh, 1)} ≤ ⅔×ULN ${formatMeasure(twoThirdsUpperLimit, 1)}. Educational only.`;
  } else {
    classification = 'incomplete';
    statusHeadline = 'Enter values to classify';
    statusDetail =
      'Exudate is reported as soon as any one evaluable criterion is met. Transudate is only reported when protein ratio, LDH ratio, and absolute LDH (vs ⅔×ULN) can all be assessed and none meet the exudate cut-offs.';
  }

  return {
    proteinRatio:
      proteinRatio != null ? Math.round(proteinRatio * 1000) / 1000 : null,
    ldhRatio: ldhRatio != null ? Math.round(ldhRatio * 1000) / 1000 : null,
    twoThirdsUpperLimit:
      twoThirdsUpperLimit != null
        ? Math.round(twoThirdsUpperLimit * 10) / 10
        : null,
    proteinCriterionMet,
    ldhRatioCriterionMet,
    ldhAbsoluteCriterionMet,
    classification,
    statusHeadline,
    statusDetail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
