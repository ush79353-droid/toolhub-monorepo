/**
 * Traffic Density Calculator — flow q, density k, speed v = q/k.
 * Observation-based + optional direct solve modes.
 * Use consistent road scope (same lanes/direction) for q and k.
 */

export type TimeUnit = 's' | 'min' | 'h';
export type DistanceUnit = 'm' | 'km' | 'ft' | 'mi';
export type SpeedUnit = 'km/h' | 'mph' | 'm/s';
export type FlowUnit = 'vehicles/s' | 'vehicles/min' | 'vehicles/h';
export type DensityUnit = 'vehicles/m' | 'vehicles/km' | 'vehicles/mi';
export type HeadwayUnit = 's' | 'min';
export type SpacingUnit = 'm' | 'km' | 'ft' | 'mi';

export type CalculationMode =
  | 'observations'
  | 'calculate-speed'
  | 'calculate-density'
  | 'calculate-flow';

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  s: 'sec',
  min: 'min',
  h: 'hr',
};

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  m: 'm',
  km: 'km',
  ft: 'ft',
  mi: 'mi',
};

export const FLOW_UNIT_LABELS: Record<FlowUnit, string> = {
  'vehicles/s': 'vehicles/sec',
  'vehicles/min': 'vehicles/min',
  'vehicles/h': 'vehicles/hour',
};

export const DENSITY_UNIT_LABELS: Record<DensityUnit, string> = {
  'vehicles/m': 'vehicles/m',
  'vehicles/km': 'vehicles/km',
  'vehicles/mi': 'vehicles/mi',
};

export const SPEED_UNIT_LABELS: Record<SpeedUnit, string> = {
  'km/h': 'km/h',
  mph: 'mph',
  'm/s': 'm/s',
};

export const HEADWAY_UNIT_LABELS: Record<HeadwayUnit, string> = {
  s: 's',
  min: 'min',
};

export const MODE_LABELS: Record<CalculationMode, string> = {
  observations: 'From observations',
  'calculate-speed': 'Flow + density → speed',
  'calculate-density': 'Flow + speed → density',
  'calculate-flow': 'Density + speed → flow',
};

export interface TrafficDensityInput {
  mode: CalculationMode;
  openFlow: boolean;
  openDensity: boolean;
  openSpeed: boolean;
  openDirect: boolean;

  passingVehicles: string;
  observationTime: string;
  observationTimeUnit: TimeUnit;

  segmentVehicles: string;
  roadLength: string;
  roadLengthUnit: DistanceUnit;

  directFlow: string;
  directDensity: string;
  directSpeed: string;

  flowUnit: FlowUnit;
  densityUnit: DensityUnit;
  speedUnit: SpeedUnit;
  headwayUnit: HeadwayUnit;
}

export interface TrafficDensityResult {
  trafficFlowVehiclesPerHour: number | null;
  trafficDensityVehiclesPerKm: number | null;
  averageSpeedKmPerHour: number | null;
  headwaySeconds: number | null;
  spacingMeters: number | null;

  flowDisplay: string | null;
  densityDisplay: string | null;
  speedDisplay: string | null;
  headwayDisplay: string | null;
  spacingDisplay: string | null;

  flowNote: string | null;
  densityNote: string | null;
  speedNote: string | null;
  headwayNote: string | null;

  formulaSteps: string[];
  interpretation: string;
}

export type TrafficDensityFieldErrors = {
  passingVehicles?: string;
  observationTime?: string;
  segmentVehicles?: string;
  roadLength?: string;
  directFlow?: string;
  directDensity?: string;
  directSpeed?: string;
  form?: string;
};

/** Spec fixture: 100 / 10 min · 20 / 2 km → 600 veh/h · 10/km · 60 km/h */
export function createEmptyInput(): TrafficDensityInput {
  return {
    mode: 'observations',
    openFlow: true,
    openDensity: true,
    openSpeed: true,
    openDirect: false,
    passingVehicles: '100',
    observationTime: '10',
    observationTimeUnit: 'min',
    segmentVehicles: '20',
    roadLength: '2',
    roadLengthUnit: 'km',
    directFlow: '600',
    directDensity: '10',
    directSpeed: '60',
    flowUnit: 'vehicles/h',
    densityUnit: 'vehicles/km',
    speedUnit: 'km/h',
    headwayUnit: 's',
  };
}

export function createBlankInput(): TrafficDensityInput {
  return {
    mode: 'observations',
    openFlow: true,
    openDensity: true,
    openSpeed: true,
    openDirect: false,
    passingVehicles: '',
    observationTime: '',
    observationTimeUnit: 'min',
    segmentVehicles: '',
    roadLength: '',
    roadLengthUnit: 'km',
    directFlow: '',
    directDensity: '',
    directSpeed: '',
    flowUnit: 'vehicles/h',
    densityUnit: 'vehicles/km',
    speedUnit: 'km/h',
    headwayUnit: 's',
  };
}
