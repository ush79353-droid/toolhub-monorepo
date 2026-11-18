import {
  SQUARE_MM_PER_SQUARE_CM,
  type SquareCmToSquareMmInput,
  type SquareCmToSquareMmResult,
} from './types';

export { SQUARE_MM_PER_SQUARE_CM };

export function squareCmToSquareMm(squareCentimeters: number): number {
  if (!Number.isFinite(squareCentimeters)) {
    throw new RangeError('Area must be finite.');
  }
  if (squareCentimeters < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  return squareCentimeters * SQUARE_MM_PER_SQUARE_CM;
}

export function squareMmToSquareCm(squareMillimeters: number): number {
  if (!Number.isFinite(squareMillimeters)) {
    throw new RangeError('Area must be finite.');
  }
  if (squareMillimeters < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  return squareMillimeters / SQUARE_MM_PER_SQUARE_CM;
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

export function calculateSquareCmToSquareMm(
  input: SquareCmToSquareMmInput,
): SquareCmToSquareMmResult {
  if (input.value === null) {
    throw new Error('Missing area value');
  }

  let squareCentimeters: number;
  let squareMillimeters: number;

  if (input.source === 'squareCentimeters') {
    squareCentimeters = input.value;
    squareMillimeters = squareCmToSquareMm(squareCentimeters);
  } else {
    squareMillimeters = input.value;
    squareCentimeters = squareMmToSquareCm(squareMillimeters);
  }

  const explanation = `${formatArea(squareCentimeters)} cm² = ${formatArea(squareMillimeters)} mm²`;

  return {
    source: input.source,
    squareCentimeters,
    squareMillimeters,
    explanation,
  };
}

export function shareResultText(result: SquareCmToSquareMmResult): string {
  return [
    'Square Centimeters to Square Millimeters Converter',
    'Omega Calculators',
    '',
    `${formatArea(result.squareCentimeters)} cm² = ${formatArea(result.squareMillimeters)} mm²`,
    '',
    '/tools/square-centimeters-to-square-millimeters-converter',
  ].join('\n');
}
