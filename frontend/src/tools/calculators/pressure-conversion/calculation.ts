import {
  PRESSURE_UNIT_BY_ID,
  OTHER_UNIT_IDS,
  type PressureConverterResult,
  type PressureUnitId,
  type OtherUnitRow,
} from './types';

/** Readable pressure display without ugly trailing zeros or float noise. */
export function formatPressure(value: number): string {
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

  let digits = 12;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 12;
  else digits = 14;

  const rounded = Number(value.toFixed(digits));
  if (Math.abs(rounded) >= 1) {
    const nearest = Math.round(rounded);
    if (Math.abs(rounded - nearest) < 1e-8 * Math.max(1, Math.abs(nearest))) {
      return String(nearest);
    }
  }
  return String(rounded);
}

export function toPascals(value: number, unit: PressureUnitId): number {
  return value * PRESSURE_UNIT_BY_ID[unit].pascalsPerUnit;
}

export function fromPascals(pascals: number, unit: PressureUnitId): number {
  return pascals / PRESSURE_UNIT_BY_ID[unit].pascalsPerUnit;
}

export function convertPressure(
  value: number,
  from: PressureUnitId,
  to: PressureUnitId
): number {
  if (from === to) return value;
  return fromPascals(toPascals(value, from), to);
}

export function valuesFromPascals(
  pascals: number,
  units: readonly [PressureUnitId, PressureUnitId, PressureUnitId, PressureUnitId]
): readonly [number, number, number, number] {
  return [
    fromPascals(pascals, units[0]),
    fromPascals(pascals, units[1]),
    fromPascals(pascals, units[2]),
    fromPascals(pascals, units[3]),
  ];
}

export function otherUnitsFromPascals(pascals: number): readonly OtherUnitRow[] {
  return OTHER_UNIT_IDS.map((id) => {
    const def = PRESSURE_UNIT_BY_ID[id];
    return {
      id,
      label: def.label,
      symbol: def.symbol,
      value: fromPascals(pascals, id),
    };
  });
}

export function buildResult(
  pascals: number,
  units: readonly [PressureUnitId, PressureUnitId, PressureUnitId, PressureUnitId]
): PressureConverterResult {
  return {
    pascals,
    values: valuesFromPascals(pascals, units),
    units,
    otherUnits: otherUnitsFromPascals(pascals),
  };
}
