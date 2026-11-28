/**
 * Windsock — pure segment model + unit conversions.
 * V_kn = 3n; conversions via knots as the hub unit.
 */

import type {
  ImperialUnit,
  MetricUnit,
  WindsockResult,
} from './types';
import { KNOTS_PER_SEGMENT, MAX_SEGMENTS } from './types';

export const MPH_PER_KN = 1.15077945;
export const KMH_PER_KN = 1.852;
export const MS_PER_KN = 0.51444444;
export const FPS_PER_KN = 1.68780986;

export function calculateWindSpeedFromSegments(segments: number): number {
  return segments * KNOTS_PER_SEGMENT;
}

/** Approximate equivalent segments; clamps to 0…5 for display. */
export function calculateEquivalentSegments(knots: number): {
  segments: number;
  isAboveRange: boolean;
} {
  if (!Number.isFinite(knots) || knots < 0) {
    return { segments: 0, isAboveRange: false };
  }
  const raw = knots / KNOTS_PER_SEGMENT;
  if (knots > MAX_SEGMENTS * KNOTS_PER_SEGMENT) {
    return { segments: MAX_SEGMENTS, isAboveRange: true };
  }
  return { segments: Math.round(raw), isAboveRange: false };
}

export function convertKnotsToMph(kn: number): number {
  return kn * MPH_PER_KN;
}
export function convertKnotsToKmh(kn: number): number {
  return kn * KMH_PER_KN;
}
export function convertKnotsToMs(kn: number): number {
  return kn * MS_PER_KN;
}
export function convertKnotsToFps(kn: number): number {
  return kn * FPS_PER_KN;
}

export function convertMphToKnots(mph: number): number {
  return mph / MPH_PER_KN;
}
export function convertKmhToKnots(kmh: number): number {
  return kmh / KMH_PER_KN;
}
export function convertMsToKnots(ms: number): number {
  return ms / MS_PER_KN;
}
export function convertFpsToKnots(fps: number): number {
  return fps / FPS_PER_KN;
}

export function convertImperialToKnots(
  value: number,
  unit: ImperialUnit,
): number {
  return unit === 'mph' ? convertMphToKnots(value) : convertFpsToKnots(value);
}

export function convertMetricToKnots(
  value: number,
  unit: MetricUnit,
): number {
  return unit === 'km/h' ? convertKmhToKnots(value) : convertMsToKnots(value);
}

export function convertKnotsToImperial(
  kn: number,
  unit: ImperialUnit,
): number {
  return unit === 'mph' ? convertKnotsToMph(kn) : convertKnotsToFps(kn);
}

export function convertKnotsToMetric(kn: number, unit: MetricUnit): number {
  return unit === 'km/h' ? convertKnotsToKmh(kn) : convertKnotsToMs(kn);
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

const EXTENSION_LABELS = [
  'Drooping / no extension',
  'Slight extension',
  'Partial extension',
  'Moderate extension',
  'Strong extension',
  'Nearly horizontal (model full)',
] as const;

export function computeWindsockFromKnots(knots: number): WindsockResult {
  const mph = convertKnotsToMph(knots);
  const kmh = convertKnotsToKmh(knots);
  const ms = convertKnotsToMs(knots);
  const fps = convertKnotsToFps(knots);
  const { segments, isAboveRange } = calculateEquivalentSegments(knots);
  const extensionLabel = EXTENSION_LABELS[segments] ?? EXTENSION_LABELS[5];

  const formulaSteps = [
    isAboveRange
      ? `V = ${fmt(knots, 2)} kn (above 5×3 = 15 kn model ceiling)`
      : `V_kn = 3 × n → equivalent n ≈ ${segments} for ${fmt(knots, 2)} kn`,
    `mph = kn × ${MPH_PER_KN} = ${fmt(mph, 2)}`,
    `km/h = kn × ${KMH_PER_KN} = ${fmt(kmh, 2)}`,
    `m/s = kn × ${MS_PER_KN} = ${fmt(ms, 2)}`,
    `ft/s = kn × ${FPS_PER_KN} = ${fmt(fps, 2)}`,
  ];

  let interpretation = `Estimated wind speed is ${fmt(knots, 2)} knots (${fmt(mph, 2)} mph / ${fmt(kmh, 2)} km/h). `;
  if (isAboveRange) {
    interpretation +=
      'The five-segment model is saturated above ~15 kn — conversions remain valid, but segment count is not unique.';
  } else if (segments === 0) {
    interpretation +=
      'A hanging windsock under this model suggests ~0 kn, but light breezes may still leave it drooping.';
  } else {
    interpretation += `Approximate equivalent: ${segments} extended segment${segments === 1 ? '' : 's'} (${extensionLabel.toLowerCase()}). Visual estimate only — not a calibrated anemometer.`;
  }

  return {
    windSpeedKnots: knots,
    windSpeedMph: mph,
    windSpeedKmh: kmh,
    windSpeedMs: ms,
    windSpeedFps: fps,
    estimatedSegments: segments,
    isAboveSegmentModelRange: isAboveRange,
    extensionLabel,
    formulaSteps,
    interpretation,
    knotsDisplay: `${fmt(knots, 2)} kn`,
    mphDisplay: `${fmt(mph, 2)} mph`,
    kmhDisplay: `${fmt(kmh, 2)} km/h`,
    msDisplay: `${fmt(ms, 2)} m/s`,
    fpsDisplay: `${fmt(fps, 2)} ft/s`,
  };
}

export function computeWindsockFromSegments(segments: number): WindsockResult {
  const knots = calculateWindSpeedFromSegments(segments);
  const result = computeWindsockFromKnots(knots);
  result.formulaSteps = [
    `V_kn = 3 × ${segments} = ${fmt(knots, 2)} kn`,
    ...result.formulaSteps.slice(1),
  ];
  result.interpretation = `With ${segments} extended segment${segments === 1 ? '' : 's'}, the simplified five-segment model estimates approximately ${fmt(knots, 2)} knots (${fmt(result.windSpeedMph, 2)} mph or ${fmt(result.windSpeedKmh, 2)} km/h). ${result.extensionLabel}. Approximate visual guide only.`;
  return result;
}

/** Sync all string fields from knots without changing the edited source field. */
export function syncInputFromKnots(
  knots: number,
  prev: {
    imperialUnit: ImperialUnit;
    metricUnit: MetricUnit;
    calculationSource: import('./types').CalculationSource;
    segments?: string;
    speedKnots?: string;
    imperialSpeed?: string;
    metricSpeed?: string;
  },
): {
  segments: string;
  speedKnots: string;
  imperialSpeed: string;
  metricSpeed: string;
} {
  const { segments: eqSeg, isAboveRange } =
    calculateEquivalentSegments(knots);
  const imp = convertKnotsToImperial(knots, prev.imperialUnit);
  const met = convertKnotsToMetric(knots, prev.metricUnit);

  const out = {
    segments:
      prev.calculationSource === 'segments' && prev.segments != null
        ? prev.segments
        : isAboveRange
          ? String(MAX_SEGMENTS)
          : String(eqSeg),
    speedKnots:
      prev.calculationSource === 'knots' && prev.speedKnots != null
        ? prev.speedKnots
        : fmt(knots, 3),
    imperialSpeed:
      prev.calculationSource === 'imperial' && prev.imperialSpeed != null
        ? prev.imperialSpeed
        : fmt(imp, 3),
    metricSpeed:
      prev.calculationSource === 'metric' && prev.metricSpeed != null
        ? prev.metricSpeed
        : fmt(met, 3),
  };
  return out;
}
