import { formatAngle } from '../coordinates/calculation';
import {
  PPM_TO_RATIO,
  PPM_UNITS,
  PPM_UNIT_SYMBOLS,
  type PpmUnit,
} from './types';

export function formatPpm(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function convertPpm(value: number, from: PpmUnit, to: PpmUnit): number {
  return (value * PPM_TO_RATIO[from]) / PPM_TO_RATIO[to];
}

export function toRatio(value: number, unit: PpmUnit): number {
  return value * PPM_TO_RATIO[unit];
}

export function fromRatio(ratio: number, unit: PpmUnit): number {
  return ratio / PPM_TO_RATIO[unit];
}

export function allFromRatio(ratio: number): Record<PpmUnit, number> {
  const out = {} as Record<PpmUnit, number>;
  for (const unit of PPM_UNITS) {
    out[unit] = fromRatio(ratio, unit);
  }
  return out;
}

export function shareResultText(ratio: number, sourceUnit: PpmUnit): string {
  const a = allFromRatio(ratio);
  const symbol = (unit: PpmUnit) => {
    const s = PPM_UNIT_SYMBOLS[unit];
    return s ? ` ${s}` : '';
  };
  return [
    'PPM Calculator | Omega Calculators',
    '',
    'Input:',
    `${formatPpm(a[sourceUnit])}${symbol(sourceUnit)}`.trim(),
    '',
    'Results:',
    `Number: ${formatPpm(a.number)}`,
    `Percent: ${formatPpm(a.percent)}%`,
    `Per mille: ${formatPpm(a.permille)}‰`,
    `PPM: ${formatPpm(a.ppm)}`,
    `PPB: ${formatPpm(a.ppb)}`,
    `PPT: ${formatPpm(a.ppt)}`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
