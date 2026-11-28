/**
 * Speed Calculator — distance, time, speed (v = d/t) with unit conversion and comparisons.
 */

export type DistanceUnit =
  | 'mm'
  | 'cm'
  | 'm'
  | 'km'
  | 'in'
  | 'ft'
  | 'yd'
  | 'mi'
  | 'nmi';

export type TimeUnit = 'ms' | 's' | 'min' | 'h' | 'd' | 'wk';

export type SpeedUnit =
  | 'm/s'
  | 'km/h'
  | 'mph'
  | 'ft/s'
  | 'kn'
  | 'cm/s'
  | 'm/min'
  | 'km/s';

export type CalculationMode = 'speed' | 'distance' | 'time';

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  km: 'km',
  in: 'in',
  ft: 'ft',
  yd: 'yd',
  mi: 'mi',
  nmi: 'nmi',
};

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  ms: 'ms',
  s: 's',
  min: 'min',
  h: 'h',
  d: 'd',
  wk: 'wk',
};

export const SPEED_UNIT_LABELS: Record<SpeedUnit, string> = {
  'm/s': 'm/s',
  'km/h': 'km/h',
  mph: 'mph',
  'ft/s': 'ft/s',
  kn: 'kn',
  'cm/s': 'cm/s',
  'm/min': 'm/min',
  'km/s': 'km/s',
};

export const MODE_LABELS: Record<CalculationMode, string> = {
  speed: 'Speed',
  distance: 'Distance',
  time: 'Time',
};

export interface SpeedSegment {
  id: string;
  distance: string;
  distanceUnit: DistanceUnit;
  time: string;
  timeUnit: TimeUnit;
}

export interface SpeedInput {
  calculationMode: CalculationMode;
  distance: string;
  distanceUnit: DistanceUnit;
  time: string;
  timeUnit: TimeUnit;
  speed: string;
  speedUnit: SpeedUnit;
  showCompare: boolean;
  showAverage: boolean;
  segments: SpeedSegment[];
}

export interface SpeedComparisonRow {
  label: string;
  referenceKmh: number;
  ratio: number | null;
  ratioDisplay: string;
  note?: string;
}

export interface SpeedResult {
  calculationMode: CalculationMode;
  distanceMeters: number | null;
  timeSeconds: number | null;
  speedMps: number | null;
  distanceValue: number | null;
  timeValue: number | null;
  speedValue: number | null;
  distanceDisplay: string | null;
  timeDisplay: string | null;
  speedDisplay: string | null;
  comparisons: SpeedComparisonRow[] | null;
  averageSpeedMps: number | null;
  averageSpeedDisplay: string | null;
  totalDistanceDisplay: string | null;
  totalTimeDisplay: string | null;
  formulaSteps: string[];
  interpretation: string;
}

export type SpeedFieldErrors = {
  distance?: string;
  time?: string;
  speed?: string;
  segments?: string;
  form?: string;
};

/** Spec fixture: 150 km / 3 h → 50 km/h */
export function createEmptyInput(): SpeedInput {
  return {
    calculationMode: 'speed',
    distance: '150',
    distanceUnit: 'km',
    time: '3',
    timeUnit: 'h',
    speed: '',
    speedUnit: 'km/h',
    showCompare: false,
    showAverage: false,
    segments: [
      {
        id: '1',
        distance: '80',
        distanceUnit: 'km',
        time: '1',
        timeUnit: 'h',
      },
      {
        id: '2',
        distance: '120',
        distanceUnit: 'km',
        time: '2',
        timeUnit: 'h',
      },
    ],
  };
}

export function createBlankInput(): SpeedInput {
  return {
    ...createEmptyInput(),
    distance: '',
    time: '',
    speed: '',
    showCompare: false,
    showAverage: false,
    segments: [
      {
        id: '1',
        distance: '',
        distanceUnit: 'km',
        time: '',
        timeUnit: 'h',
      },
    ],
  };
}
