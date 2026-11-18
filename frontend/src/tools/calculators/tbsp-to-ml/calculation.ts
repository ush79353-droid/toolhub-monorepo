import {
  fromLiters as fromLitersShared,
  toLiters as toLitersShared,
} from '../volume-conversion/calculation';
import {
  FIELD_KEYS,
  ML_PER_AU_TBSP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_CUP,
  ML_PER_US_TBSP,
  ML_PER_US_TSP,
  TABLESPOON_TO_ML,
  unitSymbol,
  type TablespoonStandard,
  type TbspMlField,
  type TbspToMlResult,
  type VolumeUnitId,
} from './types';

export {
  ML_PER_AU_TBSP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_CUP,
  ML_PER_US_TBSP,
  ML_PER_US_TSP,
  TABLESPOON_TO_ML,
};
export type { TablespoonStandard };

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

export function tablespoonsToMl(
  tablespoons: number,
  standard: TablespoonStandard = 'us',
): number {
  return tablespoons * TABLESPOON_TO_ML[standard];
}

export function mlToTablespoons(
  milliliters: number,
  standard: TablespoonStandard = 'us',
): number {
  return milliliters / TABLESPOON_TO_ML[standard];
}

export function usTablespoonsToMl(tbsp: number): number {
  return tablespoonsToMl(tbsp, 'us');
}

export function mlToUsTablespoons(ml: number): number {
  return mlToTablespoons(ml, 'us');
}

export function metricTablespoonsToMl(tbsp: number): number {
  return tablespoonsToMl(tbsp, 'metric');
}

export function mlToMetricTablespoons(ml: number): number {
  return mlToTablespoons(ml, 'metric');
}

export function australianTablespoonsToMl(tbsp: number): number {
  return tablespoonsToMl(tbsp, 'australian');
}

export function mlToAustralianTablespoons(ml: number): number {
  return mlToTablespoons(ml, 'australian');
}

export function millilitersFromValue(value: number, unit: VolumeUnitId): number {
  return toLiters(value, unit) * 1000;
}

export function valueFromMilliliters(ml: number, unit: VolumeUnitId): number {
  return fromLiters(ml / 1000, unit);
}

export function valuesFromMilliliters(
  ml: number,
  units: Record<TbspMlField, VolumeUnitId>,
): Record<TbspMlField, number> {
  return {
    tablespoons: valueFromMilliliters(ml, units.tablespoons),
    milliliters: valueFromMilliliters(ml, units.milliliters),
    other: valueFromMilliliters(ml, units.other),
  };
}

export function buildResult(
  ml: number,
  units: Record<TbspMlField, VolumeUnitId>,
): TbspToMlResult {
  return {
    milliliters: ml,
    units,
    values: valuesFromMilliliters(ml, units),
  };
}

export function summaryLines(result: TbspToMlResult): string[] {
  return FIELD_KEYS.map(
    (field) =>
      `${formatVolume(result.values[field])} ${unitSymbol(result.units[field])}`,
  );
}

export function shareResultText(result: TbspToMlResult): string {
  const tbsp = result.values.tablespoons;
  const tbspSym = unitSymbol(result.units.tablespoons);
  const ml = result.values.milliliters;
  const mlSym = unitSymbol(result.units.milliliters);
  const other = result.values.other;
  const otherSym = unitSymbol(result.units.other);
  return [
    'Tbsp to mL Converter',
    'Omega Calculators',
    '',
    `${formatVolume(tbsp)} ${tbspSym} ≈ ${formatVolume(ml)} ${mlSym}`,
    `${formatVolume(tbsp)} ${tbspSym} ≈ ${formatVolume(other)} ${otherSym}`,
    '',
    '/tools/tbsp-to-ml-converter',
  ].join('\n');
}
