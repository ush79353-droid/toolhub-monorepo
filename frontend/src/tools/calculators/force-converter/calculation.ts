import {
  FORCE_UNIT_BY_ID,
  OTHER_UNIT_IDS,
  type ForceConverterResult,
  type ForceUnitId,
  type OtherUnitRow,
} from './types';

/** Readable force display without ugly trailing zeros or float noise. */
export function formatForce(value: number): string {
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
  // Collapse binary float noise near integers (e.g. 1 N → 100000 dyn).
  if (Math.abs(rounded) >= 1) {
    const nearest = Math.round(rounded);
    if (Math.abs(rounded - nearest) < 1e-8 * Math.max(1, Math.abs(nearest))) {
      return String(nearest);
    }
  }
  return String(rounded);
}

export function toNewtons(value: number, unit: ForceUnitId): number {
  return value * FORCE_UNIT_BY_ID[unit].newtonsPerUnit;
}

export function fromNewtons(newtons: number, unit: ForceUnitId): number {
  return newtons / FORCE_UNIT_BY_ID[unit].newtonsPerUnit;
}

export function convertForce(value: number, from: ForceUnitId, to: ForceUnitId): number {
  if (from === to) return value;
  return fromNewtons(toNewtons(value, from), to);
}

export function valuesFromNewtons(
  newtons: number,
  units: readonly [
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
  ]
): readonly [number, number, number, number, number, number, number] {
  return [
    fromNewtons(newtons, units[0]),
    fromNewtons(newtons, units[1]),
    fromNewtons(newtons, units[2]),
    fromNewtons(newtons, units[3]),
    fromNewtons(newtons, units[4]),
    fromNewtons(newtons, units[5]),
    fromNewtons(newtons, units[6]),
  ];
}

export function otherUnitsFromNewtons(newtons: number): readonly OtherUnitRow[] {
  return OTHER_UNIT_IDS.map((id) => {
    const def = FORCE_UNIT_BY_ID[id];
    return {
      id,
      label: def.label,
      symbol: def.symbol,
      value: fromNewtons(newtons, id),
    };
  });
}

export function buildResult(
  newtons: number,
  units: readonly [
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
  ]
): ForceConverterResult {
  return {
    newtons,
    values: valuesFromNewtons(newtons, units),
    units,
    otherUnits: otherUnitsFromNewtons(newtons),
  };
}
