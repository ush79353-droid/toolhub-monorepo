import {
  decimalToFraction,
  formatDecimal,
  formatFractionParts,
  parseLengthInput,
} from '../inches-to-fraction/calculation';
import type { ParseLengthStatus } from '../inches-to-fraction/calculation';
import {
  CM_PER_INCH,
  INCHES_PER_FOOT,
  INCHES_PER_YARD,
  MM_PER_INCH,
  M_PER_INCH,
  type FeetAndInchesInput,
  type FeetAndInchesResult,
  type FractionPrecision,
  type LengthParts,
  type NormalizedLength,
  type OtherUnitRow,
} from './types';

export { formatDecimal, parseLengthInput };
export type { ParseLengthStatus };

/** Plain decimal/integer feet field (no fractions). */
export function parseFeetInput(raw: string): ParseLengthStatus {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { kind: 'incomplete' };
  if (
    cleaned === '-' ||
    cleaned === '.' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    /e[+-]?$/i.test(cleaned)
  ) {
    return { kind: 'incomplete' };
  }
  if (!/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(cleaned)) {
    return { kind: 'invalid', message: 'Enter a valid number of feet.' };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { kind: 'invalid', message: 'Enter a valid number of feet.' };
  }
  return { kind: 'ok', value };
}

/**
 * Combine feet + inches into total inches.
 * Prefer a single leading sign on the whole measurement: if feet is negative and
 * inches is non-negative, treat inches as magnitude under the feet sign.
 */
export function toTotalInches(feet: number, inches: number): number {
  if (feet < 0 && inches >= 0) {
    return -(Math.abs(feet) * INCHES_PER_FOOT + inches);
  }
  if (feet >= 0 && inches < 0) {
    // Inconsistent mixed signs — still form a total for math; validation warns.
    return feet * INCHES_PER_FOOT + inches;
  }
  return feet * INCHES_PER_FOOT + inches;
}

export function lengthPartsToTotalInches(parts: LengthParts): number | null {
  if (parts.feet === null && parts.inches === null) return null;
  const feet = parts.feet ?? 0;
  const inches = parts.inches ?? 0;
  return toTotalInches(feet, inches);
}

export function normalizeTotalInches(
  totalInches: number,
  precision: FractionPrecision
): NormalizedLength {
  const negative = totalInches < 0 || Object.is(totalInches, -0);
  const abs = Math.abs(totalInches);

  const roundedTicks = Math.round(abs * precision);
  let roundedAbs = roundedTicks / precision;
  // Carry when rounding lands exactly on a foot boundary (already handled by /12).
  let feet = Math.floor(roundedAbs / INCHES_PER_FOOT);
  let remInches = roundedAbs - feet * INCHES_PER_FOOT;

  // Floating-point guard: rem extremely close to 12 → next foot.
  if (remInches >= INCHES_PER_FOOT - 1e-12) {
    feet += 1;
    remInches = 0;
    roundedAbs = feet * INCHES_PER_FOOT;
  }

  const frac = decimalToFraction(remInches, precision);
  const inchesLabel =
    frac.numerator === 0
      ? String(frac.whole)
      : formatFractionParts(frac.whole, frac.numerator, frac.denominator, false);

  const sign = negative ? '-' : '';
  const mixedLabel =
    feet === 0 && frac.numerator === 0 && frac.whole === 0
      ? `${sign}0 ft 0 in`
      : `${sign}${feet} ft ${inchesLabel} in`;

  const roundedTotalInches = (negative ? -1 : 1) * (feet * INCHES_PER_FOOT + remInches);
  const isApproximate = Math.abs(roundedTotalInches - totalInches) > 1e-9;

  return {
    totalInches,
    roundedTotalInches,
    feet: negative ? -feet : feet,
    inchesLabel,
    mixedLabel,
    isApproximate,
    negative,
  };
}

function otherUnitsFromInches(inches: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mm', label: 'Millimeters (mm)', value: inches * MM_PER_INCH },
    { unit: 'cm', label: 'Centimeters (cm)', value: inches * CM_PER_INCH },
    { unit: 'm', label: 'Meters (m)', value: inches * M_PER_INCH },
    { unit: 'yd', label: 'Yards (yd)', value: inches / INCHES_PER_YARD },
    { unit: 'ft', label: 'Decimal feet (ft)', value: inches / INCHES_PER_FOOT },
    { unit: 'in', label: 'Decimal inches (in)', value: inches },
  ];
}

export function calculateFeetAndInches(input: FeetAndInchesInput): FeetAndInchesResult {
  const firstTotal = lengthPartsToTotalInches(input.first)!;
  let resultInches: number;
  let secondTotal: number | null = null;
  let scalar: number | null = null;

  if (input.operation === 'add' || input.operation === 'subtract') {
    secondTotal = lengthPartsToTotalInches(input.second)!;
    resultInches =
      input.operation === 'add' ? firstTotal + secondTotal : firstTotal - secondTotal;
  } else {
    scalar = input.scalar!;
    resultInches =
      input.operation === 'multiply' ? firstTotal * scalar : firstTotal / scalar;
  }

  const normalized = normalizeTotalInches(resultInches, input.precision);

  return {
    operation: input.operation,
    precision: input.precision,
    firstTotalInches: firstTotal,
    secondTotalInches: secondTotal,
    scalar,
    normalized,
    decimalFeet: resultInches / INCHES_PER_FOOT,
    totalInches: resultInches,
    otherUnits: otherUnitsFromInches(resultInches),
  };
}
