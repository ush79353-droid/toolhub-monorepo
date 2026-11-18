import {
  fromLiters as fromLitersShared,
  toLiters as toLitersShared,
} from '../volume-conversion/calculation';
import {
  FIELD_KEYS,
  ML_PER_METRIC_TSP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_TSP,
  ML_PER_US_TBSP,
  TEASPOON_TO_ML,
  unitSymbol,
  type TeaspoonStandard,
  type TspMlField,
  type TspToMlResult,
  type VolumeUnitId,
} from './types';

export {
  ML_PER_METRIC_TSP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_TSP,
  ML_PER_US_TBSP,
  TEASPOON_TO_ML,
};
export type { TeaspoonStandard };

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

export function teaspoonsToMl(
  teaspoons: number,
  standard: TeaspoonStandard = 'metric',
): number {
  return teaspoons * TEASPOON_TO_ML[standard];
}

export function mlToTeaspoons(
  milliliters: number,
  standard: TeaspoonStandard = 'metric',
): number {
  return milliliters / TEASPOON_TO_ML[standard];
}

export function mlToCc(milliliters: number): number {
  return milliliters;
}

export function ccToMl(cubicCentimeters: number): number {
  return cubicCentimeters;
}

export function millilitersFromValue(value: number, unit: VolumeUnitId): number {
  return toLiters(value, unit) * 1000;
}

export function valueFromMilliliters(ml: number, unit: VolumeUnitId): number {
  return fromLiters(ml / 1000, unit);
}

export function valuesFromMilliliters(
  ml: number,
  units: Record<TspMlField, VolumeUnitId>,
): Record<TspMlField, number> {
  return {
    teaspoons: valueFromMilliliters(ml, units.teaspoons),
    milliliters: valueFromMilliliters(ml, units.milliliters),
    other: valueFromMilliliters(ml, units.other),
  };
}

export function buildResult(
  ml: number,
  units: Record<TspMlField, VolumeUnitId>,
): TspToMlResult {
  return {
    milliliters: ml,
    units,
    values: valuesFromMilliliters(ml, units),
  };
}

export function summaryLines(result: TspToMlResult): string[] {
  return FIELD_KEYS.map(
    (field) =>
      `${formatVolume(result.values[field])} ${unitSymbol(result.units[field])}`,
  );
}

export function shareResultText(result: TspToMlResult): string {
  const tsp = result.values.teaspoons;
  const tspSym = unitSymbol(result.units.teaspoons);
  const ml = result.values.milliliters;
  const mlSym = unitSymbol(result.units.milliliters);
  const other = result.values.other;
  const otherSym = unitSymbol(result.units.other);
  const standard =
    result.units.teaspoons === 'usTsp' ? 'US customary' : 'Metric';
  return [
    'tsp to mL Converter',
    'Omega Calculators',
    '',
    `Teaspoon standard: ${standard}`,
    `${formatVolume(tsp)} ${tspSym} = ${formatVolume(ml)} ${mlSym}`,
    `${formatVolume(ml)} ${mlSym} = ${formatVolume(other)} ${otherSym}`,
    '',
    '/tools/tsp-to-ml-converter',
  ].join('\n');
}
