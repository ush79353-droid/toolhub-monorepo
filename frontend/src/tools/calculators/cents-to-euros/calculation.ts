import {
  formatPlain,
  multiplyByInt,
  divideByInt,
  parseDecimalString,
} from '../billion-to-trillion/calculation';
import type { DecimalValue } from '../billion-to-trillion/types';
import { CENTS_PER_EURO, type CentsEurosResult } from './types';

export { formatPlain, parseDecimalString, CENTS_PER_EURO };

export function centsToEuros(cents: DecimalValue): DecimalValue {
  return divideByInt(cents, CENTS_PER_EURO);
}

export function eurosToCents(euros: DecimalValue): DecimalValue {
  return multiplyByInt(euros, CENTS_PER_EURO);
}

/** Format euros with € prefix; keep at least 2 fraction digits when useful, never invent rounding. */
export function formatEurosAmount(euros: DecimalValue): string {
  const plain = formatPlain(euros, 24);
  const negative = plain.startsWith('-');
  const body = negative ? plain.slice(1) : plain;
  const [intPart, frac = ''] = body.split('.');

  let shownFrac = frac;
  if (shownFrac.length < 2) {
    shownFrac = shownFrac.padEnd(2, '0');
  }
  // Trim only trailing zeros beyond 2 places.
  if (shownFrac.length > 2) {
    shownFrac = shownFrac.replace(/0+$/, '');
    if (shownFrac.length < 2) shownFrac = shownFrac.padEnd(2, '0');
  }

  const formatted = `${intPart}.${shownFrac}`;
  return negative ? `-€${formatted}` : `€${formatted}`;
}

export function buildResultFromCents(cents: DecimalValue): CentsEurosResult {
  const euros = centsToEuros(cents);
  const centsDisplay = formatPlain(cents, 24);
  const eurosDisplay = formatPlain(euros, 24);
  const eurosFormatted = formatEurosAmount(euros);
  return {
    cents,
    euros,
    centsDisplay,
    eurosDisplay,
    eurosFormatted,
    summaryLine: `${centsDisplay} cents = ${eurosFormatted}`,
  };
}

export function buildResultFromEuros(euros: DecimalValue): CentsEurosResult {
  return buildResultFromCents(eurosToCents(euros));
}

/** Default: 100 cents = €1. */
export function defaultCents(): DecimalValue {
  return { sign: 1, digits: '100', exp: 0 };
}
