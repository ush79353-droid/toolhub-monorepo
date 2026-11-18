import { convertArea, formatArea as formatFromSqFt } from '../square-feet-converter/calculation';
import {
  AREA_TO_SQUARE_METERS,
  SQUARE_METERS_PER_SQUARE_YARD,
  SQUARE_YARD_UNITS,
  UNIT_SYMBOLS,
  type AreaUnit,
} from './types';

export {
  AREA_TO_SQUARE_METERS,
  convertArea,
  SQUARE_METERS_PER_SQUARE_YARD,
};

export function formatArea(value: number): string {
  return formatFromSqFt(value);
}

export function fromSquareYards(squareYards: number, unit: AreaUnit): number {
  return convertArea(squareYards, 'yd2', unit);
}

export function toSquareYards(value: number, unit: AreaUnit): number {
  return convertArea(value, unit, 'yd2');
}

export function allFromSquareYards(squareYards: number): Record<AreaUnit, number> {
  const out = {} as Record<AreaUnit, number>;
  for (const unit of SQUARE_YARD_UNITS) {
    out[unit] = fromSquareYards(squareYards, unit);
  }
  return out;
}

export function shareResultText(squareYards: number): string {
  const values = allFromSquareYards(squareYards);
  return [
    'Square Yard Converter',
    'Omega Calculators',
    '',
    `${formatArea(values.yd2)} ${UNIT_SYMBOLS.yd2} = ${formatArea(values.ft2)} ${UNIT_SYMBOLS.ft2}`,
    `${formatArea(values.yd2)} ${UNIT_SYMBOLS.yd2} = ${formatArea(values.m2)} ${UNIT_SYMBOLS.m2}`,
    `${formatArea(values.yd2)} ${UNIT_SYMBOLS.yd2} ≈ ${formatArea(values.acre)} acres`,
    '',
    '/tools/square-yard-converter',
  ].join('\n');
}
