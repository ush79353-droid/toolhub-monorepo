import { Rational } from './rational';

/** Max decimal places accepted when converting decimals to exact fractions. */
export const MAX_DECIMAL_PLACES = 12;

/**
 * Parse a cell string into an exact Rational.
 * Supports: integers, decimals (exact via place-value), signed fractions a/b.
 * Does not evaluate arbitrary expressions (no eval).
 */
export function parseRationalInput(raw: string): { ok: true; value: Rational } | { ok: false; error: string } {
  const text = raw.trim().replace(/\s+/g, '');
  if (!text) return { ok: false, error: 'Enter a number' };

  // Fraction a/b (optional signs on either part)
  const fractionMatch = text.match(/^([+-]?\d+)\/([+-]?\d+)$/);
  if (fractionMatch) {
    const num = Number(fractionMatch[1]);
    const den = Number(fractionMatch[2]);
    if (!Number.isSafeInteger(num) || !Number.isSafeInteger(den)) {
      return { ok: false, error: 'Number is too large' };
    }
    if (den === 0) return { ok: false, error: 'Division by zero' };
    try {
      return { ok: true, value: new Rational(num, den) };
    } catch {
      return { ok: false, error: 'Invalid fraction' };
    }
  }

  // Integer
  if (/^[+-]?\d+$/.test(text)) {
    const n = Number(text);
    if (!Number.isSafeInteger(n)) return { ok: false, error: 'Number is too large' };
    return { ok: true, value: Rational.fromInt(n) };
  }

  // Decimal (optional leading digits, required fractional part)
  const decimalMatch = text.match(/^([+-]?)(\d*)\.(\d+)$/);
  if (decimalMatch) {
    const sign = decimalMatch[1] === '-' ? -1 : 1;
    const whole = decimalMatch[2] === '' ? '0' : decimalMatch[2];
    const frac = decimalMatch[3];
    if (frac.length > MAX_DECIMAL_PLACES) {
      return { ok: false, error: `At most ${MAX_DECIMAL_PLACES} decimal places` };
    }
    const digits = `${whole}${frac}`;
    if (!/^\d+$/.test(digits)) return { ok: false, error: 'Invalid number' };
    const numerator = Number(digits);
    if (!Number.isSafeInteger(numerator)) return { ok: false, error: 'Number is too large' };
    const denominator = 10 ** frac.length;
    try {
      return { ok: true, value: new Rational(sign * numerator, denominator) };
    } catch {
      return { ok: false, error: 'Invalid number' };
    }
  }

  return { ok: false, error: 'Use integers, decimals, or fractions like 1/2' };
}
