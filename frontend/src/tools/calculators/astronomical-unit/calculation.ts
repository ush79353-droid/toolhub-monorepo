import {
  AU_UNIT_BY_ID,
  SPEED_OF_LIGHT_MPS,
  type AstronomicalUnitResult,
  type AuUnitId,
} from './types';

/** Readable astronomical distance display with scientific notation when helpful. */
export function formatDistance(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-4)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/, '$1e')
      .replace(/\.0+e/, 'e')
      .replace(/e\+?/, 'e');
  }

  let digits = 10;
  if (abs >= 1_000_000) digits = 8;
  else if (abs >= 1) digits = 10;
  else digits = 12;

  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function toMeters(value: number, unit: AuUnitId): number {
  return value * AU_UNIT_BY_ID[unit].factorToMeters;
}

export function fromMeters(meters: number, unit: AuUnitId): number {
  return meters / AU_UNIT_BY_ID[unit].factorToMeters;
}

export function convertDistance(value: number, from: AuUnitId, to: AuUnitId): number {
  if (from === to) return value;
  return fromMeters(toMeters(value, from), to);
}

export function valuesFromMeters(
  meters: number,
  units: readonly [AuUnitId, AuUnitId, AuUnitId, AuUnitId, AuUnitId, AuUnitId]
): readonly [number, number, number, number, number, number] {
  return [
    fromMeters(meters, units[0]),
    fromMeters(meters, units[1]),
    fromMeters(meters, units[2]),
    fromMeters(meters, units[3]),
    fromMeters(meters, units[4]),
    fromMeters(meters, units[5]),
  ];
}

/** Vacuum light-travel time for a distance in meters. */
export function lightTravelSeconds(meters: number): number {
  return meters / SPEED_OF_LIGHT_MPS;
}

export function formatLightTravelTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '';
  if (seconds < 60) return `${formatDistance(seconds)} s`;
  const wholeMinutes = Math.floor(seconds / 60);
  const rem = seconds - wholeMinutes * 60;
  if (wholeMinutes < 60) {
    return `${wholeMinutes} min ${formatDistance(rem)} s`;
  }
  const hours = Math.floor(wholeMinutes / 60);
  const minutes = wholeMinutes % 60;
  return `${hours} h ${minutes} min ${formatDistance(rem)} s`;
}

export function buildResult(
  meters: number,
  units: readonly [AuUnitId, AuUnitId, AuUnitId, AuUnitId, AuUnitId, AuUnitId]
): AstronomicalUnitResult {
  return {
    meters,
    values: valuesFromMeters(meters, units),
    units,
    lightTravelSeconds: lightTravelSeconds(meters),
  };
}
