/**
 * Body Adiposity Index (BAI) — educational (ADR-018).
 *
 * Bergman RN et al. Obesity (Silver Spring). 2011.
 *   BAI (%) = hip_circumference_cm / height_m^1.5 − 18
 */

import type { BaiInput, BaiResult, HeightUnit, HipUnit } from './types';

export const SOURCE_NOTE =
  'BAI (%) = hip circumference (cm) ÷ height (m)^1.5 − 18 (Bergman et al., Obesity 2011). Cohort-based body-fat estimate — educational only.';

export const DISCLAIMER =
  'BAI is a population estimate of adiposity, not a DEXA measurement or clinical diagnosis.';

export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToMeters(value: number, unit: HeightUnit): number {
  switch (unit) {
    case 'm':
      return value;
    case 'cm':
      return value / 100;
    case 'in':
      return value * METERS_PER_INCH;
    case 'ft':
      return value * METERS_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function metersToHeight(meters: number, unit: HeightUnit): number {
  switch (unit) {
    case 'm':
      return meters;
    case 'cm':
      return meters * 100;
    case 'in':
      return meters / METERS_PER_INCH;
    case 'ft':
      return meters / METERS_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function hipToCm(value: number, unit: HipUnit): number {
  switch (unit) {
    case 'cm':
      return value;
    case 'm':
      return value * 100;
    case 'in':
      return value * 2.54;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function cmToHip(cm: number, unit: HipUnit): number {
  switch (unit) {
    case 'cm':
      return cm;
    case 'm':
      return cm / 100;
    case 'in':
      return cm / 2.54;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

/** Bergman BAI (%). */
export function calculateBaiPercent(hipCm: number, heightMeters: number): number {
  if (!(heightMeters > 0) || !Number.isFinite(heightMeters)) {
    throw new RangeError('Height must be a positive finite number.');
  }
  if (!(hipCm > 0) || !Number.isFinite(hipCm)) {
    throw new RangeError('Hip circumference must be a positive finite number.');
  }
  return hipCm / Math.pow(heightMeters, 1.5) - 18;
}

export function formatBai(bai: number): string {
  return (Math.round(bai * 10) / 10).toFixed(1);
}

function emptyResult(partial?: Partial<BaiResult>): BaiResult {
  return {
    heightMeters: null,
    hipCm: null,
    baiPercent: null,
    formattedBai: '',
    statusHeadline: 'Enter height and hip circumference.',
    statusDetail: 'BAI updates when both values are positive and finite.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateBai(input: BaiInput): BaiResult {
  const heightRaw = parseNumber(input.heightText);
  const hipRaw = parseNumber(input.hipText);
  if (heightRaw === null || hipRaw === null) {
    return emptyResult();
  }
  if (!(heightRaw > 0) || !(hipRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Height and hip must be greater than zero.',
      statusDetail: 'BAI is undefined for zero or negative inputs.',
    });
  }

  const heightMeters = heightToMeters(heightRaw, input.heightUnit);
  const hipCm = hipToCm(hipRaw, input.hipUnit);

  try {
    const bai = calculateBaiPercent(hipCm, heightMeters);
    if (!Number.isFinite(bai)) {
      return emptyResult({
        statusHeadline: 'Unable to compute BAI.',
        statusDetail: 'Result was non-finite.',
      });
    }
    return {
      heightMeters,
      hipCm,
      baiPercent: bai,
      formattedBai: formatBai(bai),
      statusHeadline: 'Body Adiposity Index computed.',
      statusDetail: 'BAI estimates % body fat from hip circumference and height.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  } catch {
    return emptyResult({
      statusHeadline: 'Unable to compute BAI.',
      statusDetail: 'Check that height and hip are positive finite numbers.',
    });
  }
}
