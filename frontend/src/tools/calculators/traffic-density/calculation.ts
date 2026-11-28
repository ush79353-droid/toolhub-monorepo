/**
 * Traffic Density Calculator — pure traffic stream relations.
 * Internal SI-ish: flow veh/h, density veh/km, speed km/h.
 */

import type {
  DensityUnit,
  DistanceUnit,
  FlowUnit,
  HeadwayUnit,
  SpeedUnit,
  TimeUnit,
  TrafficDensityResult,
} from './types';

export const M_PER_KM = 1000;
export const M_PER_FT = 0.3048;
export const M_PER_MI = 1609.344;
export const KM_PER_MI = 1.609344;
export const SEC_PER_MIN = 60;
export const SEC_PER_HOUR = 3600;

export function convertTimeToSeconds(value: number, unit: TimeUnit): number {
  if (unit === 's') return value;
  if (unit === 'min') return value * SEC_PER_MIN;
  return value * SEC_PER_HOUR;
}

export function convertTimeToHours(value: number, unit: TimeUnit): number {
  return convertTimeToSeconds(value, unit) / SEC_PER_HOUR;
}

export function convertTime(
  value: number,
  from: TimeUnit,
  to: TimeUnit,
): number {
  const sec = convertTimeToSeconds(value, from);
  if (to === 's') return sec;
  if (to === 'min') return sec / SEC_PER_MIN;
  return sec / SEC_PER_HOUR;
}

export function convertDistanceToMeters(
  value: number,
  unit: DistanceUnit,
): number {
  if (unit === 'm') return value;
  if (unit === 'km') return value * M_PER_KM;
  if (unit === 'ft') return value * M_PER_FT;
  return value * M_PER_MI;
}

export function convertDistanceToKilometers(
  value: number,
  unit: DistanceUnit,
): number {
  return convertDistanceToMeters(value, unit) / M_PER_KM;
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  const m = convertDistanceToMeters(value, from);
  if (to === 'm') return m;
  if (to === 'km') return m / M_PER_KM;
  if (to === 'ft') return m / M_PER_FT;
  return m / M_PER_MI;
}

export function convertSpeedToKilometersPerHour(
  value: number,
  unit: SpeedUnit,
): number {
  if (unit === 'km/h') return value;
  if (unit === 'mph') return value * KM_PER_MI;
  return value * 3.6; // m/s
}

export function convertSpeedFromKilometersPerHour(
  value: number,
  unit: SpeedUnit,
): number {
  if (unit === 'km/h') return value;
  if (unit === 'mph') return value / KM_PER_MI;
  return value / 3.6;
}

export function convertSpeed(
  value: number,
  from: SpeedUnit,
  to: SpeedUnit,
): number {
  return convertSpeedFromKilometersPerHour(
    convertSpeedToKilometersPerHour(value, from),
    to,
  );
}

export function convertFlowToVehiclesPerHour(
  value: number,
  unit: FlowUnit,
): number {
  if (unit === 'vehicles/h') return value;
  if (unit === 'vehicles/min') return value * 60;
  return value * 3600; // /s
}

export function convertFlowFromVehiclesPerHour(
  value: number,
  unit: FlowUnit,
): number {
  if (unit === 'vehicles/h') return value;
  if (unit === 'vehicles/min') return value / 60;
  return value / 3600;
}

export function convertFlow(
  value: number,
  from: FlowUnit,
  to: FlowUnit,
): number {
  return convertFlowFromVehiclesPerHour(
    convertFlowToVehiclesPerHour(value, from),
    to,
  );
}

export function convertDensityToVehiclesPerKm(
  value: number,
  unit: DensityUnit,
): number {
  if (unit === 'vehicles/km') return value;
  if (unit === 'vehicles/m') return value * 1000;
  return value / KM_PER_MI; // vehicles/mi → vehicles/km
}

export function convertDensityFromVehiclesPerKm(
  value: number,
  unit: DensityUnit,
): number {
  if (unit === 'vehicles/km') return value;
  if (unit === 'vehicles/m') return value / 1000;
  return value * KM_PER_MI; // vehicles/km → vehicles/mi
}

