/**
 * Glove size lookup — pure math (cm internally).
 * Match: min ≤ C < max (last size includes max).
 */

import { CHART_SOURCE, CHART_VERSION, getGloveSizingChart } from './chart-data';
import type {
  GloveSizeRange,
  GloveSizeResult,
  GloveStyle,
  MeasurementUnit,
} from './types';
import { STYLE_LABELS } from './types';

export const CM_PER_IN = 2.54;
export const CM_PER_MM = 0.1;

export function convertHandMeasurementToCm(
  value: number,
  unit: MeasurementUnit,
): number {
  if (unit === 'cm') return value;
  if (unit === 'mm') return value * CM_PER_MM;
  return value * CM_PER_IN;
}

export function convertCmToInches(cm: number): number {
  return cm / CM_PER_IN;
}

export function convertCmToMillimeters(cm: number): number {
  return cm / CM_PER_MM;
}

export function convertFromCm(cm: number, unit: MeasurementUnit): number {
  if (unit === 'cm') return cm;
  if (unit === 'mm') return convertCmToMillimeters(cm);
  return convertCmToInches(cm);
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function formatGloveMeasurement(
  cm: number,
  unit: MeasurementUnit,
  digits = 2,
): string {
  return `${fmt(convertFromCm(cm, unit), digits)} ${unit}`;
}

/**
 * Find matching size. Shared boundaries prefer the smaller size
 * (min inclusive, max exclusive except last size includes max).
 */
export function findMatchingGloveSize(
  circumferenceCm: number,
  style: GloveStyle,
): GloveSizeRange | null {
  const sizes = getGloveSizingChart(style).sizes;
  if (sizes.length === 0) return null;
  const first = sizes[0]!;
  const last = sizes[sizes.length - 1]!;
  if (circumferenceCm < first.minCircumferenceCm) return null;
  if (circumferenceCm > last.maxCircumferenceCm) return null;

  for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i]!;
    const isLast = i === sizes.length - 1;
    if (
      circumferenceCm >= s.minCircumferenceCm &&
      (isLast
        ? circumferenceCm <= s.maxCircumferenceCm
        : circumferenceCm < s.maxCircumferenceCm)
    ) {
      return s;
    }
  }
  return null;
}

export function getGloveSizeRange(
  style: GloveStyle,
  label: string,
): GloveSizeRange | null {
  return (
    getGloveSizingChart(style).sizes.find((s) => s.label === label) ?? null
  );
}

export function getNumericGloveSize(range: GloveSizeRange | null): string | null {
  return range?.numericSize ?? null;
}

export function calculateHandMeasurementFromSize(
  style: GloveStyle,
  label: string,
): {
  minCm: number;
  maxCm: number;
  midCm: number;
  range: GloveSizeRange;
} | null {
  const range = getGloveSizeRange(style, label);
  if (!range) return null;
  const midCm = (range.minCircumferenceCm + range.maxCircumferenceCm) / 2;
  return {
    minCm: range.minCircumferenceCm,
    maxCm: range.maxCircumferenceCm,
    midCm,
    range,
  };
}

export function calculateRecommendedGloveSize(
  circumferenceCm: number,
  style: GloveStyle,
): GloveSizeRange | null {
  return findMatchingGloveSize(circumferenceCm, style);
}

export function calculateGloveSizeResults(args: {
  gloveStyle: GloveStyle;
  handCircumferenceCm: number;
}): GloveSizeResult {
  const matched = findMatchingGloveSize(
    args.handCircumferenceCm,
    args.gloveStyle,
  );
  const chart = getGloveSizingChart(args.gloveStyle);
  const first = chart.sizes[0];
  const last = chart.sizes[chart.sizes.length - 1];
  const isOutOfRange = matched == null;
  const warnings: string[] = [];

  // Near-boundary "between" hint when within 0.15 cm of an interior boundary
  let betweenSizes = false;
  let betweenLabels: string | null = null;
  if (matched && chart.sizes.length > 1) {
    for (let i = 0; i < chart.sizes.length - 1; i++) {
      const a = chart.sizes[i]!;
      const b = chart.sizes[i + 1]!;
      const boundary = a.maxCircumferenceCm;
      if (Math.abs(args.handCircumferenceCm - boundary) <= 0.15) {
        betweenSizes = true;
        betweenLabels = `${a.label} / ${b.label}`;
        break;
      }
    }
  }

  if (isOutOfRange) {
    warnings.push(
      'Your measurement is outside the supported range of this illustrative chart. Check the brand size guide for extended sizes.',
    );
  }
  if (betweenSizes && betweenLabels) {
    warnings.push(
      `Your measurement falls near the ${betweenLabels} boundary. Consult the manufacturer's fit guide and consider material and intended use.`,
    );
  }

  const fitGuidance = matched
    ? betweenSizes
      ? `Near a size boundary (${betweenLabels}). Stretch materials may favor the smaller size; insulated or work gloves may need more room.`
      : `Estimated ${matched.label}${matched.numericSize ? ` (≈ ${matched.numericSize})` : ''} on the ${STYLE_LABELS[args.gloveStyle]} chart. Glove sizes vary by manufacturer, material, and use.`
    : 'No size on this chart covers your measurement.';

  const formulaSteps = [
    `C = ${fmt(args.handCircumferenceCm, 2)} cm (${fmt(convertCmToInches(args.handCircumferenceCm), 2)} in)`,
    `Chart: ${STYLE_LABELS[args.gloveStyle]} (${CHART_VERSION})`,
    matched
      ? `Match: ${matched.label}${matched.numericSize ? ` / ${matched.numericSize}` : ''} [${fmt(matched.minCircumferenceCm, 1)}–${fmt(matched.maxCircumferenceCm, 1)} cm]`
      : `Out of range (${first ? fmt(first.minCircumferenceCm, 1) : '?'}–${last ? fmt(last.maxCircumferenceCm, 1) : '?'} cm supported)`,
  ];

  return {
    recommendedSize: matched?.label ?? null,
    numericSize: getNumericGloveSize(matched),
    handCircumferenceCm: args.handCircumferenceCm,
    handCircumferenceInches: convertCmToInches(args.handCircumferenceCm),
    minimumCircumferenceCm: matched?.minCircumferenceCm ?? null,
    maximumCircumferenceCm: matched?.maxCircumferenceCm ?? null,
    matchedRange: matched,
    betweenSizes,
    betweenLabels,
    chartStyle: args.gloveStyle,
    isOutOfRange,
    fitGuidance,
    chartSource: CHART_SOURCE,
    formulaSteps,
    explanation: matched
      ? `Based on your hand circumference and the selected ${STYLE_LABELS[args.gloveStyle].toLowerCase()} sizing chart, your estimated glove size is ${matched.label}.`
      : 'Unable to recommend a size from this chart.',
    warnings,
  };
}

export { CHART_VERSION, getGloveSizingChart };
