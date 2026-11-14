import type { DecimalValue } from '../billion-to-trillion/types';
import {
  formatPlain,
  isZero,
  normalize,
  parseDecimalString,
} from '../billion-to-trillion/calculation';
import {
  DISPLAY_FRAC_DIGITS,
  STORAGE_UNIT_BY_ID,
  type RationalFactor,
  type StorageUnit,
} from './types';

export { parseDecimalString, formatPlain, isZero };

const ZERO: DecimalValue = { sign: 1, digits: '0', exp: 0 };

function multiplyByBigInt(value: DecimalValue, factor: bigint): DecimalValue {
  if (isZero(value) || factor === 0n) return { ...ZERO };
  const sign: 1 | -1 = factor < 0n ? ((-value.sign) as 1 | -1) : value.sign;
  const abs = factor < 0n ? -factor : factor;
  const product = BigInt(value.digits) * abs;
  return normalize({ sign, digits: product.toString(), exp: value.exp });
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
  const quot = big / absDiv;
  return normalize({ sign, digits: quot.toString(), exp });
}

/** value × numerator / denominator using exact decimal arithmetic. */
export function scaleByRational(value: DecimalValue, factor: RationalFactor): DecimalValue {
  const scaled = multiplyByBigInt(value, factor.numerator);
  return divideByBigInt(scaled, factor.denominator);
}

export function toBytes(value: DecimalValue, unit: StorageUnit): DecimalValue {
  return scaleByRational(value, STORAGE_UNIT_BY_ID[unit].factor);
}

export function fromBytes(bytes: DecimalValue, unit: StorageUnit): DecimalValue {
  const { numerator, denominator } = STORAGE_UNIT_BY_ID[unit].factor;
  // quantity = bytes × denominator / numerator
  return scaleByRational(bytes, { numerator: denominator, denominator: numerator });
}

/**
 * Exact conversion between storage units via bytes.
 * Returns a plain decimal string (display-rounded fraction digits).
 */
export function convertDataSize(
  value: string,
  fromUnit: StorageUnit,
  toUnit: StorageUnit
): string {
  const parsed = parseDecimalString(value);
  if (!parsed || parsed.sign < 0) {
    throw new Error('Please enter a valid non-negative number.');
  }
  if (fromUnit === toUnit) {
    return formatPlain(parsed, DISPLAY_FRAC_DIGITS);
  }
  const bytes = toBytes(parsed, fromUnit);
  const result = fromBytes(bytes, toUnit);
  return formatPlain(result, DISPLAY_FRAC_DIGITS);
}

export function valuesFromBytes(
  bytes: DecimalValue,
  units: readonly StorageUnit[]
): Record<StorageUnit, string> {
  const out = {} as Record<StorageUnit, string>;
  for (const unit of units) {
    out[unit] = formatPlain(fromBytes(bytes, unit), DISPLAY_FRAC_DIGITS);
  }
  return out;
}

export function formatStorageDisplay(value: DecimalValue): string {
  return formatPlain(value, DISPLAY_FRAC_DIGITS);
}
