import { formatAngle } from '../coordinates/calculation';
import {
  DENSITY_TO_BASE,
  DENSITY_UNITS,
  DENSITY_UNIT_SYMBOLS,
  type DensityUnit,
} from './types';

export function formatDensity(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function convertDensity(value: number, fromFactor: number, toFactor: number): number {
  return (value * fromFactor) / toFactor;
}

export function toKgPerM3(value: number, unit: DensityUnit): number {
  return value * DENSITY_TO_BASE[unit];
}

export function fromKgPerM3(kgPerM3: number, unit: DensityUnit): number {
  return kgPerM3 / DENSITY_TO_BASE[unit];
}

export function allFromKgPerM3(kgPerM3: number): Record<DensityUnit, number> {
  const out = {} as Record<DensityUnit, number>;
  for (const unit of DENSITY_UNITS) {
    out[unit] = fromKgPerM3(kgPerM3, unit);
  }
  return out;
}

export function shareResultText(kgPerM3: number, sourceUnit: DensityUnit): string {
  const a = allFromKgPerM3(kgPerM3);
  const lines = DENSITY_UNITS.filter((u) => u !== sourceUnit).map(
    (u) => `${formatDensity(a[u])} ${DENSITY_UNIT_SYMBOLS[u]}`,
  );
  return [
    'Density Conversion | Omega Calculators',
    '',
    'Input:',
    `${formatDensity(a[sourceUnit])} ${DENSITY_UNIT_SYMBOLS[sourceUnit]}`,
    '',
    'Results:',
    ...lines,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
