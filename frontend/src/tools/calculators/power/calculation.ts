import { formatAngle } from '../coordinates/calculation';
import {
  POWER_TO_WATTS,
  POWER_UNITS,
  POWER_UNIT_SYMBOLS,
  type PowerUnit,
} from './types';

export function formatPower(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function convertPower(value: number, fromFactor: number, toFactor: number): number {
  return (value * fromFactor) / toFactor;
}

export function toWatts(value: number, unit: PowerUnit): number {
  return value * POWER_TO_WATTS[unit];
}

export function fromWatts(watts: number, unit: PowerUnit): number {
  return watts / POWER_TO_WATTS[unit];
}

export function allFromWatts(watts: number): Record<PowerUnit, number> {
  const out = {} as Record<PowerUnit, number>;
  for (const unit of POWER_UNITS) {
    out[unit] = fromWatts(watts, unit);
  }
  return out;
}

export function shareResultText(watts: number, sourceUnit: PowerUnit): string {
  const a = allFromWatts(watts);
  const lines = POWER_UNITS.filter((u) => u !== sourceUnit).map(
    (u) => `${formatPower(a[u])} ${POWER_UNIT_SYMBOLS[u]}`,
  );
  return [
    'Power Converter | Omega Calculators',
    '',
    'Input:',
    `${formatPower(a[sourceUnit])} ${POWER_UNIT_SYMBOLS[sourceUnit]}`,
    '',
    'Converted values:',
    ...lines,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
