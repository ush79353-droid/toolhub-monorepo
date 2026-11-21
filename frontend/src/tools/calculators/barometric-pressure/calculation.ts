import {
  DEFAULT_FIELD_UNITS,
  OTHER_UNIT_IDS,
  PRESSURE_TO_PASCALS,
  PRESSURE_UNIT_BY_ID,
  type BarometricPressureResult,
  type OtherUnitRow,
  type PressureUnitId,
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

export function pressureToPascals(value: number, sourceFactor: number): number {
  return value * sourceFactor;
}

export function pascalsToPressure(pascals: number, targetFactor: number): number {
  return pascals / targetFactor;
}

export function convertPressureByFactor(
  value: number,
  sourceFactor: number,
  targetFactor: number,
): number {
  return (value * sourceFactor) / targetFactor;
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
  to: PressureUnitId,
): number {
  if (from === to) return value;
  return fromPascals(toPascals(value, from), to);
}

export function valuesFromPascals(
  pascals: number,
  units: readonly [PressureUnitId, PressureUnitId, PressureUnitId, PressureUnitId],
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
  units: readonly [PressureUnitId, PressureUnitId, PressureUnitId, PressureUnitId],
  sourceField: BarometricPressureResult['sourceField'] = 0,
): BarometricPressureResult {
  return {
    pascals,
    sourceField,
    values: valuesFromPascals(pascals, units),
    units,
    otherUnits: otherUnitsFromPascals(pascals),
  };
}

export function shareResultText(result: BarometricPressureResult): string {
  const sourceUnit = PRESSURE_UNIT_BY_ID[result.units[result.sourceField]];
  const sourceValue = result.values[result.sourceField];
  const lines = [
    'Barometric Pressure Conversion | Omega Calculators',
    '',
    'Input:',
    `${formatPressure(sourceValue)} ${sourceUnit.symbol}`,
    '',
    'Results:',
  ];
  result.values.forEach((value, index) => {
    const symbol = PRESSURE_UNIT_BY_ID[result.units[index]!].symbol;
    lines.push(`${formatPressure(value)} ${symbol}`);
  });
  lines.push(
    '',
    'Formula:',
    `Pa = value × factor(${sourceUnit.symbol})`,
    `Canonical: ${formatPressure(result.pascals)} Pa`,
  );
  return lines.join('\n');
}

/** Convenience: 1 atm displayed across default fields. */
export function defaultResult(): BarometricPressureResult {
  return buildResult(
    PRESSURE_TO_PASCALS.atm,
    [...DEFAULT_FIELD_UNITS],
    0,
  );
}
