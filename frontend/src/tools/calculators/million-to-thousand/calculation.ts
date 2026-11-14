import {
  formatGrouped,
  formatPlain,
  formatScientific,
  formatScientificE,
  multiplyByInt,
  divideByInt,
  parseDecimalString,
  scaleByPow10,
} from '../billion-to-trillion/calculation';
import type { DecimalValue } from '../billion-to-trillion/types';
import {
  MILLION_POWER,
  THOUSAND_POWER,
  THOUSANDS_PER_MILLION,
  type MillionThousandResult,
} from './types';

export {
  formatPlain,
  formatGrouped,
  formatScientific,
  formatScientificE,
  parseDecimalString,
  MILLION_POWER,
  THOUSAND_POWER,
  THOUSANDS_PER_MILLION,
};

export function millionsToThousands(millions: DecimalValue): DecimalValue {
  return multiplyByInt(millions, THOUSANDS_PER_MILLION);
}

export function thousandsToMillions(thousands: DecimalValue): DecimalValue {
  return divideByInt(thousands, THOUSANDS_PER_MILLION);
}

export function absoluteFromMillions(millions: DecimalValue): DecimalValue {
  return scaleByPow10(millions, MILLION_POWER);
}

export function absoluteFromThousands(thousands: DecimalValue): DecimalValue {
  return scaleByPow10(thousands, THOUSAND_POWER);
}

export function millionsFromAbsolute(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -MILLION_POWER);
}

export function thousandsFromAbsolute(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -THOUSAND_POWER);
}

export function buildResult(absolute: DecimalValue): MillionThousandResult {
  const millions = millionsFromAbsolute(absolute);
  const thousands = thousandsFromAbsolute(absolute);
  return {
    millions,
    thousands,
    absolute,
    millionsDisplay: formatPlain(millions, 24),
    thousandsDisplay: formatPlain(thousands, 24),
    decimalDisplay: formatPlain(absolute, 24),
    decimalGrouped: formatGrouped(absolute),
    scientificNotation: formatScientific(absolute),
    scientificE: formatScientificE(absolute),
  };
}

/** Default: 1 million = 1,000 thousands = 1,000,000. */
export function defaultAbsolute(): DecimalValue {
  return absoluteFromMillions({ sign: 1, digits: '1', exp: 0 });
}