export function convertDensity(
  value: number,
  from: DensityUnit,
  to: DensityUnit,
): number {
  return convertDensityFromVehiclesPerKm(
    convertDensityToVehiclesPerKm(value, from),
    to,
  );
}

export function calculateTrafficFlow(
  vehicles: number,
  time: number,
  timeUnit: TimeUnit,
): number {
  const hours = convertTimeToHours(time, timeUnit);
  return vehicles / hours;
}

export function calculateTrafficDensity(
  vehicles: number,
  length: number,
  lengthUnit: DistanceUnit,
): number {
  const km = convertDistanceToKilometers(length, lengthUnit);
  return vehicles / km;
}

export function calculateAverageTrafficSpeed(
  flowVehPerH: number,
  densityVehPerKm: number,
): number {
  return flowVehPerH / densityVehPerKm;
}

export function calculateAverageHeadway(flowVehPerH: number): number {
  return SEC_PER_HOUR / flowVehPerH;
}

export function calculateAverageVehicleSpacing(
  densityVehPerKm: number,
): number {
  return M_PER_KM / densityVehPerKm;
}

export function calculateFlowFromDensityAndSpeed(
  densityVehPerKm: number,
  speedKmH: number,
): number {
  return densityVehPerKm * speedKmH;
}

export function calculateDensityFromFlowAndSpeed(
  flowVehPerH: number,
  speedKmH: number,
): number {
  return flowVehPerH / speedKmH;
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return String(Number(n.toFixed(digits)));
}

export function formatFlow(qPh: number, unit: FlowUnit): string {
  return `${fmt(convertFlowFromVehiclesPerHour(qPh, unit), 4)} ${unit}`;
}

export function formatDensity(kPkm: number, unit: DensityUnit): string {
  return `${fmt(convertDensityFromVehiclesPerKm(kPkm, unit), 4)} ${unit}`;
}

export function formatSpeed(vKmh: number, unit: SpeedUnit): string {
  return `${fmt(convertSpeedFromKilometersPerHour(vKmh, unit), 4)} ${unit}`;
}

export function formatHeadway(seconds: number, unit: HeadwayUnit): string {
  const v = unit === 's' ? seconds : seconds / 60;
  return `${fmt(v, 4)} ${unit}`;
}

export function formatSpacing(meters: number): string {
  return `${fmt(meters, 4)} m`;
}

export interface ObservationParams {
  passingVehicles: number;
  observationTime: number;
  observationTimeUnit: TimeUnit;
  segmentVehicles: number;
  roadLength: number;
  roadLengthUnit: DistanceUnit;
  flowUnit: FlowUnit;
  densityUnit: DensityUnit;
  speedUnit: SpeedUnit;
  headwayUnit: HeadwayUnit;
}

export function computeFromObservations(
  p: ObservationParams,
): TrafficDensityResult {
  const q = calculateTrafficFlow(
    p.passingVehicles,
    p.observationTime,
    p.observationTimeUnit,
  );
  const k = calculateTrafficDensity(
    p.segmentVehicles,
    p.roadLength,
    p.roadLengthUnit,
  );

  let v: number | null = null;
  let speedNote: string | null = null;
  if (k > 0) {
    v = calculateAverageTrafficSpeed(q, k);
  } else if (q === 0 && k === 0) {
    speedNote = 'Speed not inferred when both flow and density are zero.';
  } else {
    speedNote = 'Speed undefined when density is zero (cannot divide by zero).';
  }

  let headway: number | null = null;
  let headwayNote: string | null = null;
  if (q > 0) {
    headway = calculateAverageHeadway(q);
  } else {
    headwayNote = 'Undefined — no vehicles passing (zero flow).';
  }

  const spacing = k > 0 ? calculateAverageVehicleSpacing(k) : null;

  const formulaSteps = [
    `q = N/t = ${p.passingVehicles} / ${convertTimeToHours(p.observationTime, p.observationTimeUnit)} h = ${fmt(q, 4)} veh/h`,
    `k = N/L = ${p.segmentVehicles} / ${convertDistanceToKilometers(p.roadLength, p.roadLengthUnit)} km = ${fmt(k, 4)} veh/km`,
    v != null ? `v = q/k = ${fmt(q, 4)} / ${fmt(k, 4)} = ${fmt(v, 4)} km/h` : 'v = undefined',
    headway != null
      ? `h = 3600/q = ${fmt(headway, 4)} s`
      : 'h = undefined',
    spacing != null
      ? `s = 1000/k = ${fmt(spacing, 4)} m/vehicle`
      : 's = undefined',
  ];

  return {
    trafficFlowVehiclesPerHour: q,
    trafficDensityVehiclesPerKm: k,
    averageSpeedKmPerHour: v,
    headwaySeconds: headway,
    spacingMeters: spacing,
    flowDisplay: formatFlow(q, p.flowUnit),
    densityDisplay: formatDensity(k, p.densityUnit),
    speedDisplay: v != null ? formatSpeed(v, p.speedUnit) : null,
    headwayDisplay:
      headway != null ? formatHeadway(headway, p.headwayUnit) : null,
    spacingDisplay: spacing != null ? formatSpacing(spacing) : null,
    flowNote: null,
    densityNote: null,
    speedNote,
    headwayNote,
    formulaSteps,
    interpretation: `Macroscopic stream speed from consistent flow and density (space-mean style). Spacing is average length per vehicle including vehicle length, not necessarily clear gap.`,
  };
}

