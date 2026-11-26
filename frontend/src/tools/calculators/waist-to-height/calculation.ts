/**
 * Waist-to-height ratio (WHtR) — educational (ADR-018).
 *
 * WHtR = waist_length / height_length (same unit). Dimensionless ratio, not %.
 */

import type { LengthUnit, WhtrInput, WhtrResult } from './types';

export const SOURCE_NOTE =
  'Waist-to-height ratio = waist circumference ÷ height after both lengths are converted to the same unit. Educational anthropometric ratio — not a clinical diagnosis.';

export const DISCLAIMER =
  'WHtR is a screening-style ratio. It is not a body-fat measurement or medical diagnosis.';

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

/** Dimensionless waist/height after normalizing both to cm. */
export function calculateWhtrRatio(waistCm: number, heightCm: number): number {
  if (!(heightCm > 0) || !Number.isFinite(heightCm)) {
    throw new RangeError('Height must be a positive finite number.');
  }
  if (!(waistCm > 0) || !Number.isFinite(waistCm)) {
    throw new RangeError('Waist must be a positive finite number.');
  }
  return waistCm / heightCm;
}

/** Prefer up to 3 decimals, trim trailing zeros (0.5 stays 0.5). */
export function formatRatioDisplay(ratio: number): string {
  const rounded = Math.round(ratio * 1000) / 1000;
  return String(Number(rounded.toFixed(3)));
}

function emptyResult(partial?: Partial<WhtrResult>): WhtrResult {
  return {
    waistCm: null,
    heightCm: null,
    ratio: null,
    formattedRatio: '',
    statusHeadline: 'Enter waist circumference and height.',
    statusDetail: 'Ratio updates when both values are positive and finite.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateWhtr(input: WhtrInput): WhtrResult {
  const waistRaw = parseNumber(input.waistText);
  const heightRaw = parseNumber(input.heightText);
  if (waistRaw === null || heightRaw === null) {
    return emptyResult();
  }
  if (!(waistRaw > 0) || !(heightRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Waist and height must be greater than zero.',
      statusDetail: 'WHtR is undefined for zero or negative inputs.',
    });
  }

  const waistCm = toCm(waistRaw, input.waistUnit);
  const heightCm = toCm(heightRaw, input.heightUnit);

  try {
    const ratio = calculateWhtrRatio(waistCm, heightCm);
    if (!Number.isFinite(ratio)) {
      return emptyResult({
        statusHeadline: 'Unable to compute ratio.',
        statusDetail: 'Result was non-finite.',
      });
    }
    return {
      waistCm,
      heightCm,
      ratio,
      formattedRatio: formatRatioDisplay(ratio),
      statusHeadline: 'Waist-to-height ratio computed.',
      statusDetail: 'Dimensionless waist ÷ height (same unit). Not a percent.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  } catch {
    return emptyResult({
      statusHeadline: 'Unable to compute ratio.',
      statusDetail: 'Check that waist and height are positive finite numbers.',
    });
  }
}
