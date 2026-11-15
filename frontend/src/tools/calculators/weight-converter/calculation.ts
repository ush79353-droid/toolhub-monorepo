import {
  MASS_UNIT_BY_ID,
  OTHER_UNIT_IDS,
  type MassUnitId,
  type OtherUnitRow,
  type WeightConverterResult,
} from './types';

/** Readable mass display without ugly trailing zeros or float noise. */
export function formatMass(value: number): string {
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
  return String(rounded);
}

export function toKilograms(value: number, unit: MassUnitId): number {
  return value * MASS_UNIT_BY_ID[unit].kilogramsPerUnit;
}

export function fromKilograms(kilograms: number, unit: MassUnitId): number {
  return kilograms / MASS_UNIT_BY_ID[unit].kilogramsPerUnit;
}

export function convertMass(value: number, from: MassUnitId, to: MassUnitId): number {
  if (from === to) return value;
  return fromKilograms(toKilograms(value, from), to);
}

export function valuesFromKilograms(
  kilograms: number,
  units: readonly [
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
  ]
): readonly [number, number, number, number, number, number, number, number] {
  return [
    fromKilograms(kilograms, units[0]),
    fromKilograms(kilograms, units[1]),
    fromKilograms(kilograms, units[2]),
    fromKilograms(kilograms, units[3]),
    fromKilograms(kilograms, units[4]),
    fromKilograms(kilograms, units[5]),
    fromKilograms(kilograms, units[6]),
    fromKilograms(kilograms, units[7]),
  ];
}

export function otherUnitsFromKilograms(kilograms: number): readonly OtherUnitRow[] {
  return OTHER_UNIT_IDS.map((id) => {
    const def = MASS_UNIT_BY_ID[id];
    return {
      id,
      label: def.label,
      symbol: def.symbol,
      value: fromKilograms(kilograms, id),
      approximate: def.approximate,
    };
  });
}

export function buildResult(
  kilograms: number,
  units: readonly [
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
  ]
): WeightConverterResult {
  return {
    kilograms,
    values: valuesFromKilograms(kilograms, units),
    units,
    otherUnits: otherUnitsFromKilograms(kilograms),
  };
}
