import {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import { MICRONS_PER_MIL, UNIT_SYMBOLS } from './types';

export {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
  MICRONS_PER_MIL,
};

export function micronsToMils(microns: number): number {
  if (!Number.isFinite(microns)) {
    throw new Error('Invalid micron value.');
  }
  const result = microns / MICRONS_PER_MIL;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range.');
  }
  return result;
}

export function milsToMicrons(mils: number): number {
  if (!Number.isFinite(mils)) {
    throw new Error('Invalid mil value.');
  }
  const result = mils * MICRONS_PER_MIL;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range.');
  }
  return result;
}

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  return [
    'Micron to Mil Conversion Calculator',
    '',
    `Microns: ${formatLength(values.um)} ${UNIT_SYMBOLS.um}`,
    `Mils: ${formatLength(values.mil)} ${UNIT_SYMBOLS.mil}`,
    '',
    'Formula:',
    `mil = µm / ${MICRONS_PER_MIL}`,
    '',
    'Omega Calculators',
    '/tools/micron-to-mil-conversion-calculator',
  ].join('\n');
}
