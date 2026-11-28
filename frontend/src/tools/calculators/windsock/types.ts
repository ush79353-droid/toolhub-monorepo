/**
 * Windsock Calculator — segment rule-of-thumb + wind speed unit conversion.
 * V_kn ≈ 3 × n (five-segment model). Approximate visual estimate only.
 */

export type ImperialUnit = 'mph' | 'ft/s';
export type MetricUnit = 'km/h' | 'm/s';
export type CalculationSource = 'segments' | 'knots' | 'imperial' | 'metric';

export const KNOTS_PER_SEGMENT = 3;
export const MAX_SEGMENTS = 5;

export const IMPERIAL_UNIT_LABELS: Record<ImperialUnit, string> = {
  mph: 'mph',
  'ft/s': 'ft/s',
};

export const METRIC_UNIT_LABELS: Record<MetricUnit, string> = {
  'km/h': 'km/h',
  'm/s': 'm/s',
};

export interface WindsockInput {
  segments: string;
  speedKnots: string;
  imperialSpeed: string;
  imperialUnit: ImperialUnit;
  metricSpeed: string;
  metricUnit: MetricUnit;
  calculationSource: CalculationSource;
}

export interface WindsockResult {
  windSpeedKnots: number;
  windSpeedMph: number;
  windSpeedKmh: number;
  windSpeedMs: number;
  windSpeedFps: number;
  estimatedSegments: number;
  isAboveSegmentModelRange: boolean;
  extensionLabel: string;
  formulaSteps: string[];
  interpretation: string;
  knotsDisplay: string;
  mphDisplay: string;
  kmhDisplay: string;
  msDisplay: string;
  fpsDisplay: string;
}

export type WindsockFieldErrors = {
  segments?: string;
  speedKnots?: string;
  imperialSpeed?: string;
  metricSpeed?: string;
  form?: string;
};

export function createEmptyInput(): WindsockInput {
  return {
    segments: '3',
    speedKnots: '9',
    imperialSpeed: '10.357',
    imperialUnit: 'mph',
    metricSpeed: '16.668',
    metricUnit: 'km/h',
    calculationSource: 'segments',
  };
}

export function createBlankInput(): WindsockInput {
  return {
    segments: '',
    speedKnots: '',
    imperialSpeed: '',
    imperialUnit: 'mph',
    metricSpeed: '',
    metricUnit: 'km/h',
    calculationSource: 'segments',
  };
}
