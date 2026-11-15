import type { DecimalValue } from '../billion-to-trillion/types';
import {
  formatPlain,
  isZero,
  normalize,
  parseDecimalString,
} from '../billion-to-trillion/calculation';
import {
  DATA_RATE_UNIT_BY_ID,
  DISPLAY_FRAC_DIGITS,
  type DataRateUnit,
  type RationalFactor,
} from './types';

export { parseDecimalString, formatPlain, isZero };

const ZERO: DecimalValue = { sign: 1, digits: '0', exp: 0 };

/** Numeric factor map for documentation / simple number API. */
export const DATA_RATE_FACTORS = {
  'bit/s': 1,
  'kbit/s': 1_000,
  'Mbit/s': 1_000_000,
  'Gbit/s': 1_000_000_000,
  'B/s': 8,
  'kB/s': 8_000,
  'MB/s': 8_000_000,
  'GB/s': 8_000_000_000,
} as const satisfies Record<DataRateUnit, number>;

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

export function scaleByRational(value: DecimalValue, factor: RationalFactor): DecimalValue {
  return divideByBigInt(multiplyByBigInt(value, factor.numerator), factor.denominator);
}

export function toBitsPerSecond(value: DecimalValue, unit: DataRateUnit): DecimalValue {
  return scaleByRational(value, DATA_RATE_UNIT_BY_ID[unit].factor);
}

export function fromBitsPerSecond(bps: DecimalValue, unit: DataRateUnit): DecimalValue {
  const { numerator, denominator } = DATA_RATE_UNIT_BY_ID[unit].factor;
  return scaleByRational(bps, { numerator: denominator, denominator: numerator });
}

export function convertDataRateString(
  value: string,
  fromUnit: DataRateUnit,
  toUnit: DataRateUnit,
): string {
  const parsed = parseDecimalString(value);
  if (!parsed || parsed.sign < 0) {
    throw new Error('Please enter a valid non-negative number.');
  }
  if (fromUnit === toUnit) return formatPlain(parsed, DISPLAY_FRAC_DIGITS);
  const bps = toBitsPerSecond(parsed, fromUnit);
  return formatPlain(fromBitsPerSecond(bps, toUnit), DISPLAY_FRAC_DIGITS);
}

export function formatRateDisplay(value: DecimalValue): string {
  return formatPlain(value, DISPLAY_FRAC_DIGITS);
}

/** Simple number converter for tests and docs (SI decimal). */
export function convertDataRate(
  value: number,
  fromUnit: DataRateUnit,
  toUnit: DataRateUnit,
): number {
  if (!Number.isFinite(value)) {
    throw new Error('Invalid data transfer rate');
  }
  const bitsPerSecond = value * DATA_RATE_FACTORS[fromUnit];
  return bitsPerSecond / DATA_RATE_FACTORS[toUnit];
}