export interface DirectParams {
  mode: 'calculate-speed' | 'calculate-density' | 'calculate-flow';
  flowVehPerH: number | null;
  densityVehPerKm: number | null;
  speedKmH: number | null;
  flowUnit: FlowUnit;
  densityUnit: DensityUnit;
  speedUnit: SpeedUnit;
  headwayUnit: HeadwayUnit;
}

export function computeFromDirect(p: DirectParams): TrafficDensityResult {
  let q = p.flowVehPerH;
  let k = p.densityVehPerKm;
  let v = p.speedKmH;

  if (p.mode === 'calculate-speed' && q != null && k != null) {
    if (k > 0) v = calculateAverageTrafficSpeed(q, k);
    else v = null;
  } else if (p.mode === 'calculate-density' && q != null && v != null) {
    if (v > 0) k = calculateDensityFromFlowAndSpeed(q, v);
    else k = null;
  } else if (p.mode === 'calculate-flow' && k != null && v != null) {
    q = calculateFlowFromDensityAndSpeed(k, v);
  }

  let headway: number | null = null;
  let headwayNote: string | null = null;
  if (q != null && q > 0) headway = calculateAverageHeadway(q);
  else if (q === 0) headwayNote = 'Undefined — no vehicles passing (zero flow).';

  const spacing =
    k != null && k > 0 ? calculateAverageVehicleSpacing(k) : null;

  let speedNote: string | null = null;
  if (p.mode === 'calculate-speed' && (k == null || k === 0) && q != null) {
    speedNote = 'Speed undefined when density is zero.';
  }

  const formulaSteps: string[] = [];
  if (q != null) formulaSteps.push(`q = ${fmt(q, 4)} veh/h`);
  if (k != null) formulaSteps.push(`k = ${fmt(k, 4)} veh/km`);
  if (v != null) formulaSteps.push(`v = ${fmt(v, 4)} km/h`);
  if (headway != null) formulaSteps.push(`h = ${fmt(headway, 4)} s`);
  if (spacing != null) formulaSteps.push(`s = ${fmt(spacing, 4)} m`);

  return {
    trafficFlowVehiclesPerHour: q,
    trafficDensityVehiclesPerKm: k,
    averageSpeedKmPerHour: v,
    headwaySeconds: headway,
    spacingMeters: spacing,
    flowDisplay: q != null ? formatFlow(q, p.flowUnit) : null,
    densityDisplay: k != null ? formatDensity(k, p.densityUnit) : null,
    speedDisplay: v != null ? formatSpeed(v, p.speedUnit) : null,
    headwayDisplay:
      headway != null ? formatHeadway(headway, p.headwayUnit) : null,
    spacingDisplay: spacing != null ? formatSpacing(spacing) : null,
    flowNote: null,
    densityNote: null,
    speedNote,
    headwayNote,
    formulaSteps,
    interpretation:
      'Direct fundamental diagram solve: q = k × v. Keep flow and density on the same road scope (lanes/direction).',
  };
}
