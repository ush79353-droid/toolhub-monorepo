import {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import { INCHES_PER_MIL, MILS_PER_INCH, UNIT_SYMBOLS } from './types';

export {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
  INCHES_PER_MIL,
  MILS_PER_INCH,
};

export function milToInch(mils: number): number {
  if (!Number.isFinite(mils)) throw new Error('Invalid mil value.');
  const inches = mils * INCHES_PER_MIL;
  if (!Number.isFinite(inches)) throw new Error('Conversion result is out of range.');
  return inches;
}

export function inchToMil(inches: number): number {
  if (!Number.isFinite(inches)) throw new Error('Invalid inch value.');
  const mils = inches * MILS_PER_INCH;
  if (!Number.isFinite(mils)) throw new Error('Conversion result is out of range.');
  return mils;
}

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  return [
    'mil to inch Conversion — Omega Calculators',
    '',
    `${formatLength(values.mil)} mil = ${formatLength(values.in)} inches`,
    '',
    `1 mil = ${INCHES_PER_MIL} inch`,
    '',
    '/tools/mil-to-inch-conversion',
  ].join('\n');
}

export { UNIT_SYMBOLS };
