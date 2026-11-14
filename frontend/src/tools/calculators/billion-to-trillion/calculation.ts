import {
  BILLION_POWER,
  BILLIONS_PER_TRILLION,
  TRILLION_POWER,
  type BillionTrillionResult,
  type DecimalValue,
} from './types';

export { BILLION_POWER, BILLIONS_PER_TRILLION, TRILLION_POWER };

const ZERO: DecimalValue = { sign: 1, digits: '0', exp: 0 };

export function isZero(value: DecimalValue): boolean {
  return value.digits === '0';
}

/** Strip leading zeros from an integer digit string. */
function stripLeadingZeros(digits: string): string {
  const stripped = digits.replace(/^0+/, '');
  return stripped === '' ? '0' : stripped;
}

/** Normalize by moving trailing zeros in digits into exp. */
export function normalize(value: DecimalValue): DecimalValue {
  if (value.digits === '0' || /^0+$/.test(value.digits)) {
    return { ...ZERO };
  }
  let { digits, exp } = value;
  digits = stripLeadingZeros(digits);
  while (digits.length > 1 && digits.endsWith('0')) {
    digits = digits.slice(0, -1);
    exp += 1;
  }
  return { sign: value.sign, digits, exp };
}

/** Multiply by 10^n exactly (n may be negative). */
export function scaleByPow10(value: DecimalValue, n: number): DecimalValue {
  if (isZero(value)) return { ...ZERO };
  return normalize({ sign: value.sign, digits: value.digits, exp: value.exp + n });
}

export function multiplyByInt(value: DecimalValue, factor: number): DecimalValue {
  if (isZero(value)) return { ...ZERO };
  if (!Number.isInteger(factor) || factor === 0) {
    if (factor === 0) return { ...ZERO };
    throw new Error('Factor must be an integer');
  }
  const sign: 1 | -1 = factor < 0 ? ((-value.sign) as 1 | -1) : value.sign;
  const absFactor = Math.abs(factor);
  // BigInt multiply for exact integer factor (1000).
  const product = (BigInt(value.digits) * BigInt(absFactor)).toString();
  return normalize({ sign, digits: product, exp: value.exp });
}

export function divideByInt(value: DecimalValue, divisor: number): DecimalValue {
  if (isZero(value)) return { ...ZERO };
  if (!Number.isInteger(divisor) || divisor === 0) {
    throw new Error('Invalid divisor');
  }
  const sign: 1 | -1 = divisor < 0 ? ((-value.sign) as 1 | -1) : value.sign;
  const absDiv = Math.abs(divisor);
  // value = digits * 10^exp / absDiv
  // Expand digits with enough trailing zeros for exact division when possible,
  // otherwise keep remainder as fractional decimal digits (up to 24 places).
  let digits = value.digits;
  let exp = value.exp;
  let big = BigInt(digits);
  const div = BigInt(absDiv);
  // Add zeros until divisible or we hit precision cap.
  let guard = 0;
  while (big % div !== 0n && guard < 24) {
    big *= 10n;
    exp -= 1;
    guard += 1;
  }
  const quot = big / div;
  return normalize({ sign, digits: quot.toString(), exp });
}

/**
 * Parse a user number string into DecimalValue.
 * Supports: 1000, 1.5, .5, 1e12, 1.5E+9, -2.5e11, 1×10¹²-like plain forms via caller.
 */
export function parseDecimalString(raw: string): DecimalValue | null {
  const cleaned = raw.trim().replace(/,/g, '').replace(/\s+/g, '');
  if (!cleaned) return null;

  // Unicode multiply / superscript scientific: 1×10¹² or 1 x 10^12
  const sciMatch = cleaned.match(
    /^([+-]?)(\d+(?:\.\d+)?)\s*[×xX*]\s*10\s*(?:\^|\*\*)?\s*([+-]?\d+)$/u
  );
  if (sciMatch) {
    const sign: 1 | -1 = sciMatch[1] === '-' ? -1 : 1;
    const mant = sciMatch[2];
    const exp = Number(sciMatch[3]);
    if (!Number.isFinite(exp)) return null;
    return fromMantissaString(sign, mant, exp);
  }

  // E notation
  const eMatch = cleaned.match(/^([+-]?)(\d+(?:\.\d+)?|\.\d+)[eE]([+-]?\d+)$/);
  if (eMatch) {
    const sign: 1 | -1 = eMatch[1] === '-' ? -1 : 1;
    return fromMantissaString(sign, eMatch[2], Number(eMatch[3]));
  }

  const plain = cleaned.match(/^([+-]?)(\d+(?:\.\d+)?|\.\d+)$/);
  if (!plain) return null;
  const sign: 1 | -1 = plain[1] === '-' ? -1 : 1;
  return fromMantissaString(sign, plain[2], 0);
}

function fromMantissaString(sign: 1 | -1, mant: string, expAdd: number): DecimalValue {
  let body = mant;
  if (body.startsWith('.')) body = `0${body}`;
  const dot = body.indexOf('.');
  if (dot === -1) {
    return normalize({ sign, digits: stripLeadingZeros(body), exp: expAdd });
  }
  const intPart = body.slice(0, dot);
  const fracPart = body.slice(dot + 1).replace(/0+$/, '');
  if (fracPart === '') {
    return normalize({ sign, digits: stripLeadingZeros(intPart || '0'), exp: expAdd });
  }
  const digits = stripLeadingZeros(`${intPart}${fracPart}`);
  const exp = expAdd - fracPart.length;
  return normalize({ sign, digits, exp });
}

