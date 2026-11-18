import {
  fromLiters as fromLitersShared,
  toLiters as toLitersShared,
} from '../volume-conversion/calculation';
import {
  FIELD_KEYS,
  ML_PER_UK_FL_OZ,
  ML_PER_US_FL_OZ,
  unitSymbol,
  type MlOzField,
  type MlToOzResult,
  type VolumeUnitId,
} from './types';

export { ML_PER_UK_FL_OZ, ML_PER_US_FL_OZ };

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

export function mlToUsFluidOunces(ml: number): number {
  return ml / ML_PER_US_FL_OZ;
}

export function usFluidOuncesToMl(fluidOunces: number): number {
  return fluidOunces * ML_PER_US_FL_OZ;
}

export function mlToUkFluidOunces(ml: number): number {
  return ml / ML_PER_UK_FL_OZ;
}

export function ukFluidOuncesToMl(fluidOunces: number): number {
  return fluidOunces * ML_PER_UK_FL_OZ;
}

export function mlToCubicMeters(ml: number): number {
  return ml / 1_000_000;
}

export function millilitersToLiters(ml: number): number {
  return ml / 1000;
}

export function litersFromMilliliters(ml: number): number {
  return millilitersToLiters(ml);
}

export function millilitersFromValue(value: number, unit: VolumeUnitId): number {
  return toLiters(value, unit) * 1000;
}

export function valueFromMilliliters(ml: number, unit: VolumeUnitId): number {
  return fromLiters(ml / 1000, unit);
}

export function valuesFromMilliliters(
  ml: number,
  units: Record<MlOzField, VolumeUnitId>,
): Record<MlOzField, number> {
  return {
    milliliters: valueFromMilliliters(ml, units.milliliters),
    ounces: valueFromMilliliters(ml, units.ounces),
    other: valueFromMilliliters(ml, units.other),
  };
}

export function buildResult(
  ml: number,
  units: Record<MlOzField, VolumeUnitId>,
): MlToOzResult {
  return {
    milliliters: ml,
    units,
    values: valuesFromMilliliters(ml, units),
  };
}

export function summaryLines(result: MlToOzResult): string[] {
  return FIELD_KEYS.map(
    (field) =>
      `${formatVolume(result.values[field])} ${unitSymbol(result.units[field])}`,
  );
}

export function shareResultText(result: MlToOzResult): string {
  const ml = result.milliliters;
  const us = mlToUsFluidOunces(ml);
  const uk = mlToUkFluidOunces(ml);
  return [
    'mL to oz Converter — Omega Calculators',
    '',
    `${formatVolume(ml)} mL = ${formatVolume(us)} US fl oz`,
    `${formatVolume(ml)} mL = ${formatVolume(uk)} UK fl oz`,
    `${formatVolume(result.values.other)} ${unitSymbol(result.units.other)}`,
    '',
    '/tools/ml-to-oz-converter',
  ].join('\n');
}
