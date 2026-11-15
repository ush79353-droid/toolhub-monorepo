import {
  LIGHT_YEAR_UNIT_BY_ID,
  type LightYearConversionResult,
  type LightYearUnitId,
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

export function toMeters(value: number, unit: LightYearUnitId): number {
  return value * LIGHT_YEAR_UNIT_BY_ID[unit].factorToMeters;
}

export function fromMeters(meters: number, unit: LightYearUnitId): number {
  return meters / LIGHT_YEAR_UNIT_BY_ID[unit].factorToMeters;
}

export function convertDistance(
  value: number,
  from: LightYearUnitId,
  to: LightYearUnitId
): number {
  if (from === to) return value;
  return fromMeters(toMeters(value, from), to);
}

export function valuesFromMeters(
  meters: number,
  units: readonly [LightYearUnitId, LightYearUnitId, LightYearUnitId, LightYearUnitId]
): readonly [number, number, number, number] {
  return [
    fromMeters(meters, units[0]),
    fromMeters(meters, units[1]),
    fromMeters(meters, units[2]),
    fromMeters(meters, units[3]),
  ];
}

export function buildResult(
  meters: number,
  units: readonly [LightYearUnitId, LightYearUnitId, LightYearUnitId, LightYearUnitId]
): LightYearConversionResult {
  return {
    meters,
    values: valuesFromMeters(meters, units),
    units,
  };
}
