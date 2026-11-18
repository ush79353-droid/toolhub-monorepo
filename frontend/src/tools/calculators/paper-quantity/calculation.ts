import { formatAngle } from '../coordinates/calculation';
import {
  PAPER_STANDARD_LABEL,
  PAPER_UNITS,
  SHEETS_PER_UNIT,
  type PaperUnit,
} from './types';

/** Display formatting with grouped thousands on the integer part. */
export function formatPaperQty(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function toSheets(value: number, unit: PaperUnit): number {
  return value * SHEETS_PER_UNIT[unit];
}

export function fromSheets(sheets: number, unit: PaperUnit): number {
  return sheets / SHEETS_PER_UNIT[unit];
}

export function allFromSheets(sheets: number): Record<PaperUnit, number> {
  const out = {} as Record<PaperUnit, number>;
  for (const unit of PAPER_UNITS) {
    out[unit] = fromSheets(sheets, unit);
  }
  return out;
}

export function shareResultText(sheets: number): string {
  const amounts = allFromSheets(sheets);
  return [
    'Paper Quantity Converter',
    'Omega Calculators',
    '',
    `Paper standard: ${PAPER_STANDARD_LABEL}`,
    '',
    `Sheets: ${formatPaperQty(amounts.sheets)}`,
    `Quires: ${formatPaperQty(amounts.quires)}`,
    `Reams: ${formatPaperQty(amounts.reams)}`,
    `Bundles: ${formatPaperQty(amounts.bundles)}`,
    `Bales: ${formatPaperQty(amounts.bales)}`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
