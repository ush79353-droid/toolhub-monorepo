import type { DecimalValue } from '../billion-to-trillion/types';
import {
  formatPlain,
  isZero,
  normalize,
  parseDecimalString,
} from '../billion-to-trillion/calculation';
import {
  CONVERSION_FACTORS,
  DISPLAY_FRAC_DIGITS,
  type DataUnit,
  type NumberSystem,
} from './types';

export { parseDecimalString, formatPlain, isZero };

const ZERO: DecimalValue = { sign: 1, digits: '0', exp: 0 };

function multiplyByBigInt(value: DecimalValue, factor: bigint): DecimalValue {
  if (isZero(value) || factor === 0n) return { ...ZERO };
  const sign: 1 | -1 = factor < 0n ? ((-value.sign) as 1 | -1) : value.sign;
  const abs = factor < 0n ? -factor : factor;
  return normalize({
    sign,
    digits: (BigInt(value.digits) * abs).toString(),
    exp: value.exp,
  });
}

function divideByBigInt(value: DecimalValue, divisor: bigint, maxFrac = 48): DecimalValue {
  if (isZero(value)) return { ...ZERO };
  if (divisor === 0n) throw new Error('Division by zero');
  const sign: 1 | -1 = divisor < 0n ? ((-value.sign) as 1 | -1) : value.sign;
  const absDiv = divisor < 0n ? -divisor : divisor;
  let big = BigInt(value.digits);
  let exp = value.exp;
  let guard = 0;
  while (big % absDiv !== 0n && guard < maxFrac) {
    big *= 10n;
    exp -= 1;
    guard += 1;
  }
  return normalize({ sign, digits: (big / absDiv).toString(), exp });
}

/**
 * Exact MB↔GB conversion for SI decimal (÷/×1000) or legacy binary mode (÷/×1024).
 * Returns a plain decimal string (display-rounded fraction digits).
 */
export function convertMBGB(
  value: string,
  fromUnit: DataUnit,
  toUnit: DataUnit,
  numberSystem: NumberSystem
): string {
  const parsed = parseDecimalString(value);
  if (!parsed || parsed.sign < 0) {
    throw new Error('Please enter a valid non-negative data size.');
  }
  if (fromUnit === toUnit) {
    return formatPlain(parsed, DISPLAY_FRAC_DIGITS);
  }
  const factor = CONVERSION_FACTORS[numberSystem];
  const result =
    fromUnit === 'MB' && toUnit === 'GB'
      ? divideByBigInt(parsed, factor)
      : multiplyByBigInt(parsed, factor);
  return formatPlain(result, DISPLAY_FRAC_DIGITS);
}

export function formatMbGbDisplay(value: DecimalValue): string {
  return formatPlain(value, DISPLAY_FRAC_DIGITS);
}

export function convertDecimalValue(
  value: DecimalValue,
  fromUnit: DataUnit,
  toUnit: DataUnit,
  numberSystem: NumberSystem
): DecimalValue {
  if (fromUnit === toUnit) return value;
  const factor = CONVERSION_FACTORS[numberSystem];
  return fromUnit === 'MB' && toUnit === 'GB'
    ? divideByBigInt(value, factor)
    : multiplyByBigInt(value, factor);
}
