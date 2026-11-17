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

/** Decimeter-focused alias over the shared meter-converter length engine. */
export function convertDm(value: number, fromUnit: LengthUnit, toUnit: LengthUnit): number {
  if (!Number.isFinite(value)) {
    throw new Error('Invalid distance value');
  }
  const meters = value * METERS_PER_UNIT[fromUnit];
  if (!Number.isFinite(meters)) {
    throw new Error('Distance is out of supported range');
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
    'dm Converter — Omega Calculators',
    '',
    `${formatLength(values.dm)} ${UNIT_SYMBOLS.dm} equals:`,
    '',
    `${formatLength(values.mm)} millimeters`,
    `${formatLength(values.cm)} centimeters`,
    `${formatLength(values.m)} meters`,
    `${formatLength(values.km)} kilometers`,
    `${formatLength(values.ft)} feet`,
    `${formatLength(values.in)} inches`,
    `${formatLength(values.yd)} yards`,
    '',
    `1 dm = 0.1 m · Primary: ${formatLength(values.dm)} ${UNIT_SYMBOLS.dm}`,
  ].join('\n');
}
