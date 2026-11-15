import {
  LENGTH_UNIT_BY_ID,
  OTHER_UNIT_IDS,
  type LengthConverterResult,
  type LengthUnitId,
  type OtherUnitRow,
} from './types';

/** Readable length display without ugly trailing zeros or float noise. */
export function formatLength(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-6)) {
    return value
      .toExponential(8)
      .replace(/(\.\d*?[1-9])0+e/, '$1e')
      .replace(/\.0+e/, 'e')
      .replace(/e\+?/, 'e');
  }

  let digits = 10;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 10;
  else digits = 12;

  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function toMeters(value: number, unit: LengthUnitId): number {
  return value * LENGTH_UNIT_BY_ID[unit].factorToMeters;
}

export function fromMeters(meters: number, unit: LengthUnitId): number {
  return meters / LENGTH_UNIT_BY_ID[unit].factorToMeters;
}

export function convertLength(value: number, from: LengthUnitId, to: LengthUnitId): number {
  if (from === to) return value;
  return fromMeters(toMeters(value, from), to);
}

export function valuesFromMeters(
  meters: number,
  units: readonly [
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
  ]
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

export function otherUnitsFromMeters(meters: number): readonly OtherUnitRow[] {
  return OTHER_UNIT_IDS.map((id) => {
    const def = LENGTH_UNIT_BY_ID[id];
    return {
      id,
      label: def.label,
      symbol: def.symbol,
      value: fromMeters(meters, id),
    };
  });
}

export function buildResult(
  meters: number,
  units: readonly [
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
  ]
): LengthConverterResult {
  return {
    meters,
    values: valuesFromMeters(meters, units),
    units,
    otherUnits: otherUnitsFromMeters(meters),
  };
}
