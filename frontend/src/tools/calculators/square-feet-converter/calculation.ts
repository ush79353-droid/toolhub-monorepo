import {
  AREA_TO_SQUARE_METERS,
  AREA_UNIT_SYMBOL,
  type AreaUnit,
  type SquareFeetConverterInput,
  type SquareFeetConverterResult,
} from './types';

export { AREA_TO_SQUARE_METERS };

export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  if (!Number.isFinite(value)) {
    throw new RangeError('Area must be finite.');
  }
  if (value < 0) {
    throw new RangeError('Area cannot be negative.');
  }
  if (from === to) return value;
  return (value * AREA_TO_SQUARE_METERS[from]) / AREA_TO_SQUARE_METERS[to];
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
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function calculateSquareFeetConverter(
  input: SquareFeetConverterInput,
): SquareFeetConverterResult {
  if (input.value === null || !Number.isFinite(input.value)) {
    throw new RangeError('Area is required.');
  }
  const targetUnit = input.targetUnit;
  let squareFeet: number;
  let converted: number;

  if (input.source === 'squareFeet') {
    squareFeet = input.value;
    converted = convertArea(squareFeet, 'ft2', targetUnit);
  } else {
    converted = input.value;
    squareFeet = convertArea(converted, targetUnit, 'ft2');
  }

  const symbol = AREA_UNIT_SYMBOL[targetUnit];
  return {
    squareFeet,
    converted,
    targetUnit,
    explanation: `${formatArea(squareFeet)} ft² = ${formatArea(converted)} ${symbol}`,
  };
}

export function shareResultText(result: SquareFeetConverterResult): string {
  return [
    'Square Feet Converter',
    'Omega Calculators',
    '',
    result.explanation,
    '',
    '/tools/square-feet-converter',
  ].join('\n');
}