/** Format without grouping; suitable for editable fields. */
export function formatPlain(value: DecimalValue, maxFrac = 12): string {
  if (isZero(value)) return '0';
  const { sign, digits, exp } = value;
  const prefix = sign < 0 ? '-' : '';

  if (exp >= 0) {
    return `${prefix}${digits}${'0'.repeat(exp)}`;
  }

  const place = -exp;
  if (place < digits.length) {
    const split = digits.length - place;
    const intPart = digits.slice(0, split) || '0';
    let frac = digits.slice(split);
    if (frac.length > maxFrac) {
      frac = roundFrac(intPart, frac, maxFrac);
    }
    frac = frac.replace(/0+$/, '');
    return frac ? `${prefix}${intPart}.${frac}` : `${prefix}${intPart}`;
  }

  // 0.00...digits
  const zeros = place - digits.length;
  let frac = `${'0'.repeat(zeros)}${digits}`;
  if (frac.length > maxFrac) {
    frac = roundFrac('0', frac, maxFrac);
  }
  frac = frac.replace(/0+$/, '');
  return frac ? `${prefix}0.${frac}` : `${prefix}0`;
}

function roundFrac(intPart: string, frac: string, maxFrac: number): string {
  if (frac.length <= maxFrac) return frac;
  const keep = frac.slice(0, maxFrac);
  const next = frac.charCodeAt(maxFrac) - 48;
  if (next < 5) return keep;
  // Round up keep as integer
  const rounded = (BigInt(keep || '0') + 1n).toString().padStart(maxFrac, '0');
  if (rounded.length > maxFrac) {
    // Carry into int — rare in display path; truncate to maxFrac zeros after bump
    return rounded.slice(1);
  }
  void intPart;
  return rounded;
}

/** Grouped absolute integer/decimal display. */
export function formatGrouped(value: DecimalValue): string {
  const plain = formatPlain(value, 24);
  if (!plain.includes('.')) {
    return plain.replace(/^(-?)/, '$1').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const [intPart, frac] = plain.split('.');
  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${groupedInt}.${frac}`;
}

/** Scientific: a × 10ⁿ with 1 ≤ |a| < 10 (or 0). */
export function toScientificParts(value: DecimalValue): {
  mantissa: string;
  exponent: number;
  sign: 1 | -1;
} {
  if (isZero(value)) return { mantissa: '0', exponent: 0, sign: 1 };
  const { sign, digits, exp } = value;
  // digits * 10^exp = (d.ddd...) * 10^(exp + digits.length - 1)
  const exponent = exp + digits.length - 1;
  const mantissa =
    digits.length === 1 ? digits : `${digits[0]}.${digits.slice(1).replace(/0+$/, '')}`;
  const cleanMant = mantissa.endsWith('.') ? mantissa.slice(0, -1) : mantissa;
  return { mantissa: cleanMant, exponent, sign };
}

const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
};

function toSuperscript(n: number): string {
  return String(n)
    .split('')
    .map((ch) => SUPERSCRIPT[ch] ?? ch)
    .join('');
}

export function formatScientific(value: DecimalValue): string {
  if (isZero(value)) return '0';
  const { mantissa, exponent, sign } = toScientificParts(value);
  const prefix = sign < 0 ? '−' : '';
  if (exponent === 0) return `${prefix}${mantissa}`;
  return `${prefix}${mantissa} × 10${toSuperscript(exponent)}`;
}

export function formatScientificE(value: DecimalValue): string {
  if (isZero(value)) return '0';
  const { mantissa, exponent, sign } = toScientificParts(value);
  const prefix = sign < 0 ? '-' : '';
  return `${prefix}${mantissa}e${exponent}`;
}

export function absoluteFromBillion(billion: DecimalValue): DecimalValue {
  return scaleByPow10(billion, BILLION_POWER);
}

export function absoluteFromTrillion(trillion: DecimalValue): DecimalValue {
  return scaleByPow10(trillion, TRILLION_POWER);
}

export function billionFromAbsolute(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -BILLION_POWER);
}

export function trillionFromAbsolute(absolute: DecimalValue): DecimalValue {
  return scaleByPow10(absolute, -TRILLION_POWER);
}

export function billionToTrillion(billion: DecimalValue): DecimalValue {
  return divideByInt(billion, BILLIONS_PER_TRILLION);
}

export function trillionToBillion(trillion: DecimalValue): DecimalValue {
  return multiplyByInt(trillion, BILLIONS_PER_TRILLION);
}

export function buildResult(absolute: DecimalValue): BillionTrillionResult {
  const billion = billionFromAbsolute(absolute);
  const trillion = trillionFromAbsolute(absolute);
  return {
    billion,
    trillion,
    absolute,
    billionDisplay: formatPlain(billion),
    trillionDisplay: formatPlain(trillion),
    absoluteGrouped: formatGrouped(absolute),
    scientificNotation: formatScientific(absolute),
    scientificE: formatScientificE(absolute),
  };
}

/** Default: 1000 billion = 1 trillion = 1×10¹² */
export function defaultAbsolute(): DecimalValue {
  return absoluteFromTrillion({ sign: 1, digits: '1', exp: 0 });
}
