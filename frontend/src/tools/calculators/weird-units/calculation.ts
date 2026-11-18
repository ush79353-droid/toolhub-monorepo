import { formatAngle } from '../coordinates/calculation';
import {
  MAX_ABS_BASE,
  regularUnitsFor,
  weirdUnitsFor,
  type ConversionDirection,
  type UnitCategory,
  type WeirdUnitDef,
} from './types';

export function formatWeird(value: number): string {
  const raw = formatAngle(value, 10);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function findRegular(category: UnitCategory, id: string) {
  return regularUnitsFor(category).find((unit) => unit.id === id) ?? null;
}

export function findWeird(category: UnitCategory, id: string): WeirdUnitDef | null {
  return weirdUnitsFor(category).find((unit) => unit.id === id) ?? null;
}

export function toBase(
  value: number,
  category: UnitCategory,
  regularId: string,
): number | null {
  const unit = findRegular(category, regularId);
  if (!unit || !Number.isFinite(value)) return null;
  return value * unit.toBase;
}

export function fromBase(
  base: number,
  category: UnitCategory,
  regularId: string,
): number | null {
  const unit = findRegular(category, regularId);
  if (!unit || !Number.isFinite(base) || unit.toBase === 0) return null;
  return base / unit.toBase;
}

/** Regular measurement → count of weird reference units. */
export function convertToWeirdUnits(
  value: number,
  regularId: string,
  weirdId: string,
  category: UnitCategory = 'length',
): number {
  const weird = findWeird(category, weirdId);
  if (!weird) {
    throw new Error(`Unknown weird unit ${weirdId} for category ${category}`);
  }
  const base = toBase(value, category, regularId);
  if (base == null || weird.baseValue === 0) {
    throw new Error('Invalid conversion inputs');
  }
  return base / weird.baseValue;
}

/** Weird unit count → regular measurement. */
export function convertFromWeirdUnits(
  weirdAmount: number,
  weirdId: string,
  regularId: string,
  category: UnitCategory = 'length',
): number {
  const weird = findWeird(category, weirdId);
  if (!weird) {
    throw new Error(`Unknown weird unit ${weirdId} for category ${category}`);
  }
  const base = weirdAmount * weird.baseValue;
  const regular = fromBase(base, category, regularId);
  if (regular == null) throw new Error('Invalid conversion inputs');
  return regular;
}

export function convertWeird(
  value: number,
  category: UnitCategory,
  regularId: string,
  weirdId: string,
  direction: ConversionDirection,
): number {
  return direction === 'regular-to-weird'
    ? convertToWeirdUnits(value, regularId, weirdId, category)
    : convertFromWeirdUnits(value, weirdId, regularId, category);
}

export function resultSentence(options: {
  value: number;
  category: UnitCategory;
  regularId: string;
  weirdId: string;
  direction: ConversionDirection;
  result: number;
}): string {
  const regular = findRegular(options.category, options.regularId);
  const weird = findWeird(options.category, options.weirdId);
  if (!regular || !weird) return '';

  const approx = weird.approximate ? '≈' : '=';
  if (options.direction === 'regular-to-weird') {
    return `${formatWeird(options.value)} ${regular.symbol} ${approx} ${formatWeird(options.result)} ${weird.label}`;
  }
  return `${formatWeird(options.value)} ${weird.label} ${approx} ${formatWeird(options.result)} ${regular.symbol}`;
}

export function shareResultText(sentence: string, note?: string): string {
  return [
    'Weird Units Converter — Omega Calculators',
    '',
    sentence,
    note ? `Note: ${note}` : '',
    '',
    'Converted client-side with Omega Calculators',
  ]
    .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
    .join('\n');
}

export function isBaseInRange(base: number): boolean {
  return Number.isFinite(base) && Math.abs(base) <= MAX_ABS_BASE;
}

/** Clamp ratio for UI bars (0–1) without claiming physical scale accuracy. */
export function comparisonRatio(weirdCount: number): number {
  if (!(weirdCount > 0) || !Number.isFinite(weirdCount)) return 0;
  // Map 1 weird unit to ~40% of the bar; asymptote toward 100%.
  return Math.min(0.98, weirdCount / (weirdCount + 1.5));
}
