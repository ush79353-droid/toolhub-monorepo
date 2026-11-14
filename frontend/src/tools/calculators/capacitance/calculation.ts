import type { DecimalValue } from '../billion-to-trillion/types';
import {
  formatPlain,
  isZero,
  normalize,
  parseDecimalString,
} from '../billion-to-trillion/calculation';
import {
  CAPACITANCE_UNIT_BY_ID,
  DISPLAY_FRAC_DIGITS,
  type CapacitanceUnit,
  type RationalFactor,
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

export function scaleByRational(value: DecimalValue, factor: RationalFactor): DecimalValue {
  const scaled = multiplyByBigInt(value, factor.numerator);
  return divideByBigInt(scaled, factor.denominator);
}

export function toFarads(value: DecimalValue, unit: CapacitanceUnit): DecimalValue {
  return scaleByRational(value, CAPACITANCE_UNIT_BY_ID[unit].factor);
}

export function fromFarads(farads: DecimalValue, unit: CapacitanceUnit): DecimalValue {
  const { numerator, denominator } = CAPACITANCE_UNIT_BY_ID[unit].factor;
  return scaleByRational(farads, { numerator: denominator, denominator: numerator });
}

/**
 * Exact SI capacitance conversion via farads.
 * Returns a plain decimal string (display-rounded fraction digits).
 */
export function convertCapacitance(
  value: string,
  fromUnit: CapacitanceUnit,
  toUnit: CapacitanceUnit
): string {
  const parsed = parseDecimalString(value);
  if (!parsed || parsed.sign < 0) {
    throw new Error('Please enter a valid non-negative capacitance value.');
  }
  if (fromUnit === toUnit) {
    return formatPlain(parsed, DISPLAY_FRAC_DIGITS);
  }
  const farads = toFarads(parsed, fromUnit);
  return formatPlain(fromFarads(farads, toUnit), DISPLAY_FRAC_DIGITS);
}

export function formatCapDisplay(value: DecimalValue): string {
  return formatPlain(value, DISPLAY_FRAC_DIGITS);
}
