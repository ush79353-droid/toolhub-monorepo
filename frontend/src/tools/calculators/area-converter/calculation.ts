import {
  AREA_UNIT_BY_ID,
  type AreaConverterResult,
  type AreaUnitId,
} from './types';

/** Readable area display without ugly trailing zeros or float noise. */
export function formatArea(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-6)) {
    return value.toExponential(6).replace(/\.?0+e/, 'e').replace(/e\+?/, 'e');
  }

  let digits = 10;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 10;
  else digits = 12;

  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function toSquareMeters(value: number, unit: AreaUnitId): number {
  return value * AREA_UNIT_BY_ID[unit].toSquareMeters;
}

export function fromSquareMeters(squareMeters: number, unit: AreaUnitId): number {
  return squareMeters / AREA_UNIT_BY_ID[unit].toSquareMeters;
}

export function convertArea(
  value: number,
  from: AreaUnitId,
  to: AreaUnitId
): number {
  if (from === to) return value;
  return fromSquareMeters(toSquareMeters(value, from), to);
}

export function valuesFromSquareMeters(
  squareMeters: number,
  units: readonly [AreaUnitId, AreaUnitId, AreaUnitId, AreaUnitId, AreaUnitId]
): readonly [number, number, number, number, number] {
  return [
    fromSquareMeters(squareMeters, units[0]),
    fromSquareMeters(squareMeters, units[1]),
    fromSquareMeters(squareMeters, units[2]),
    fromSquareMeters(squareMeters, units[3]),
    fromSquareMeters(squareMeters, units[4]),
  ];
}

export function buildResult(
  squareMeters: number,
  units: readonly [AreaUnitId, AreaUnitId, AreaUnitId, AreaUnitId, AreaUnitId]
): AreaConverterResult {
  return {
    squareMeters,
    values: valuesFromSquareMeters(squareMeters, units),
    units,
  };
}
