/**
 * Dress size matching against DRESS_SIZE_CHART — pure math.
 * Overall = smallest chart entry whose max bust/waist/hips all accommodate.
 */

import {
  CHART_SOURCE,
  CHART_VERSION,
  DRESS_SIZE_CHART,
} from './chart-data';
import type {
  DressSizeChartEntry,
  DressSizeResult,
  DressSizingSystem,
  FitPreference,
  MeasurementUnit,
} from './types';
import { labelForSystem } from './types';

export const CM_PER_IN = 2.54;

export function convertInchesToCm(inches: number): number {
  return inches * CM_PER_IN;
}

export function convertCmToInches(cm: number): number {
  return cm / CM_PER_IN;
}

export function convertToCm(value: number, unit: MeasurementUnit): number {
  return unit === 'in' ? convertInchesToCm(value) : value;
}

export function convertFromCm(cm: number, unit: MeasurementUnit): number {
  return unit === 'in' ? convertCmToInches(cm) : cm;
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function formatMeasure(cm: number, unit: MeasurementUnit): string {
  return `${fmt(convertFromCm(cm, unit), unit === 'in' ? 2 : 1)} ${unit}`;
}

type MeasureKey = 'bust' | 'waist' | 'hips';

function rangeFor(
  entry: DressSizeChartEntry,
  key: MeasureKey,
): { min: number; max: number } {
  if (key === 'bust')
    return { min: entry.bustMinCm, max: entry.bustMaxCm };
  if (key === 'waist')
    return { min: entry.waistMinCm, max: entry.waistMaxCm };
  return { min: entry.hipsMinCm, max: entry.hipsMaxCm };
}

/** First chart row where min ≤ value ≤ max (prefer smaller on shared boundary). */
export function findMeasureSizeMatch(
  valueCm: number,
  key: MeasureKey,
  chart: readonly DressSizeChartEntry[] = DRESS_SIZE_CHART,
): DressSizeChartEntry | null {
  if (!Number.isFinite(valueCm)) return null;
  const first = chart[0];
  const last = chart[chart.length - 1];
  if (!first || !last) return null;
  const firstMin = rangeFor(first, key).min;
  const lastMax = rangeFor(last, key).max;
  if (valueCm < firstMin || valueCm > lastMax) return null;
  for (const entry of chart) {
    const { min, max } = rangeFor(entry, key);
    if (valueCm >= min && valueCm <= max) return entry;
  }
  // Between exclusive gaps — pick next size that can cover by max
  for (const entry of chart) {
    if (valueCm <= rangeFor(entry, key).max) return entry;
  }
  return null;
}

export function findBustSizeMatch(bustCm: number): DressSizeChartEntry | null {
  return findMeasureSizeMatch(bustCm, 'bust');
}

export function findWaistSizeMatch(
  waistCm: number,
): DressSizeChartEntry | null {
  return findMeasureSizeMatch(waistCm, 'waist');
}

export function findHipSizeMatch(hipsCm: number): DressSizeChartEntry | null {
  return findMeasureSizeMatch(hipsCm, 'hips');
}

/**
 * Smallest chart size whose maximums accommodate all three measurements.
 */
export function findRecommendedDressSize(
  bustCm: number,
  waistCm: number,
  hipsCm: number,
  chart: readonly DressSizeChartEntry[] = DRESS_SIZE_CHART,
): DressSizeChartEntry | null {
  const last = chart[chart.length - 1];
  if (!last) return null;
  if (
    bustCm > last.bustMaxCm ||
    waistCm > last.waistMaxCm ||
    hipsCm > last.hipsMaxCm
  ) {
    return null;
  }
  const first = chart[0];
  if (
    first &&
    (bustCm < first.bustMinCm ||
      waistCm < first.waistMinCm ||
      hipsCm < first.hipsMinCm)
  ) {
    // Below chart — still allow if max of first can hold (tiny frame)
    if (
      bustCm <= first.bustMaxCm &&
      waistCm <= first.waistMaxCm &&
      hipsCm <= first.hipsMaxCm
    ) {
      return first;
    }
    return null;
  }
  for (const entry of chart) {
    if (
      bustCm <= entry.bustMaxCm &&
      waistCm <= entry.waistMaxCm &&
      hipsCm <= entry.hipsMaxCm
    ) {
      return entry;
    }
  }
  return null;
}

export function convertDressSizeSystem(
  entry: DressSizeChartEntry,
  system: DressSizingSystem,
): string {
  return labelForSystem(entry, system);
}

export function generateDressFitGuidance(
  preferred: FitPreference,
  mixed: boolean,
  recommended: DressSizeChartEntry | null,
  bustMatch: DressSizeChartEntry | null,
  waistMatch: DressSizeChartEntry | null,
  hipsMatch: DressSizeChartEntry | null,
): string {
  const parts: string[] = [];
  if (!recommended) {
    parts.push(
      "Your measurements are outside the supported range of this size chart. Check the brand's extended sizing guide for a more accurate recommendation.",
    );
  } else if (mixed) {
    const drivers: string[] = [];
    if (
      hipsMatch &&
      recommended.usSize === hipsMatch.usSize &&
      bustMatch &&
      hipsMatch.usSize !== bustMatch.usSize
    ) {
      drivers.push('hips');
    }
    if (
      waistMatch &&
      recommended.usSize === waistMatch.usSize &&
      bustMatch &&
      waistMatch.usSize !== bustMatch.usSize
    ) {
      drivers.push('waist');
    }
    if (
      bustMatch &&
      recommended.usSize === bustMatch.usSize &&
      hipsMatch &&
      bustMatch.usSize !== hipsMatch.usSize
    ) {
      drivers.push('bust');
    }
    const drive =
      drivers.length > 0
        ? drivers.join(' / ')
        : 'one or more measurements';
    parts.push(
      `Your ${drive} require a larger chart size than other measurements. For a fitted dress, the larger size (${convertDressSizeSystem(recommended, 'US')}) is a more comfortable starting point. Tailoring or a different silhouette may improve fit.`,
    );
  } else {
    parts.push(
      `All three measurements align with ${convertDressSizeSystem(recommended, 'US')} on this chart. Confirm the brand's garment measurements before buying.`,
    );
  }

  if (preferred === 'relaxed') {
    parts.push(
      "Relaxed fit preference: consider the garment's ease or one size up if you want more room — do not treat that as a chart rule.",
    );
  } else if (preferred === 'close') {
    parts.push(
      'Close fit preference: check fabric stretch and garment measurements before choosing a smaller size.',
    );
  } else {
    parts.push(
      'Regular fit preference: start with the chart recommendation and adjust for brand ease.',
    );
  }

  return parts.join(' ');
}

export function calculateDressSizeResults(args: {
  bustCm: number;
  waistCm: number;
  hipsCm: number;
  fitPreference: FitPreference;
}): DressSizeResult {
  const bustMatch = findBustSizeMatch(args.bustCm);
  const waistMatch = findWaistSizeMatch(args.waistCm);
  const hipsMatch = findHipSizeMatch(args.hipsCm);
  const recommended = findRecommendedDressSize(
    args.bustCm,
    args.waistCm,
    args.hipsCm,
  );

  const mixed =
    recommended != null &&
    !!bustMatch &&
    !!waistMatch &&
    !!hipsMatch &&
    (bustMatch.usSize !== waistMatch.usSize ||
      waistMatch.usSize !== hipsMatch.usSize ||
      bustMatch.usSize !== hipsMatch.usSize);

  const outOfRange = recommended == null;

  const fitGuidance = generateDressFitGuidance(
    args.fitPreference,
    mixed,
    recommended,
    bustMatch,
    waistMatch,
    hipsMatch,
  );

  const formulaSteps = [
    `Bust ${fmt(args.bustCm, 1)} cm → ${bustMatch ? `US ${bustMatch.usSize}` : 'out of chart'}`,
    `Waist ${fmt(args.waistCm, 1)} cm → ${waistMatch ? `US ${waistMatch.usSize}` : 'out of chart'}`,
    `Hips ${fmt(args.hipsCm, 1)} cm → ${hipsMatch ? `US ${hipsMatch.usSize}` : 'out of chart'}`,
    recommended
      ? `Overall (smallest size with B/W/H ≤ max) → US ${recommended.usSize} / UK ${recommended.ukSize} / EU ${recommended.euSize} / ${recommended.internationalSize}`
      : 'Overall → outside supported chart range',
  ];

  return {
    bustCm: args.bustCm,
    waistCm: args.waistCm,
    hipsCm: args.hipsCm,
    recommended,
    bustMatch,
    waistMatch,
    hipsMatch,
    outOfRange,
    mixedSizes: mixed,
    fitGuidance,
    chartSource: CHART_SOURCE,
    formulaSteps,
    explanation: recommended
      ? `Recommended ${convertDressSizeSystem(recommended, 'US')} on the Omega illustrative chart (${CHART_VERSION.replace('omega-dress-', '')}). Brands vary.`
      : 'No size on this chart fully accommodates these measurements.',
  };
}

export { CHART_VERSION };
