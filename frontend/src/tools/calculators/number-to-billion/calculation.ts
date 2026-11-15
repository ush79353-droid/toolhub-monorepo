import {
  formatGrouped,
  formatPlain,
  formatScientific,
  formatScientificE,
  parseDecimalString,
  scaleByPow10,
} from '../billion-to-trillion/calculation';
import type { DecimalValue } from '../billion-to-trillion/types';
import { BILLION_POWER, type NumberBillionResult } from './types';

export {
  formatPlain,
  formatGrouped,
  formatScientific,
  formatScientificE,
  parseDecimalString,
  BILLION_POWER,
};

export function numberToBillion(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -BILLION_POWER);
}

export function billionToNumber(billion: DecimalValue): DecimalValue {
  return scaleByPow10(billion, BILLION_POWER);
}

export function buildResult(absolute: DecimalValue): NumberBillionResult {
  const billion = numberToBillion(absolute);
  return {
    absolute,
    billion,
    numberDisplay: formatPlain(absolute, 24),
    numberGrouped: formatGrouped(absolute),
    billionDisplay: formatPlain(billion, 24),
    scientificNotation: formatScientific(absolute),
    scientificE: formatScientificE(absolute),
  };
}

/** Default: 1,000,000,000 = 1 billion = 1 × 10⁹. */
export function defaultAbsolute(): DecimalValue {
  return billionToNumber({ sign: 1, digits: '1', exp: 0 });
}
