/**
 * Body Roundness Index (BRI) — Thomas et al. (educational, ADR-018).
 *
 *   BRI = 364.2 − 365.5 × √(1 − (waist / (π × height))²)
 *
 * Height and waist must use the same length unit (normalized to cm internally).
 * Do not clamp out-of-domain radicands to a plausible score.
 */

import type { BriInput, BriResult, LengthUnit } from './types';

export const SOURCE_NOTE =
  'Thomas BRI: 364.2 − 365.5 × √(1 − (waist/(π×height))²). Educational anthropometric index — not a diagnosis.';

export const DISCLAIMER =
  'Educational estimate only. BRI does not replace clinical assessment of cardiometabolic risk.';

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

/** Thomas BRI from height and waist in the same unit. */
export function thomasBri(height: number, waist: number): number {
  if (!(height > 0) || !(waist > 0)) {
    throw new RangeError('Height and waist must be positive.');
  }
  const ratio = waist / (Math.PI * height);
  const inside = 1 - ratio * ratio;
  if (!(inside >= 0)) {
    throw new RangeError('Waist/height combination is out of domain for BRI.');
  }
  return 364.2 - 365.5 * Math.sqrt(inside);
}

export function formatBri(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}

function emptyResult(partial?: Partial<BriResult>): BriResult {
  return {
    bri: null,
    formattedBri: '',
    statusHeadline: 'Enter height and waist circumference.',
    statusDetail: 'BRI uses the Thomas equation with matching length units.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateBri(input: BriInput): BriResult {
  const heightRaw = parseNumber(input.heightText);
  const waistRaw = parseNumber(input.waistText);

  if (heightRaw === null || waistRaw === null) {
    return emptyResult();
  }

  if (!(heightRaw > 0) || !(waistRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Height and waist must be positive.',
      statusDetail: 'Zero or negative lengths are rejected.',
    });
  }

  const heightCm = toCm(heightRaw, input.heightUnit);
  const waistCm = toCm(waistRaw, input.waistUnit);
  if (!(heightCm > 0) || !(waistCm > 0)) {
    return emptyResult({
      statusHeadline: 'Unit conversion is invalid.',
      statusDetail: 'Check height and waist units.',
    });
  }

  try {
    const bri = thomasBri(heightCm, waistCm);
    if (!Number.isFinite(bri)) {
      return emptyResult({
        statusHeadline: 'Unable to compute BRI.',
        statusDetail: 'Result was non-finite.',
      });
    }
    return {
      bri,
      formattedBri: formatBri(bri),
      statusHeadline: 'Body Roundness Index computed.',
      statusDetail: `Thomas equation with height ${heightCm.toFixed(2)} cm and waist ${waistCm.toFixed(2)} cm.`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Out of domain.';
    return emptyResult({
      statusHeadline: 'BRI cannot be computed for these inputs.',
      statusDetail: msg,
    });
  }
}
