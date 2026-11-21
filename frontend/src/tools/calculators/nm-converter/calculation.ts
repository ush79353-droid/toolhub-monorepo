import {
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import {
  METERS_PER_NM,
  NM_UNITS,
  UNIT_SYMBOLS,
  type LengthUnit,
  type NmUnit,
} from './types';

export {
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
  METERS_PER_NM,
};

export function allFromMeters(meters: number): Record<NmUnit, number> {
  const out = {} as Record<NmUnit, number>;
  for (const unit of NM_UNITS) {
    out[unit] = fromMeters(meters, unit);
  }
  return out;
}

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  return [
    'nm Converter | Omega Calculators',
    '',
    `${formatLength(values.nm)} ${UNIT_SYMBOLS.nm} = ${formatLength(values.um)} ${UNIT_SYMBOLS.um}`,
    `${formatLength(values.nm)} ${UNIT_SYMBOLS.nm} = ${formatLength(values.mm)} ${UNIT_SYMBOLS.mm}`,
    `${formatLength(values.nm)} ${UNIT_SYMBOLS.nm} = ${formatLength(values.m)} ${UNIT_SYMBOLS.m}`,
    `${formatLength(values.nm)} ${UNIT_SYMBOLS.nm} = ${formatLength(values.angstrom)} ${UNIT_SYMBOLS.angstrom}`,
    '',
    '/tools/nm-converter',
  ].join('\n');
}

export type { LengthUnit };
