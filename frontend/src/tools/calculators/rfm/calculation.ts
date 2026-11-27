/**
 * Relative Fat Mass (RFM) — educational (ADR-018).
 *
 * Woolcott & Bergman (Sci Rep 2018):
 *   RFM = 64 − 20 × (height/waist) + 12 × sex
 * where sex = 1 female, 0 male. Height and waist in the same length unit.
 */

import type { LengthUnit, RfmInput, RfmResult, Sex } from './types';

export const SOURCE_NOTE =
  'RFM (%) = 64 − 20 × (height ÷ waist) + 12 × sex (female=1, male=0). Woolcott OO, Bergman RN. Scientific Reports 2018. Educational estimate — not DXA.';

export const DISCLAIMER =
  'Relative Fat Mass is a population anthropometric estimate, not a clinical body-composition diagnosis.';

const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toCm(value: number, unit: LengthUnit): number {
  switch (unit) {
    case 'cm':
      return value;
    case 'm':
      return value * 100;
    case 'in':
      return value * CM_PER_INCH;
    case 'ft':
      return value * CM_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function fromCm(cm: number, unit: LengthUnit): number {
  switch (unit) {
    case 'cm':
      return cm;
    case 'm':
      return cm / 100;
    case 'in':
      return cm / CM_PER_INCH;
    case 'ft':
      return cm / CM_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function sexCoefficient(sex: Sex): number {
  return sex === 'female' ? 1 : 0;
}

/** RFM percent; height and waist must be the same unit. */
export function calculateRfmPercent(
  height: number,
  waist: number,
  sex: Sex,
): number {
  if (!(height > 0) || !(waist > 0)) {
    throw new RangeError('Height and waist must be positive.');
  }
  return 64 - 20 * (height / waist) + 12 * sexCoefficient(sex);
}

export function formatRfm(rfm: number): string {
  return String(Number(rfm.toFixed(1)));
}

function emptyResult(partial?: Partial<RfmResult>): RfmResult {
  return {
    heightCm: null,
    waistCm: null,
    rfmPercent: null,
    formattedRfm: '',
    statusHeadline: 'Enter height and waist circumference.',
    statusDetail: 'RFM updates when both values are positive and finite.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateRfm(input: RfmInput): RfmResult {
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.waistText);
  if (hRaw === null || wRaw === null) {
    return emptyResult();
  }
  if (!(hRaw > 0) || !(wRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Height and waist must be greater than zero.',
      statusDetail: 'RFM is undefined for zero or negative lengths.',
    });
  }

  const heightCm = toCm(hRaw, input.heightUnit);
  const waistCm = toCm(wRaw, input.waistUnit);

  try {
    const rfm = calculateRfmPercent(heightCm, waistCm, input.sex);
    if (!Number.isFinite(rfm)) {
      return emptyResult({
        statusHeadline: 'Unable to compute RFM.',
        statusDetail: 'Result was non-finite.',
      });
    }
    return {
      heightCm,
      waistCm,
      rfmPercent: rfm,
      formattedRfm: formatRfm(rfm),
      statusHeadline: 'Relative fat mass computed.',
      statusDetail: 'Adult Woolcott–Bergman RFM estimate as percent.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  } catch {
    return emptyResult({
      statusHeadline: 'Unable to compute RFM.',
      statusDetail: 'Check that height and waist are positive finite numbers.',
    });
  }
}
