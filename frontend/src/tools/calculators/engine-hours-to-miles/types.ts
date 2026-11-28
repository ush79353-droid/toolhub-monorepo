/**
 * Engine hours ↔ distance estimates (educational).
 * Driving: Distance = Hours × AverageSpeed
 * Reverse: Hours = Distance / AverageSpeed
 * Stationary: actual distance = 0; optional maintenance-equivalent = Hours × factor
 * Factor is user-assumed — not a universal manufacturer standard.
 */

export type EngineHoursMode = 'driving' | 'stationary' | 'distanceToHours';
export type TimeUnit = 'h' | 'min' | 's' | 'd';
export type SpeedUnit = 'mph' | 'km/h' | 'm/s' | 'kn';
export type DistanceUnit = 'mi' | 'km' | 'm' | 'ft';

export const MODE_LABELS: Record<EngineHoursMode, string> = {
  driving: 'Engine hours (driving)',
  stationary: 'Engine hours (stationary)',
  distanceToHours: 'Distance → engine hours',
};

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  h: 'h',
  min: 'min',
  s: 's',
  d: 'd',
};

export const SPEED_UNIT_LABELS: Record<SpeedUnit, string> = {
  mph: 'mph',
  'km/h': 'km/h',
  'm/s': 'm/s',
  kn: 'kn',
};

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  mi: 'mi',
  km: 'km',
  m: 'm',
  ft: 'ft',
};

/** Default illustrative maintenance factor only — user-editable assumption. */
export const DEFAULT_MAINTENANCE_FACTOR_MI_PER_H = 30;

export interface EngineHoursInput {
  mode: EngineHoursMode;
  engineHours: string;
  engineHoursUnit: TimeUnit;
  averageSpeed: string;
  averageSpeedUnit: SpeedUnit;
  distance: string;
  distanceUnit: DistanceUnit;
  maintenanceFactor: string;
  maintenanceFactorUnit: 'mi/h' | 'km/h';
  resultDistanceUnit: DistanceUnit;
  resultTimeUnit: TimeUnit;
}

export interface EngineHoursResult {
  mode: EngineHoursMode;
  engineHoursValue: number | null;
  averageSpeedMph: number | null;
  distanceMiles: number | null;
  actualDistanceMiles: number | null;
  maintenanceEquivalentMiles: number | null;
  estimatedDrivingHours: number | null;
  displayPrimary: string;
  primaryLabel: string;
  formulaSteps: string[];
  interpretation: string;
}

export type EngineHoursFieldErrors = {
  engineHours?: string;
  averageSpeed?: string;
  distance?: string;
  maintenanceFactor?: string;
  form?: string;
};

export function createEmptyInput(): EngineHoursInput {
  return {
    mode: 'driving',
    engineHours: '1000',
    engineHoursUnit: 'h',
    averageSpeed: '30',
    averageSpeedUnit: 'mph',
    distance: '60000',
    distanceUnit: 'mi',
    maintenanceFactor: String(DEFAULT_MAINTENANCE_FACTOR_MI_PER_H),
    maintenanceFactorUnit: 'mi/h',
    resultDistanceUnit: 'mi',
    resultTimeUnit: 'h',
  };
}

export function createExampleDriving(): EngineHoursInput {
  return createEmptyInput();
}

export function createExampleStationary(): EngineHoursInput {
  return {
    ...createEmptyInput(),
    mode: 'stationary',
    engineHours: '500',
    maintenanceFactor: '30',
  };
}

export function createExampleReverse(): EngineHoursInput {
  return {
    ...createEmptyInput(),
    mode: 'distanceToHours',
    distance: '60000',
    averageSpeed: '30',
  };
}
