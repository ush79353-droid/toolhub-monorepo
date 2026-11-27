/**
 * Waist-to-hip ratio (WHR) — educational (ADR-018).
 *
 * WHR = waist_circumference / hip_circumference (same unit).
 * Dimensionless ratio, not a percent. Fixture: 80/100 → 0.8.
 */

import type { LengthUnit, WhrInput, WhrResult } from './types';

export const SOURCE_NOTE =
  'Waist-to-hip ratio = waist circumference ÷ hip circumference after both lengths are converted to the same unit. Educational anthropometric ratio — not a clinical diagnosis.';

export const DISCLAIMER =
  'WHR is a screening-style ratio. It is not a body-fat measurement or medical diagnosis.';

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

export function calculateWhrRatio(waistCm: number, hipCm: number): number {
  if (!(hipCm > 0) || !Number.isFinite(hipCm)) {
    throw new RangeError('Hip must be a positive finite number.');
  }
  if (!(waistCm > 0) || !Number.isFinite(waistCm)) {
    throw new RangeError('Waist must be a positive finite number.');
  }
  return waistCm / hipCm;
}

export function formatRatioDisplay(ratio: number): string {
  const rounded = Math.round(ratio * 1000) / 1000;
  return String(Number(rounded.toFixed(3)));
}

function emptyResult(partial?: Partial<WhrResult>): WhrResult {
  return {
    waistCm: null,
    hipCm: null,
    ratio: null,
    formattedRatio: '',
    statusHeadline: 'Enter waist and hip circumference.',
    statusDetail: 'Ratio updates when both values are positive and hip > 0.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateWhr(input: WhrInput): WhrResult {
  const waistRaw = parseNumber(input.waistText);
  const hipRaw = parseNumber(input.hipText);
  if (waistRaw === null || hipRaw === null) {
    return emptyResult();
  }
  if (!(waistRaw > 0) || !(hipRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Waist and hip must be greater than zero.',
      statusDetail: 'WHR is undefined for zero or negative inputs.',
    });
  }

  const waistCm = toCm(waistRaw, input.waistUnit);
  const hipCm = toCm(hipRaw, input.hipUnit);

  try {
    const ratio = calculateWhrRatio(waistCm, hipCm);
    if (!Number.isFinite(ratio)) {
      return emptyResult({
        statusHeadline: 'Unable to compute ratio.',
        statusDetail: 'Result was non-finite.',
      });
    }
    return {
      waistCm,
      hipCm,
      ratio,
      formattedRatio: formatRatioDisplay(ratio),
      statusHeadline: 'Waist-to-hip ratio computed.',
      statusDetail: 'Dimensionless waist ÷ hip (same unit). Not a percent.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  } catch {
    return emptyResult({
      statusHeadline: 'Unable to compute ratio.',
      statusDetail: 'Check that waist and hip are positive finite numbers.',
    });
  }
}
