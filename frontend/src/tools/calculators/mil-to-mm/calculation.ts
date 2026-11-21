import {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import { MM_PER_MIL, MILS_PER_MM, UNIT_SYMBOLS } from './types';

export {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
  MM_PER_MIL,
  MILS_PER_MM,
};

export function milToMm(mils: number): number {
  if (!Number.isFinite(mils)) throw new Error('Invalid mil value.');
  const mm = mils * MM_PER_MIL;
  if (!Number.isFinite(mm)) throw new Error('Conversion result is out of range.');
  return mm;
}

export function mmToMil(mm: number): number {
  if (!Number.isFinite(mm)) throw new Error('Invalid millimeter value.');
  const mils = mm / MM_PER_MIL;
  if (!Number.isFinite(mils)) throw new Error('Conversion result is out of range.');
  return mils;
}

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  return [
    'Mil to mm Conversion | Omega Calculators',
    '',
    `${formatLength(values.mil)} mil = ${formatLength(values.mm)} mm`,
    '',
    `1 mil = ${MM_PER_MIL} mm`,
    '',
    '/tools/mil-to-mm-conversion',
  ].join('\n');
}

export { UNIT_SYMBOLS };
