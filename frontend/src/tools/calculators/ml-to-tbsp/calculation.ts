import {
  fromLiters as fromLitersShared,
  toLiters as toLitersShared,
} from '../volume-conversion/calculation';
import {
  FIELD_KEYS,
  ML_PER_AU_TBSP,
  ML_PER_IMPERIAL_TBSP,
  ML_PER_METRIC_CUP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_CUP,
  ML_PER_US_TBSP,
  ML_PER_US_TSP,
  unitSymbol,
  type MlTbspField,
  type MlToTbspResult,
  type VolumeUnitId,
} from './types';

export {
  ML_PER_AU_TBSP,
  ML_PER_IMPERIAL_TBSP,
  ML_PER_METRIC_CUP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_CUP,
  ML_PER_US_TBSP,
  ML_PER_US_TSP,
};

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

export function mlToUsTablespoons(ml: number): number {
  return ml / ML_PER_US_TBSP;
}

export function usTablespoonsToMl(tbsp: number): number {
  return tbsp * ML_PER_US_TBSP;
}

export function mlToMetricTablespoons(ml: number): number {
  return ml / ML_PER_METRIC_TBSP;
}

export function metricTablespoonsToMl(tbsp: number): number {
  return tbsp * ML_PER_METRIC_TBSP;
}

export function mlToAustralianTablespoons(ml: number): number {
  return ml / ML_PER_AU_TBSP;
}

export function australianTablespoonsToMl(tbsp: number): number {
  return tbsp * ML_PER_AU_TBSP;
}

export function mlToImperialTablespoons(ml: number): number {
  return ml / ML_PER_IMPERIAL_TBSP;
}

export function imperialTablespoonsToMl(tbsp: number): number {
  return tbsp * ML_PER_IMPERIAL_TBSP;
}

export function mlToUsCups(ml: number): number {
  return ml / ML_PER_US_CUP;
}

export function usCupsToMl(cups: number): number {
  return cups * ML_PER_US_CUP;
}

export function millilitersFromValue(value: number, unit: VolumeUnitId): number {
  return toLiters(value, unit) * 1000;
}

export function valueFromMilliliters(ml: number, unit: VolumeUnitId): number {
  return fromLiters(ml / 1000, unit);
}

export function valuesFromMilliliters(
  ml: number,
  units: Record<MlTbspField, VolumeUnitId>,
): Record<MlTbspField, number> {
  return {
    milliliters: valueFromMilliliters(ml, units.milliliters),
    tablespoons: valueFromMilliliters(ml, units.tablespoons),
    other: valueFromMilliliters(ml, units.other),
  };
}

export function buildResult(
  ml: number,
  units: Record<MlTbspField, VolumeUnitId>,
): MlToTbspResult {
  return {
    milliliters: ml,
    units,
    values: valuesFromMilliliters(ml, units),
  };
}

export function summaryLines(result: MlToTbspResult): string[] {
  return FIELD_KEYS.map(
    (field) =>
      `${formatVolume(result.values[field])} ${unitSymbol(result.units[field])}`,
  );
}

export function shareResultText(result: MlToTbspResult): string {
  const ml = result.milliliters;
  const tbsp = result.values.tablespoons;
  const tbspSym = unitSymbol(result.units.tablespoons);
  const other = result.values.other;
  const otherSym = unitSymbol(result.units.other);
  return [
    'mL to tbsp Converter | Omega Calculators',
    '',
    `${formatVolume(ml)} mL = ${formatVolume(tbsp)} ${tbspSym}`,
    `${formatVolume(ml)} mL = ${formatVolume(other)} ${otherSym}`,
    '',
    '/tools/ml-to-tbsp-converter',
  ].join('\n');
}
