import {
  fromLiters as fromLitersShared,
  toLiters as toLitersShared,
} from '../volume-conversion/calculation';
import {
  FIELD_KEYS,
  ML_PER_IMPERIAL_TSP,
  ML_PER_METRIC_TSP,
  ML_PER_US_TBSP,
  ML_PER_US_TSP,
  unitSymbol,
  type MlTspField,
  type MlToTspResult,
  type VolumeUnitId,
} from './types';

export {
  ML_PER_IMPERIAL_TSP,
  ML_PER_METRIC_TSP,
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

export function mlToUsTeaspoons(ml: number): number {
  return ml / ML_PER_US_TSP;
}

export function usTeaspoonsToMl(tsp: number): number {
  return tsp * ML_PER_US_TSP;
}

export function mlToMetricTeaspoons(ml: number): number {
  return ml / ML_PER_METRIC_TSP;
}

export function metricTeaspoonsToMl(tsp: number): number {
  return tsp * ML_PER_METRIC_TSP;
}

export function mlToImperialTeaspoons(ml: number): number {
  return ml / ML_PER_IMPERIAL_TSP;
}

export function imperialTeaspoonsToMl(tsp: number): number {
  return tsp * ML_PER_IMPERIAL_TSP;
}

export function millilitersFromValue(value: number, unit: VolumeUnitId): number {
  return toLiters(value, unit) * 1000;
}

export function valueFromMilliliters(ml: number, unit: VolumeUnitId): number {
  return fromLiters(ml / 1000, unit);
}

export function valuesFromMilliliters(
  ml: number,
  units: Record<MlTspField, VolumeUnitId>,
): Record<MlTspField, number> {
  return {
    milliliters: valueFromMilliliters(ml, units.milliliters),
    teaspoons: valueFromMilliliters(ml, units.teaspoons),
  };
}

export function buildResult(
  ml: number,
  units: Record<MlTspField, VolumeUnitId>,
): MlToTspResult {
  return {
    milliliters: ml,
    units,
    values: valuesFromMilliliters(ml, units),
  };
}

export function summaryLines(result: MlToTspResult): string[] {
  return FIELD_KEYS.map(
    (field) =>
      `${formatVolume(result.values[field])} ${unitSymbol(result.units[field])}`,
  );
}

export function shareResultText(result: MlToTspResult): string {
  const ml = result.milliliters;
  const tsp = result.values.teaspoons;
  const tspSym = unitSymbol(result.units.teaspoons);
  return [
    'mL to tsp Converter — Omega Calculators',
    '',
    `${formatVolume(ml)} mL = ${formatVolume(tsp)} ${tspSym}`,
    '',
    '/tools/ml-to-tsp-converter',
  ].join('\n');
}
