import {
  SQUARE_INCHES_PER_SQUARE_FOOT,
  type SquareInchToSquareFootInput,
  type SquareInchToSquareFootResult,
} from './types';

export { SQUARE_INCHES_PER_SQUARE_FOOT };

export function squareInchesToSquareFeet(squareInches: number): number {
  if (!Number.isFinite(squareInches)) {
    throw new RangeError('Area must be finite.');
  }
  if (squareInches < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  return squareInches / SQUARE_INCHES_PER_SQUARE_FOOT;
}

export function squareFeetToSquareInches(squareFeet: number): number {
  if (!Number.isFinite(squareFeet)) {
    throw new RangeError('Area must be finite.');
  }
  if (squareFeet < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  return squareFeet * SQUARE_INCHES_PER_SQUARE_FOOT;
}

/** Readable area display without ugly trailing zeros. */
export function formatArea(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 10;
  else if (abs >= 1e-6) digits = 12;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function calculateSquareInchToSquareFoot(
  input: SquareInchToSquareFootInput,
): SquareInchToSquareFootResult {
  if (input.value === null) {
    throw new Error('Missing area value');
  }

  let squareInches: number;
  let squareFeet: number;

  if (input.source === 'squareInches') {
    squareInches = input.value;
    squareFeet = squareInchesToSquareFeet(squareInches);
  } else {
    squareFeet = input.value;
    squareInches = squareFeetToSquareInches(squareFeet);
  }

  const explanation = `${formatArea(squareInches)} in² = ${formatArea(squareFeet)} ft²`;

  return {
    source: input.source,
    squareInches,
    squareFeet,
    explanation,
  };
}

export function shareResultText(result: SquareInchToSquareFootResult): string {
  return [
    'Square Inch to Square Foot Converter',
    'Omega Calculators',
    '',
    `${formatArea(result.squareInches)} in² = ${formatArea(result.squareFeet)} ft²`,
    '',
    '/tools/square-inch-to-square-foot-converter',
  ].join('\n');
}
