import {
  formatGrouped,
  formatPlain,
  multiplyByInt,
  divideByInt,
  parseDecimalString,
  scaleByPow10,
} from '../billion-to-trillion/calculation';
import { formatIndianGrouped } from '../million-to-lakh/calculation';
import type { DecimalValue } from '../billion-to-trillion/types';
import {
  CRORE_POWER,
  MILLION_POWER,
  MILLIONS_PER_CRORE,
  type CroreMillionResult,
} from './types';

export {
  formatPlain,
  parseDecimalString,
  formatIndianGrouped,
  MILLIONS_PER_CRORE,
  CRORE_POWER,
  MILLION_POWER,
};

export function croreToMillion(crore: DecimalValue): DecimalValue {
  return multiplyByInt(crore, MILLIONS_PER_CRORE);
}

export function millionToCrore(million: DecimalValue): DecimalValue {
  return divideByInt(million, MILLIONS_PER_CRORE);
}

export function absoluteFromCrore(crore: DecimalValue): DecimalValue {
  return scaleByPow10(crore, CRORE_POWER);
}

export function absoluteFromMillion(million: DecimalValue): DecimalValue {
  return scaleByPow10(million, MILLION_POWER);
}

export function croreFromAbsolute(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -CRORE_POWER);
}

export function millionFromAbsolute(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -MILLION_POWER);
}

export function formatInternationalGrouped(value: DecimalValue): string {
  return formatGrouped(value);
}

export function buildResult(absolute: DecimalValue): CroreMillionResult {
  const crore = croreFromAbsolute(absolute);
  const million = millionFromAbsolute(absolute);
  return {
    crore,
    million,
    absolute,
    croreDisplay: formatPlain(crore, 24),
    millionDisplay: formatPlain(million, 24),
    absoluteInternational: formatInternationalGrouped(absolute),
    absoluteIndian: formatIndianGrouped(absolute),
  };
}

/** Default: 1 crore = 10 million. */
export function defaultAbsolute(): DecimalValue {
  return absoluteFromCrore({ sign: 1, digits: '1', exp: 0 });
}
