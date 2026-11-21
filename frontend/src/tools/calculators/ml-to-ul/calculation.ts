import {
  fromLiters as fromLitersShared,
  toLiters as toLitersShared,
} from '../volume-conversion/calculation';
import {
  FIELD_KEYS,
  UL_PER_ML,
  unitSymbol,
  type MlUlField,
  type MlToUlResult,
  type VolumeUnitId,
} from './types';

export { UL_PER_ML };

export function formatVolume(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function toLiters(value: number, unit: VolumeUnitId): number {
  return toLitersShared(value, unit);
}

export function fromLiters(liters: number, unit: VolumeUnitId): number {
  return fromLitersShared(liters, unit);
}

export function mlToMicroliters(ml: number): number {
  return ml * UL_PER_ML;
}

export function microlitersToMl(microliters: number): number {
  return microliters / UL_PER_ML;
}

export function millilitersFromValue(value: number, unit: VolumeUnitId): number {
  // Exact path for primary units — avoids liter-scale float noise (1e-6 L).
  if (unit === 'mL' || unit === 'cm3') return value;
  if (unit === 'uL') return microlitersToMl(value);
  return toLiters(value, unit) * 1000;
}

export function valueFromMilliliters(ml: number, unit: VolumeUnitId): number {
  if (unit === 'mL' || unit === 'cm3') return ml;
  if (unit === 'uL') return mlToMicroliters(ml);
  return fromLiters(ml / 1000, unit);
}

export function valuesFromMilliliters(
  ml: number,
  units: Record<MlUlField, VolumeUnitId>,
): Record<MlUlField, number> {
  return {
    milliliters: valueFromMilliliters(ml, units.milliliters),
    microliters: valueFromMilliliters(ml, units.microliters),
    other: valueFromMilliliters(ml, units.other),
  };
}

export function buildResult(
  ml: number,
  units: Record<MlUlField, VolumeUnitId>,
): MlToUlResult {
  return {
    milliliters: ml,
    units,
    values: valuesFromMilliliters(ml, units),
  };
}

export function summaryLines(result: MlToUlResult): string[] {
  return FIELD_KEYS.map(
    (field) =>
      `${formatVolume(result.values[field])} ${unitSymbol(result.units[field])}`,
  );
}

export function shareResultText(result: MlToUlResult): string {
  const ml = result.milliliters;
  const ul = mlToMicroliters(ml);
  return [
    'mL to µL Conversion | Omega Calculators',
    '',
    `${formatVolume(ml)} mL = ${formatVolume(ul)} µL`,
    '',
    '/tools/ml-to-ul-conversion',
  ].join('\n');
}
