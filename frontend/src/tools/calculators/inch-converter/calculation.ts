import {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import { METERS_PER_UNIT, UNIT_SYMBOLS, type LengthUnit } from './types';

export {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';

/** Inch-focused alias over the shared meter-converter length engine. */
export function convertInches(
  value: number,
  fromUnit: LengthUnit,
  toUnit: LengthUnit,
): number {
  if (!Number.isFinite(value)) {
    throw new Error('Invalid length value');
  }
  const meters = value * METERS_PER_UNIT[fromUnit];
  if (!Number.isFinite(meters)) {
    throw new Error('Length is out of supported range');
  }
  const result = meters / METERS_PER_UNIT[toUnit];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of supported range');
  }
  return result;
}

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  return [
    'Inch Converter | Omega Calculators',
    '',
    `Input: ${formatLength(values.in)} inches`,
    '',
    `Millimeters: ${formatLength(values.mm)} ${UNIT_SYMBOLS.mm}`,
    `Centimeters: ${formatLength(values.cm)} ${UNIT_SYMBOLS.cm}`,
    `Meters: ${formatLength(values.m)} ${UNIT_SYMBOLS.m}`,
    `Feet: ${formatLength(values.ft)} ${UNIT_SYMBOLS.ft}`,
    `Yards: ${formatLength(values.yd)} ${UNIT_SYMBOLS.yd}`,
    `Miles: ${formatLength(values.mi)} ${UNIT_SYMBOLS.mi}`,
    '',
    '1 in = 0.0254 m exactly',
  ].join('\n');
}
