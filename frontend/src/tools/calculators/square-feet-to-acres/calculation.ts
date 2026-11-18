import {
  AREA_TO_SQUARE_METERS,
  convertArea,
} from '../square-feet-converter/calculation';
import type { AreaUnit } from '../square-feet-converter/types';
import {
  OTHER_UNIT_SYMBOL,
  SQUARE_FEET_PER_ACRE,
  type OtherAreaUnit,
  type SquareFeetToAcresInput,
  type SquareFeetToAcresResult,
} from './types';

export { AREA_TO_SQUARE_METERS, convertArea, SQUARE_FEET_PER_ACRE };

export function squareFeetToAcres(squareFeet: number): number {
  if (!Number.isFinite(squareFeet)) {
    throw new RangeError('Area must be finite.');
  }
  if (squareFeet < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  return squareFeet / SQUARE_FEET_PER_ACRE;
}

export function acresToSquareFeet(acres: number): number {
  if (!Number.isFinite(acres)) {
    throw new RangeError('Area must be finite.');
  }
  if (acres < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  return acres * SQUARE_FEET_PER_ACRE;
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

export function calculateSquareFeetToAcres(
  input: SquareFeetToAcresInput,
): SquareFeetToAcresResult {
  if (input.value === null || !Number.isFinite(input.value)) {
    throw new RangeError('Area is required.');
  }

  let squareFeet: number;
  let acres: number;
  let otherValue: number;
  const otherUnit = input.otherUnit;
  const otherAs = otherUnitAsArea(otherUnit);

  if (input.source === 'squareFeet') {
    squareFeet = input.value;
    acres = squareFeetToAcres(squareFeet);
    otherValue = convertArea(squareFeet, 'ft2', otherAs);
  } else if (input.source === 'acres') {
    acres = input.value;
    squareFeet = acresToSquareFeet(acres);
    otherValue = convertArea(squareFeet, 'ft2', otherAs);
  } else {
    otherValue = input.value;
    squareFeet = convertArea(otherValue, otherAs, 'ft2');
    acres = squareFeetToAcres(squareFeet);
  }

  const symbol = OTHER_UNIT_SYMBOL[otherUnit];
  return {
    squareFeet,
    acres,
    otherValue,
    otherUnit,
    explanation: `${formatArea(squareFeet)} ft² = ${formatArea(acres)} ac = ${formatArea(otherValue)} ${symbol}`,
  };
}

export function shareResultText(result: SquareFeetToAcresResult): string {
  return [
    'Square Feet to Acres Calculator',
    'Omega Calculators',
    '',
    `${formatArea(result.squareFeet)} ft² = ${formatArea(result.acres)} acre${result.acres === 1 ? '' : 's'}`,
    '',
    '/tools/square-feet-to-acres-calculator',
  ].join('\n');
}
