/**
 * Body Type (apparel FFIT) — educational (ADR-018).
 *
 * Lee, Istook, Nam & Park (2007) / calculator.net seven-shape rules.
 * All comparisons run in inches after unit conversion.
 * First matching rule in published order wins.
 *
 * WHR = waist / full hip (same physical units).
 */

import type {
  BodyShapeId,
  BodyTypeInput,
  BodyTypeResult,
  LengthUnit,
} from './types';

export const SOURCE_NOTE =
  'Apparel body type uses Lee/Istook FFIT-style rules (inches) as published by calculator.net: hourglass → bottom hourglass → top hourglass → spoon → triangle → inverted triangle → rectangle. High-hip/waist threshold 1.193 separates bottom hourglass from spoon. Educational clothing-fit label — not a health diagnosis.';

export const DISCLAIMER =
  'Not a medical or fitness assessment — apparel classification only; WHR is shown for context and is not a diagnosis.';

export const CM_PER_INCH = 2.54;

/** Strict high-hip ÷ waist cutoff used by bottom hourglass vs spoon. */
export const HIGH_HIP_WAIST_CUTOFF = 1.193;

export const SHAPE_LABELS: Record<BodyShapeId, string> = {
  hourglass: 'Hourglass',
  bottom_hourglass: 'Bottom hourglass',
  top_hourglass: 'Top hourglass',
  spoon: 'Spoon',
  triangle: 'Triangle',
  inverted_triangle: 'Inverted triangle',
  rectangle: 'Rectangle',
  unclassified: 'Unclassified',
};

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toInches(value: number, unit: LengthUnit): number {
  return unit === 'cm' ? value / CM_PER_INCH : value;
}

export function fromInches(inches: number, unit: LengthUnit): number {
  return unit === 'cm' ? inches * CM_PER_INCH : inches;
}

/**
 * Classify using calculator.net / Lee et al. rules (measurements in inches).
 * Order is part of the algorithm — overlapping shapes return the first match.
 */
export function classifyBodyShape(
  bustIn: number,
  waistIn: number,
  highHipIn: number,
  hipIn: number,
): BodyShapeId {
  const bustMinusHip = bustIn - hipIn;
  const hipMinusBust = hipIn - bustIn;
  const bustMinusWaist = bustIn - waistIn;
  const hipMinusWaist = hipIn - waistIn;
  const highHipOverWaist = highHipIn / waistIn;

  // Hourglass
  if (
    bustMinusHip <= 1 &&
    hipMinusBust < 3.6 &&
    (bustMinusWaist >= 9 || hipMinusWaist >= 10)
  ) {
    return 'hourglass';
  }

  // Bottom hourglass
  if (
    hipMinusBust >= 3.6 &&
    hipMinusBust < 10 &&
    hipMinusWaist >= 9 &&
    highHipOverWaist < HIGH_HIP_WAIST_CUTOFF
  ) {
    return 'bottom_hourglass';
  }

  // Top hourglass
  if (bustMinusHip > 1 && bustMinusHip < 10 && bustMinusWaist >= 9) {
    return 'top_hourglass';
  }

  // Spoon
  if (
    hipMinusBust > 2 &&
    hipMinusWaist >= 7 &&
    highHipOverWaist >= HIGH_HIP_WAIST_CUTOFF
  ) {
    return 'spoon';
  }

  // Triangle
  if (hipMinusBust >= 3.6 && hipMinusWaist < 9) {
    return 'triangle';
  }

  // Inverted triangle
  if (bustMinusHip >= 3.6 && bustMinusWaist < 9) {
    return 'inverted_triangle';
  }

  // Rectangle
  if (
    hipMinusBust < 3.6 &&
    bustMinusHip < 3.6 &&
    bustMinusWaist < 9 &&
    hipMinusWaist < 10
  ) {
    return 'rectangle';
  }

  return 'unclassified';
}

export function formatWhr(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function calculateBodyType(input: BodyTypeInput): BodyTypeResult {
  const empty = {
    bustIn: null,
    waistIn: null,
    highHipIn: null,
    hipIn: null,
    shapeId: null,
    shapeLabel: '',
    whr: null,
    formattedWhr: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const bustRaw = parseNumber(input.bustText);
  const waistRaw = parseNumber(input.waistText);
  const highHipRaw = parseNumber(input.highHipText);
  const hipRaw = parseNumber(input.hipText);

  if (
    bustRaw === null ||
    waistRaw === null ||
    highHipRaw === null ||
    hipRaw === null
  ) {
    return {
      ...empty,
      statusHeadline: 'Enter measurements',
      statusDetail:
        'Enter bust, waist, high hip, and hip, then Calculate for an apparel body-type estimate.',
    };
  }

  if (!(bustRaw > 0 && waistRaw > 0 && highHipRaw > 0 && hipRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid measurements',
      statusDetail: 'All circumferences must be greater than zero.',
    };
  }

  const bustIn = toInches(bustRaw, input.bustUnit);
  const waistIn = toInches(waistRaw, input.waistUnit);
  const highHipIn = toInches(highHipRaw, input.highHipUnit);
  const hipIn = toInches(hipRaw, input.hipUnit);

  const shapeId = classifyBodyShape(bustIn, waistIn, highHipIn, hipIn);
  const whr = waistIn / hipIn;
  const roundedWhr = Math.round(whr * 1000) / 1000;

  return {
    bustIn,
    waistIn,
    highHipIn,
    hipIn,
    shapeId,
    shapeLabel: SHAPE_LABELS[shapeId],
    whr: roundedWhr,
    formattedWhr: formatWhr(roundedWhr),
    statusHeadline:
      shapeId === 'unclassified'
        ? 'No matching apparel shape'
        : `Body shape: ${SHAPE_LABELS[shapeId]}`,
    statusDetail:
      shapeId === 'unclassified'
        ? `Measurements did not match the seven FFIT/calculator.net rules. Waist-hip ratio ≈ ${formatWhr(roundedWhr)}.`
        : `Apparel classification (Lee/Istook rules in inches). Waist-hip ratio ≈ ${formatWhr(roundedWhr)}.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
