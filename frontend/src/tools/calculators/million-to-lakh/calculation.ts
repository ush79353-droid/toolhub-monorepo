import {
  formatGrouped,
  formatPlain,
  isZero,
  multiplyByInt,
  divideByInt,
  parseDecimalString,
  scaleByPow10,
} from '../billion-to-trillion/calculation';
import type { DecimalValue } from '../billion-to-trillion/types';
import {
  LAKH_POWER,
  LAKHS_PER_MILLION,
  MILLION_POWER,
  type MillionLakhResult,
} from './types';

export {
  formatPlain,
  parseDecimalString,
  LAKHS_PER_MILLION,
  MILLION_POWER,
  LAKH_POWER,
};

export function millionToLakh(million: DecimalValue): DecimalValue {
  return multiplyByInt(million, LAKHS_PER_MILLION);
}

export function lakhToMillion(lakh: DecimalValue): DecimalValue {
  return divideByInt(lakh, LAKHS_PER_MILLION);
}

export function absoluteFromMillion(million: DecimalValue): DecimalValue {
  return scaleByPow10(million, MILLION_POWER);
}

export function absoluteFromLakh(lakh: DecimalValue): DecimalValue {
  return scaleByPow10(lakh, LAKH_POWER);
}

export function millionFromAbsolute(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -MILLION_POWER);
}

export function lakhFromAbsolute(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -LAKH_POWER);
}

/**
 * Indian grouping: last 3 digits, then groups of 2.
 * Examples: 1,00,000 · 10,00,000 · 1,00,00,000
 */
export function formatIndianGrouped(value: DecimalValue): string {
  const plain = formatPlain(value, 24);
  if (isZero(value)) return '0';

  const negative = plain.startsWith('-');
  const body = negative ? plain.slice(1) : plain;
  const [intRaw, frac] = body.split('.');
  const intDigits = intRaw.replace(/^0+(?=\d)/, '') || '0';

  if (intDigits.length <= 3) {
    const grouped = intDigits;
    const withFrac = frac ? `${grouped}.${frac}` : grouped;
    return negative ? `-${withFrac}` : withFrac;
  }

  const last3 = intDigits.slice(-3);
  let rest = intDigits.slice(0, -3);
  const parts: string[] = [last3];
  while (rest.length > 2) {
    parts.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest.length > 0) parts.unshift(rest);
  const grouped = parts.join(',');
  const withFrac = frac ? `${grouped}.${frac}` : grouped;
  return negative ? `-${withFrac}` : withFrac;
}

export function formatInternationalGrouped(value: DecimalValue): string {
  return formatGrouped(value);
}

export function buildResult(absolute: DecimalValue): MillionLakhResult {
  const million = millionFromAbsolute(absolute);
  const lakh = lakhFromAbsolute(absolute);
  return {
    million,
    lakh,
    absolute,
    millionDisplay: formatPlain(million, 24),
    lakhDisplay: formatPlain(lakh, 24),
    absoluteInternational: formatInternationalGrouped(absolute),
    absoluteIndian: formatIndianGrouped(absolute),
  };
}

/** Default: 1 million = 10 lakh. */
export function defaultAbsolute(): DecimalValue {
  return absoluteFromMillion({ sign: 1, digits: '1', exp: 0 });
}
