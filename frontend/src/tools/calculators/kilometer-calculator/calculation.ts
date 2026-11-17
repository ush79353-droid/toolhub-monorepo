import {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import { UNIT_SYMBOLS } from './types';

export {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  return [
    'Kilometer Calculator',
    'Omega Calculators',
    '',
    `${formatLength(values.km)} kilometer equals:`,
    '',
    `${formatLength(values.m)} meters`,
    `${formatLength(values.cm)} centimeters`,
    `${formatLength(values.mm)} millimeters`,
    `${formatLength(values.ft)} feet`,
    `${formatLength(values.mi)} miles`,
    '',
    `Also: ${formatLength(values.in)} ${UNIT_SYMBOLS.in} · ${formatLength(values.yd)} ${UNIT_SYMBOLS.yd}`,
    '',
    '/tools/kilometer-calculator',
  ].join('\n');
}
