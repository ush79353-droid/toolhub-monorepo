/**
 * Miles to Hours Converter — distance / speed / time (educational).
 * Time = Distance / Speed · Distance = Speed × Time · Speed = Distance / Time.
 * Miles alone cannot become hours without speed.
 */

export type DistanceUnit = 'mi' | 'km' | 'm' | 'ft' | 'yd' | 'nmi';
export type SpeedUnit = 'mph' | 'km/h' | 'm/s' | 'ft/s' | 'kn';
export type TimeUnit = 's' | 'min' | 'h' | 'd' | 'wk';
export type CalculationMode = 'time' | 'distance' | 'speed';

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  mi: 'mi',
  km: 'km',
  m: 'm',
  ft: 'ft',
  yd: 'yd',
  nmi: 'nmi',
};

export const SPEED_UNIT_LABELS: Record<SpeedUnit, string> = {
  mph: 'mph',
  'km/h': 'km/h',
  'm/s': 'm/s',
  'ft/s': 'ft/s',
  kn: 'kn',
};

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  s: 's',
  min: 'min',
  h: 'h',
  d: 'd',
  wk: 'wk',
};

export const MODE_LABELS: Record<CalculationMode, string> = {
  time: 'Time',
  distance: 'Distance',
  speed: 'Speed',
};

export interface MilesToHoursInput {
  calculationMode: CalculationMode;
  distance: string;
  distanceUnit: DistanceUnit;
  speed: string;
  speedUnit: SpeedUnit;
  time: string;
  timeUnit: TimeUnit;
  /** Optional compare */
  showCompare: boolean;
  compareSpeedB: string;
  compareSpeedBUnit: SpeedUnit;
  /** Optional breaks */
  showBreaks: boolean;
  numberOfBreaks: string;
  breakDuration: string;
  breakDurationUnit: TimeUnit;
}

export interface MilesToHoursResult {
  calculationMode: CalculationMode;
  distanceValue: number;
  distanceUnit: DistanceUnit;
  speedValue: number;
  speedUnit: SpeedUnit;
  timeValue: number;
  timeUnit: TimeUnit;
  timeSeconds: number;
  timeMinutes: number;
  timeHours: number;
  formattedDuration: string;
  distanceDisplay: string;
  speedDisplay: string;
  timeDisplay: string;
  compareTimeAHours: number | null;
  compareTimeBHours: number | null;
  timeSavedHours: number | null;
  percentageSaved: number | null;
  breakTimeHours: number | null;
  totalTripHours: number | null;
  totalTripLabel: string | null;
  formulaSteps: string[];
  interpretation: string;
}

export type MilesToHoursFieldErrors = {
  distance?: string;
  speed?: string;
  time?: string;
  compareSpeedB?: string;
  numberOfBreaks?: string;
  breakDuration?: string;
  form?: string;
};

/** Spec fixture: 150 mi @ 50 mph → 3 h */
export function createEmptyInput(): MilesToHoursInput {
  return {
    calculationMode: 'time',
    distance: '150',
    distanceUnit: 'mi',
    speed: '50',
    speedUnit: 'mph',
    time: '3',
    timeUnit: 'h',
    showCompare: false,
    compareSpeedB: '60',
    compareSpeedBUnit: 'mph',
    showBreaks: false,
    numberOfBreaks: '2',
    breakDuration: '15',
    breakDurationUnit: 'min',
  };
}

export function createDistanceModeExample(): MilesToHoursInput {
  return {
    ...createEmptyInput(),
    calculationMode: 'distance',
    speed: '60',
    speedUnit: 'mph',
    time: '2.5',
    timeUnit: 'h',
    distance: '',
  };
}

export function createSpeedModeExample(): MilesToHoursInput {
  return {
    ...createEmptyInput(),
    calculationMode: 'speed',
    distance: '240',
    distanceUnit: 'mi',
    time: '4',
    timeUnit: 'h',
    speed: '',
  };
}
