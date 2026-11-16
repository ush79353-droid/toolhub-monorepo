import { formatAngle } from '../coordinates/calculation';
import {
  DEFAULT_BASE_PX,
  PT_PER_PX,
  SIZE_UNITS,
  SIZE_UNIT_SYMBOLS,
  type SizeUnit,
} from './types';

export function formatSize(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

/** Convert a size in the given unit to CSS pixels. */
export function toPixels(value: number, unit: SizeUnit, basePx: number): number {
  switch (unit) {
    case 'px':
      return value;
    case 'em':
      return value * basePx;
    case 'pt':
      return value * (1 / PT_PER_PX);
    case 'percent':
      return (value / 100) * basePx;
  }
}

export function fromPixels(px: number, unit: SizeUnit, basePx: number): number {
  switch (unit) {
    case 'px':
      return px;
    case 'em':
      return px / basePx;
    case 'pt':
      return px * PT_PER_PX;
    case 'percent':
      return (px / basePx) * 100;
  }
}

export function allFromPixels(px: number, basePx: number): Record<SizeUnit, number> {
  const out = {} as Record<SizeUnit, number>;
  for (const unit of SIZE_UNITS) {
    out[unit] = fromPixels(px, unit, basePx);
  }
  return out;
}

export function shareResultText(
  px: number,
  basePx: number,
  sourceUnit: SizeUnit,
): string {
  const a = allFromPixels(px, basePx);
  return [
    'Px to Em Converter',
    'Omega Calculators',
    '',
    `Base size: ${formatSize(basePx)} px`,
    '',
    'Values:',
    `${formatSize(a.px)} px`,
    `${formatSize(a.em)} em`,
    `${formatSize(a.pt)} pt`,
    `${formatSize(a.percent)} %`,
    '',
    `Source field: ${SIZE_UNIT_SYMBOLS[sourceUnit]}`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}

export { DEFAULT_BASE_PX, PT_PER_PX };
