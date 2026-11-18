import { convertArea } from '../square-feet-converter/calculation';
import type { AreaUnit } from '../square-feet-converter/types';
import {
  OTHER_UNIT_SYMBOL,
  SQUARE_KILOMETERS_PER_SQUARE_MILE,
  SQUARE_MILES_PER_SQUARE_KILOMETER,
  type OtherAreaUnit,
  type SquareMilesToSquareKmInput,
  type SquareMilesToSquareKmResult,
} from './types';

export {
  convertArea,
  SQUARE_KILOMETERS_PER_SQUARE_MILE,
  SQUARE_MILES_PER_SQUARE_KILOMETER,
};

export function squareMilesToSquareKilometers(squareMiles: number): number {
  if (!Number.isFinite(squareMiles)) {
    throw new RangeError('Area must be finite.');
  }
  if (squareMiles < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  return squareMiles * SQUARE_KILOMETERS_PER_SQUARE_MILE;
}

export function squareKilometersToSquareMiles(squareKilometers: number): number {
  if (!Number.isFinite(squareKilometers)) {
    throw new RangeError('Area must be finite.');
  }
  if (squareKilometers < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  return squareKilometers / SQUARE_KILOMETERS_PER_SQUARE_MILE;
}

function otherUnitAsArea(unit: OtherAreaUnit): AreaUnit {
  return unit;
}

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

export function calculateSquareMilesToSquareKm(
  input: SquareMilesToSquareKmInput,
): SquareMilesToSquareKmResult {
  if (input.value === null || !Number.isFinite(input.value)) {
    throw new RangeError('Area is required.');
  }

  let squareMiles: number;
  let squareKilometers: number;
  let otherValue: number;
  const otherUnit = input.otherUnit;
  const otherAs = otherUnitAsArea(otherUnit);

  if (input.source === 'squareMiles') {
    squareMiles = input.value;
    squareKilometers = squareMilesToSquareKilometers(squareMiles);
    otherValue = convertArea(squareMiles, 'mi2', otherAs);
  } else if (input.source === 'squareKilometers') {
    squareKilometers = input.value;
    squareMiles = squareKilometersToSquareMiles(squareKilometers);
    otherValue = convertArea(squareKilometers, 'km2', otherAs);
  } else {
    otherValue = input.value;
    squareMiles = convertArea(otherValue, otherAs, 'mi2');
    squareKilometers = squareMilesToSquareKilometers(squareMiles);
  }

  const symbol = OTHER_UNIT_SYMBOL[otherUnit];
  return {
    squareMiles,
    squareKilometers,
    otherValue,
    otherUnit,
    explanation: `${formatArea(squareMiles)} mi² = ${formatArea(squareKilometers)} km² = ${formatArea(otherValue)} ${symbol}`,
  };
}

export function shareResultText(result: SquareMilesToSquareKmResult): string {
  return [
    'Square Miles to Square km Converter',
    'Omega Calculators',
    '',
    `${formatArea(result.squareMiles)} mi² = ${formatArea(result.squareKilometers)} km²`,
    '',
    '/tools/square-miles-to-square-km-converter',
  ].join('\n');
}
