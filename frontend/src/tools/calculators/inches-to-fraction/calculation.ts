import {
  CM_PER_INCH,
  INCHES_PER_FOOT,
  INCHES_PER_YARD,
  MM_PER_INCH,
  M_PER_INCH,
  type FractionPrecision,
  type InchesToFractionInput,
  type InchesToFractionResult,
  type OtherUnitRow,
} from './types';

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/** Readable decimal without ugly trailing zeros. */
export function formatDecimal(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 8;
  if (abs >= 1_000_000) digits = 2;
  else if (abs >= 1) digits = 8;
  else if (abs >= 1e-6) digits = 12;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function formatFractionParts(
  whole: number,
  numerator: number,
  denominator: number,
  negative: boolean
): string {
  const sign = negative ? '-' : '';
  if (numerator === 0) {
    return `${sign}${whole}`;
  }
  if (whole === 0) {
    return `${sign}${numerator}/${denominator}`;
  }
  return `${sign}${whole} ${numerator}/${denominator}`;
}

/**
 * Round decimal inches to the nearest 1/D increment and reduce.
 * Carry that overflows the denominator becomes the next whole inch.
 */
export function decimalToFraction(
  inches: number,
  precision: FractionPrecision
): {
  whole: number;
  numerator: number;
  denominator: number;
  roundedInches: number;
  negative: boolean;
  fractionLabel: string;
} {
  if (!Number.isFinite(inches)) {
    return {
      whole: 0,
      numerator: 0,
      denominator: precision,
      roundedInches: Number.NaN,
      negative: false,
      fractionLabel: '',
    };
  }

  const negative = inches < 0 || Object.is(inches, -0);
  const abs = Math.abs(inches);
  const roundedTicks = Math.round(abs * precision);
  const whole = Math.floor(roundedTicks / precision);
  let numerator = roundedTicks % precision;
  let denominator = precision;

  if (numerator !== 0) {
    const g = gcd(numerator, denominator);
    numerator /= g;
    denominator /= g;
  }

  const roundedInches = (negative ? -1 : 1) * (roundedTicks / precision);
  const fractionLabel = formatFractionParts(whole, numerator, denominator, negative);

  return { whole, numerator, denominator, roundedInches, negative, fractionLabel };
}

export type ParseLengthStatus =
  | { kind: 'ok'; value: number }
  | { kind: 'incomplete' }
  | { kind: 'invalid'; message: string };

/**
 * Parse decimal inches, proper/improper fractions, or mixed numbers.
 * Incomplete drafts such as `1/` or `2 3/` return incomplete (not invalid).
 */
export function parseLengthInput(raw: string): ParseLengthStatus {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { kind: 'incomplete' };

  // Incomplete while typing a sign or trailing decimal / slash.
  if (
    cleaned === '-' ||
    cleaned === '.' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    cleaned.endsWith('/') ||
    /^-?\d+\s+$/.test(cleaned) ||
    /^-?\d+\s+\d+$/.test(cleaned) ||
    /^-?\d+\s+\d+\/$/.test(cleaned)
  ) {
    return { kind: 'incomplete' };
  }

  // Mixed number: optional sign, whole, space, num/den
  const mixed = cleaned.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1;
    const whole = Number(mixed[2]);
    const num = Number(mixed[3]);
    const den = Number(mixed[4]);
    if (den === 0) return { kind: 'invalid', message: 'Denominator cannot be zero.' };
    return { kind: 'ok', value: sign * (whole + num / den) };
  }

  // Simple fraction: optional sign, num/den
  const frac = cleaned.match(/^(-?)(\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    const sign = frac[1] === '-' ? -1 : 1;
    const num = Number(frac[2]);
    const den = Number(frac[3]);
    if (den === 0) return { kind: 'invalid', message: 'Denominator cannot be zero.' };
    return { kind: 'ok', value: sign * (num / den) };
  }

  // Plain decimal / integer
  if (/^-?\d+(\.\d+)?$/.test(cleaned)) {
    const value = Number(cleaned);
    if (!Number.isFinite(value)) {
      return { kind: 'invalid', message: 'Enter a valid measurement.' };
    }
    return { kind: 'ok', value };
  }

  return { kind: 'invalid', message: 'Enter a decimal, fraction, or mixed number.' };
}

function otherUnitsFromInches(inches: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mm', label: 'Millimeters (mm)', value: inches * MM_PER_INCH },
    { unit: 'cm', label: 'Centimeters (cm)', value: inches * CM_PER_INCH },
    { unit: 'm', label: 'Meters (m)', value: inches * M_PER_INCH },
    { unit: 'ft', label: 'Feet (ft)', value: inches / INCHES_PER_FOOT },
    { unit: 'yd', label: 'Yards (yd)', value: inches / INCHES_PER_YARD },
  ];
}

export function calculateInchesToFraction(
  input: InchesToFractionInput
): InchesToFractionResult {
  const inches = input.inches!;
  const parts = decimalToFraction(inches, input.precision);
  const isApproximate = Math.abs(parts.roundedInches - inches) > 1e-12;

  return {
    inches,
    precision: input.precision,
    fractionLabel: parts.fractionLabel,
    whole: parts.whole,
    numerator: parts.numerator,
    denominator: parts.denominator,
    roundedInches: parts.roundedInches,
    isApproximate,
    negative: parts.negative,
    otherUnits: otherUnitsFromInches(inches),
  };
}
