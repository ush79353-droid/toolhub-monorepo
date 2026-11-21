import { formatAngle } from '../coordinates/calculation';
import {
  PACE_DISTANCE_M,
  PACE_UNITS,
  PACE_UNIT_SYMBOLS,
  SPEED_TO_MPS,
  SPEED_UNITS,
  SPEED_UNIT_SYMBOLS,
  paceUsesMinutes,
  type PaceUnit,
  type SpeedUnit,
} from './types';

export function formatSpeed(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function toMetersPerSecond(value: number, unit: SpeedUnit): number {
  return value * SPEED_TO_MPS[unit];
}

export function fromMetersPerSecond(mps: number, unit: SpeedUnit): number {
  return mps / SPEED_TO_MPS[unit];
}

export function convertSpeed(value: number, from: SpeedUnit, to: SpeedUnit): number {
  return fromMetersPerSecond(toMetersPerSecond(value, from), to);
}

/** Time in seconds to cover `distanceMeters` at speed `mps`. Undefined if mps ≤ 0. */
export function speedToPaceSeconds(mps: number, distanceMeters: number): number | null {
  if (!(mps > 0) || !Number.isFinite(mps) || !(distanceMeters > 0)) return null;
  return distanceMeters / mps;
}

export function paceSecondsToSpeed(paceSeconds: number, distanceMeters: number): number | null {
  if (!(paceSeconds > 0) || !Number.isFinite(paceSeconds) || !(distanceMeters > 0)) return null;
  return distanceMeters / paceSeconds;
}

/** Display value for a pace unit from m/s (minutes or seconds depending on unit). */
export function fromMetersPerSecondPace(mps: number, unit: PaceUnit): number | null {
  const seconds = speedToPaceSeconds(mps, PACE_DISTANCE_M[unit]);
  if (seconds == null) return null;
  return paceUsesMinutes(unit) ? seconds / 60 : seconds;
}

/** Convert paced display value to m/s. */
export function paceToMetersPerSecond(value: number, unit: PaceUnit): number | null {
  const seconds = paceUsesMinutes(unit) ? value * 60 : value;
  return paceSecondsToSpeed(seconds, PACE_DISTANCE_M[unit]);
}

export function allFromMps(mps: number): {
  speeds: Record<SpeedUnit, number>;
  paces: Partial<Record<PaceUnit, number | null>>;
} {
  const speeds = {} as Record<SpeedUnit, number>;
  for (const unit of SPEED_UNITS) speeds[unit] = fromMetersPerSecond(mps, unit);
  const paces = {} as Partial<Record<PaceUnit, number | null>>;
  for (const unit of PACE_UNITS) paces[unit] = fromMetersPerSecondPace(mps, unit);
  return { speeds, paces };
}

export function shareResultText(mps: number): string {
  const { speeds, paces } = allFromMps(mps);
  const lines = [
    'Speed Conversion | Omega Calculators',
    '',
    `${formatSpeed(speeds.mph)} mph`,
    `${formatSpeed(speeds.kmh)} km/h`,
    `${formatSpeed(speeds.mps)} m/s`,
    `${formatSpeed(speeds.knot)} kn`,
  ];
  if (paces.minPerKm != null) {
    lines.push(`${formatSpeed(paces.minPerKm)} min/km`);
  }
  if (paces.minPerMile != null) {
    lines.push(`${formatSpeed(paces.minPerMile)} min/mi`);
  }
  lines.push('', 'Calculated with Omega Calculators');
  return lines.join('\n');
}

export { SPEED_UNIT_SYMBOLS, PACE_UNIT_SYMBOLS };
