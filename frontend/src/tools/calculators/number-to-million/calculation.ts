import {
  formatGrouped,
  formatPlain,
  formatScientific,
  formatScientificE,
  parseDecimalString,
  scaleByPow10,
} from '../billion-to-trillion/calculation';
import type { DecimalValue } from '../billion-to-trillion/types';
import { MILLION_POWER, type NumberMillionResult } from './types';

export {
  formatPlain,
  formatGrouped,
  formatScientific,
  formatScientificE,
  parseDecimalString,
  MILLION_POWER,
};

export function numberToMillion(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -MILLION_POWER);
}

export function millionToNumber(million: DecimalValue): DecimalValue {
  return scaleByPow10(million, MILLION_POWER);
}

export function buildResult(absolute: DecimalValue): NumberMillionResult {
  const million = numberToMillion(absolute);
  return {
    absolute,
    million,
    numberDisplay: formatPlain(absolute, 24),
    numberGrouped: formatGrouped(absolute),
    millionDisplay: formatPlain(million, 24),
    scientificNotation: formatScientific(absolute),
    scientificE: formatScientificE(absolute),
  };
}

/** Default: 1,000,000 = 1 million = 1 × 10⁶. */
export function defaultAbsolute(): DecimalValue {
  return millionToNumber({ sign: 1, digits: '1', exp: 0 });
}
