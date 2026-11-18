import { convertArea } from '../square-feet-converter/calculation';
import type { AreaUnit } from '../square-feet-converter/types';
import {
  OTHER_UNIT_SYMBOL,
  SQUARE_FEET_PER_SQUARE_METER,
  SQUARE_METERS_PER_SQUARE_FOOT,
  type OtherAreaUnit,
  type SquareMetersToSquareFeetInput,
  type SquareMetersToSquareFeetResult,
} from './types';

export {
  convertArea,
  SQUARE_FEET_PER_SQUARE_METER,
  SQUARE_METERS_PER_SQUARE_FOOT,
};

export function squareMetersToSquareFeet(squareMeters: number): number {
  if (!Number.isFinite(squareMeters)) {
    throw new RangeError('Area must be finite.');
  }
  if (squareMeters < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  return squareMeters * SQUARE_FEET_PER_SQUARE_METER;
}

export function squareFeetToSquareMeters(squareFeet: number): number {
  if (!Number.isFinite(squareFeet)) {
    throw new RangeError('Area must be finite.');
  }
  if (squareFeet < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  return squareFeet * SQUARE_METERS_PER_SQUARE_FOOT;
}

function otherUnitAsArea(unit: OtherAreaUnit): AreaUnit {
  return unit;
}

/** Readable area display without ugly trailing zeros. */
export function formatArea(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e15)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 8;
  else if (abs >= 1) digits = 10;
  else digits = 12;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function calculateSquareMetersToSquareFeet(
  input: SquareMetersToSquareFeetInput,
): SquareMetersToSquareFeetResult {
  if (input.value === null || !Number.isFinite(input.value)) {
    throw new RangeError('Area is required.');
  }

  let squareMeters: number;
  let squareFeet: number;
  let otherValue: number;
  const otherUnit = input.otherUnit;
  const otherAs = otherUnitAsArea(otherUnit);

  if (input.source === 'squareMeters') {
    squareMeters = input.value;
    squareFeet = squareMetersToSquareFeet(squareMeters);
    otherValue = convertArea(squareMeters, 'm2', otherAs);
  } else if (input.source === 'squareFeet') {
    squareFeet = input.value;
    squareMeters = squareFeetToSquareMeters(squareFeet);
    otherValue = convertArea(squareMeters, 'm2', otherAs);
  } else {
    otherValue = input.value;
    squareMeters = convertArea(otherValue, otherAs, 'm2');
    squareFeet = squareMetersToSquareFeet(squareMeters);
  }

  const symbol = OTHER_UNIT_SYMBOL[otherUnit];
  return {
    squareMeters,
    squareFeet,
    otherValue,
    otherUnit,
    explanation: `${formatArea(squareMeters)} m² = ${formatArea(squareFeet)} ft² = ${formatArea(otherValue)} ${symbol}`,
  };
}

export function shareResultText(result: SquareMetersToSquareFeetResult): string {
  return [
    'Square Meters to Square Feet Converter',
    'Omega Calculators',
    '',
    `${formatArea(result.squareMeters)} m² = ${formatArea(result.squareFeet)} ft²`,
    '',
    '/tools/square-meters-to-square-feet-converter',
  ].join('\n');
}
