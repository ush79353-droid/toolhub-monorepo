import {
  formatGrouped,
  formatPlain,
  formatScientific,
  formatScientificE,
  parseDecimalString,
  scaleByPow10,
} from '../billion-to-trillion/calculation';
import type { DecimalValue } from '../billion-to-trillion/types';
import {
  BILLION_POWER,
  MILLION_POWER,
  type MillionBillionResult,
} from './types';

export {
  formatPlain,
  formatGrouped,
  formatScientific,
  formatScientificE,
  parseDecimalString,
  BILLION_POWER,
  MILLION_POWER,
};

export function millionToBillion(million: DecimalValue): DecimalValue {
  return scaleByPow10(million, MILLION_POWER - BILLION_POWER);
}

export function billionToMillion(billion: DecimalValue): DecimalValue {
  return scaleByPow10(billion, BILLION_POWER - MILLION_POWER);
}

export function millionToNumber(million: DecimalValue): DecimalValue {
  return scaleByPow10(million, MILLION_POWER);
}

export function billionToNumber(billion: DecimalValue): DecimalValue {
  return scaleByPow10(billion, BILLION_POWER);
}

export function numberToMillion(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -MILLION_POWER);
}

export function numberToBillion(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -BILLION_POWER);
}

export function buildResult(absolute: DecimalValue): MillionBillionResult {
  const million = numberToMillion(absolute);
  const billion = numberToBillion(absolute);
  return {
    absolute,
    million,
    billion,
    millionDisplay: formatPlain(million, 24),
    millionGrouped: formatGrouped(million),
    billionDisplay: formatPlain(billion, 24),
    fullNumberDisplay: formatPlain(absolute, 24),
    fullNumberGrouped: formatGrouped(absolute),
    scientificNotation: formatScientific(absolute),
    scientificE: formatScientificE(absolute),
  };
}

/** Default: 1,000 million = 1 billion = 1,000,000,000. */
export function defaultAbsolute(): DecimalValue {
  return billionToNumber({ sign: 1, digits: '1', exp: 0 });
}
