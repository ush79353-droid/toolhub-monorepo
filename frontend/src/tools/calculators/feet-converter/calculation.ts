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

/** Feet-focused alias over the shared meter-converter length engine. */
export function convertFeet(
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
    'Feet Converter | Omega Calculators',
    '',
    `${formatLength(values.ft)} ${UNIT_SYMBOLS.ft} equals:`,
    '',
    `${formatLength(values.mm)} millimeters`,
    `${formatLength(values.cm)} centimeters`,
    `${formatLength(values.m)} meters`,
    `${formatLength(values.km)} kilometers`,
    `${formatLength(values.in)} inches`,
    `${formatLength(values.yd)} yards`,
    `${formatLength(values.mi)} miles`,
    `${formatLength(values.nmi)} nautical miles`,
    '',
    `1 ft = 0.3048 m · Primary: ${formatLength(values.ft)} ${UNIT_SYMBOLS.ft}`,
  ].join('\n');
}
