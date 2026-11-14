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
  LAKH_POWER,
  LAKHS_PER_CRORE,
  type CroreLakhResult,
} from './types';

export {
  formatPlain,
  parseDecimalString,
  formatIndianGrouped,
  LAKHS_PER_CRORE,
  CRORE_POWER,
  LAKH_POWER,
};

export function croreToLakh(crore: DecimalValue): DecimalValue {
  return multiplyByInt(crore, LAKHS_PER_CRORE);
}

export function lakhToCrore(lakh: DecimalValue): DecimalValue {
  return divideByInt(lakh, LAKHS_PER_CRORE);
}

export function absoluteFromCrore(crore: DecimalValue): DecimalValue {
  return scaleByPow10(crore, CRORE_POWER);
}

export function absoluteFromLakh(lakh: DecimalValue): DecimalValue {
  return scaleByPow10(lakh, LAKH_POWER);
}

export function croreFromAbsolute(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -CRORE_POWER);
}

export function lakhFromAbsolute(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -LAKH_POWER);
}

export function formatInternationalGrouped(value: DecimalValue): string {
  return formatGrouped(value);
}

export function buildResult(absolute: DecimalValue): CroreLakhResult {
  const crore = croreFromAbsolute(absolute);
  const lakh = lakhFromAbsolute(absolute);
  return {
    crore,
    lakh,
    absolute,
    croreDisplay: formatPlain(crore, 24),
    lakhDisplay: formatPlain(lakh, 24),
    absoluteInternational: formatInternationalGrouped(absolute),
    absoluteIndian: formatIndianGrouped(absolute),
  };
}

/** Default: 1 crore = 100 lakh. */
export function defaultAbsolute(): DecimalValue {
  return absoluteFromCrore({ sign: 1, digits: '1', exp: 0 });
}
