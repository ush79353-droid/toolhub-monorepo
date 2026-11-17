import {
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../length-converter/calculation';
import {
  ALL_DISTANCE_UNITS,
  DISTANCE_METERS_PER_UNIT,
  type DistanceConverterInput,
  type DistanceConverterResult,
  type DistanceSource,
  type DistanceUnit,
  type DistanceValues,
} from './types';

export { formatLength } from '../length-converter/calculation';
export { DISTANCE_METERS_PER_UNIT };

export function convertDistance(value: number, from: DistanceUnit, to: DistanceUnit): number {
  if (!Number.isFinite(value)) {
    throw new Error('Invalid distance value');
  }
  const meters = value * DISTANCE_METERS_PER_UNIT[from as DistanceSource];
  if (!Number.isFinite(meters)) {
    throw new Error('Distance is out of range');
  }
  const result = meters / DISTANCE_METERS_PER_UNIT[to as DistanceSource];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function valuesFromMeters(meters: number): DistanceValues {
  const values = {} as DistanceValues;
  for (const unit of ALL_DISTANCE_UNITS) {
    values[unit] = fromMeters(meters, unit);
  }
  return values;
}

export function calculateDistance(input: DistanceConverterInput): DistanceConverterResult {
  if (input.value === null) {
    throw new Error('Missing distance value');
  }
  const meters = toMeters(input.value, input.source);
  if (!Number.isFinite(meters)) {
    throw new Error('Distance is out of range');
  }
  return {
    source: input.source,
    meters,
    values: valuesFromMeters(meters),
  };
}

export function shareResultText(result: DistanceConverterResult): string {
  const primary: DistanceSource[] = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'];
  const lines = [
    'Distance Converter — Omega Calculators',
    '',
    `Source: ${formatLength(result.values[result.source])} ${result.source}`,
    '',
  ];
  for (const unit of primary) {
    lines.push(`${unit}: ${formatLength(result.values[unit])}`);
  }
  return lines.join('\n');
}

/** Convenience re-export for tests that compare via the shared length engine. */
export function convertViaLengthEngine(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  return convertLength(value, from, to);
}
