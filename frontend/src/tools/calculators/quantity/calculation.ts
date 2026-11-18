import { formatAngle } from '../coordinates/calculation';
import {
  QUANTITY_TO_UNITS,
  QUANTITY_UNITS,
  QUANTITY_UNIT_SYMBOLS,
  type QuantityUnit,
} from './types';

export function formatQuantity(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function toUnits(value: number, unit: QuantityUnit): number {
  return value * QUANTITY_TO_UNITS[unit];
}

export function fromUnits(units: number, unit: QuantityUnit): number {
  return units / QUANTITY_TO_UNITS[unit];
}

export function allFromUnits(units: number): Record<QuantityUnit, number> {
  const out = {} as Record<QuantityUnit, number>;
  for (const unit of QUANTITY_UNITS) {
    out[unit] = fromUnits(units, unit);
  }
  return out;
}

export function shareResultText(units: number, sourceUnit: QuantityUnit): string {
  const a = allFromUnits(units);
  const highlight: QuantityUnit[] = [
    'unit',
    'pair',
    'dozen',
    'bakersDozen',
    'score',
    'gross',
    'greatGross',
  ];
  const lines = highlight
    .filter((u) => u !== sourceUnit)
    .map((u) => `${formatQuantity(a[u])} ${QUANTITY_UNIT_SYMBOLS[u]}`);
  return [
    'Quantity Converter — Omega Calculators',
    '',
    'Input:',
    `${formatQuantity(a[sourceUnit])} ${QUANTITY_UNIT_SYMBOLS[sourceUnit]}`,
    '',
    `Individual units: ${formatQuantity(units)}`,
    '',
    'Selected equivalents:',
    ...lines,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
