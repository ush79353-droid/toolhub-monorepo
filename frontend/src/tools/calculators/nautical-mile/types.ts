/**
 * Nautical Mile Calculator — convert nmi ↔ other distances; travel distance/speed/time.
 * 1 international nautical mile = exactly 1852 m.
 */

export type DistanceUnit =
  | 'nmi'
  | 'cable'
  | 'mi'
  | 'ft'
  | 'yd'
  | 'in'
  | 'km'
  | 'm'
  | 'cm'
  | 'mm';

export type SpeedUnit = 'kn' | 'mph' | 'km/h' | 'm/s' | 'ft/s';
export type TimeUnit = 's' | 'min' | 'h' | 'd';
export type CalculationMode = 'distance' | 'speed' | 'time';
export type ConvertSource = 'nmi' | 'imperial' | 'metric';

export const IMPERIAL_UNITS: readonly DistanceUnit[] = [
  'mi',
  'ft',
  'yd',
  'in',
];
export const METRIC_UNITS: readonly DistanceUnit[] = [
  'km',
  'm',
  'cm',
  'mm',
];

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  nmi: 'nmi',
  cable: 'cable',
  mi: 'mi',
  ft: 'ft',
  yd: 'yd',
  in: 'in',
  km: 'km',
  m: 'm',
  cm: 'cm',
  mm: 'mm',
};

export const SPEED_UNIT_LABELS: Record<SpeedUnit, string> = {
  kn: 'kn',
  mph: 'mph',
  'km/h': 'km/h',
  'm/s': 'm/s',
  'ft/s': 'ft/s',
};

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  s: 's',
  min: 'min',
  h: 'h',
  d: 'd',
};

export const MODE_LABELS: Record<CalculationMode, string> = {
  distance: 'Distance',
  speed: 'Speed',
  time: 'Time',
};

export interface NauticalMileInput {
  /** Convert section */
  convertSource: ConvertSource;
  nmiValue: string;
  imperialValue: string;
  imperialUnit: DistanceUnit;
  metricValue: string;
  metricUnit: DistanceUnit;
  /** Calculate section */
  calculationMode: CalculationMode;
  distance: string;
  distanceUnit: DistanceUnit;
  speed: string;
  speedUnit: SpeedUnit;
  time: string;
  timeUnit: TimeUnit;
  /** Optional speed converter */
  showSpeedConvert: boolean;
  convertSpeedValue: string;
  convertSpeedFrom: SpeedUnit;
  convertSpeedTo: SpeedUnit;
  /** Optional great-circle */
  showCoords: boolean;
  lat1: string;
  lon1: string;
  lat2: string;
  lon2: string;
}

export interface NauticalMileResult {
  /** Convert */
  nauticalMiles: number | null;
  statuteMiles: number | null;
  kilometers: number | null;
  meters: number | null;
  imperialDisplay: string | null;
  metricDisplay: string | null;
  nmiDisplay: string | null;
  comparison: Array<{ unit: DistanceUnit; value: number; label: string }> | null;
  /** Travel */
  calculationMode: CalculationMode;
  distanceValue: number | null;
  distanceUnit: DistanceUnit;
  speedValue: number | null;
  speedUnit: SpeedUnit;
  timeValue: number | null;
  timeUnit: TimeUnit;
  distanceNauticalMiles: number | null;
  speedKnots: number | null;
  timeHours: number | null;
  formattedDuration: string | null;
  distanceDisplay: string | null;
  speedDisplay: string | null;
  timeDisplay: string | null;
  /** Speed convert */
  convertedSpeed: number | null;
  convertedSpeedDisplay: string | null;
  /** Coords */
  greatCircleNmi: number | null;
  greatCircleKm: number | null;
  greatCircleMi: number | null;
  formulaSteps: string[];
  interpretation: string;
}

export type NauticalMileFieldErrors = {
  nmiValue?: string;
  imperialValue?: string;
  metricValue?: string;
  distance?: string;
  speed?: string;
  time?: string;
  convertSpeedValue?: string;
  lat1?: string;
  lon1?: string;
  lat2?: string;
  lon2?: string;
  form?: string;
};

/** Spec: convert 10 nmi; calculate 15 kn × 4 h → 60 nmi */
export function createEmptyInput(): NauticalMileInput {
  return {
    convertSource: 'nmi',
    nmiValue: '10',
    imperialValue: '',
    imperialUnit: 'mi',
    metricValue: '',
    metricUnit: 'km',
    calculationMode: 'distance',
    distance: '60',
    distanceUnit: 'nmi',
    speed: '15',
    speedUnit: 'kn',
    time: '4',
    timeUnit: 'h',
    showSpeedConvert: false,
    convertSpeedValue: '25',
    convertSpeedFrom: 'kn',
    convertSpeedTo: 'km/h',
    showCoords: false,
    lat1: '51.5074',
    lon1: '-0.1278',
    lat2: '48.8566',
    lon2: '2.3522',
  };
}
