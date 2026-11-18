import { convertArea, formatArea as formatFromSqFt } from '../square-feet-converter/calculation';
import {
  AREA_TO_SQUARE_METERS,
  SQUARE_METER_UNITS,
  UNIT_SYMBOLS,
  type AreaUnit,
} from './types';

export { AREA_TO_SQUARE_METERS, convertArea };

export function formatArea(value: number): string {
  return formatFromSqFt(value);
}

export function fromSquareMeters(squareMeters: number, unit: AreaUnit): number {
  return convertArea(squareMeters, 'm2', unit);
}

export function toSquareMeters(value: number, unit: AreaUnit): number {
  return convertArea(value, unit, 'm2');
}

export function allFromSquareMeters(squareMeters: number): Record<AreaUnit, number> {
  const out = {} as Record<AreaUnit, number>;
  for (const unit of SQUARE_METER_UNITS) {
    out[unit] = fromSquareMeters(squareMeters, unit);
  }
  return out;
}

export function shareResultText(squareMeters: number): string {
  const values = allFromSquareMeters(squareMeters);
  return [
    'Square Meter Converter',
    'Omega Calculators',
    '',
    `${formatArea(values.m2)} ${UNIT_SYMBOLS.m2} = ${formatArea(values.ft2)} ${UNIT_SYMBOLS.ft2}`,
    `${formatArea(values.m2)} ${UNIT_SYMBOLS.m2} = ${formatArea(values.cm2)} ${UNIT_SYMBOLS.cm2}`,
    `${formatArea(values.m2)} ${UNIT_SYMBOLS.m2} = ${formatArea(values.mm2)} ${UNIT_SYMBOLS.mm2}`,
    '',
    '/tools/square-meter-converter',
  ].join('\n');
}
