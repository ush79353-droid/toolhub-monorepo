import {
  FEET_PER_MILE,
  FEET_PER_YARD,
  INCHES_PER_FOOT,
  METERS_PER_FOOT,
  type FeetToInchesInput,
  type FeetToInchesResult,
  type OtherUnitRow,
} from './types';

/** Readable length display without ugly trailing zeros. */
export function formatLength(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 6;
  if (abs >= 1_000_000) digits = 2;
  else if (abs >= 1) digits = 6;
  else if (abs >= 1e-6) digits = 10;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function feetToInches(feet: number): number {
  return feet * INCHES_PER_FOOT;
}

export function inchesToFeet(inches: number): number {
  return inches / INCHES_PER_FOOT;
}

function otherUnitsFromFeet(feet: number): readonly OtherUnitRow[] {
  const meters = feet * METERS_PER_FOOT;
  return [
    { unit: 'mm', label: 'Millimeters (mm)', value: meters * 1000 },
    { unit: 'cm', label: 'Centimeters (cm)', value: meters * 100 },
    { unit: 'm', label: 'Meters (m)', value: meters },
    { unit: 'yd', label: 'Yards (yd)', value: feet / FEET_PER_YARD },
    { unit: 'km', label: 'Kilometers (km)', value: meters / 1000 },
    { unit: 'mi', label: 'Miles (mi)', value: feet / FEET_PER_MILE },
  ];
}

export function calculateFeetToInches(input: FeetToInchesInput): FeetToInchesResult {
  let feet: number;
  let inches: number;

  if (input.source === 'feet') {
    feet = input.feet!;
    inches = feetToInches(feet);
  } else {
    inches = input.inches!;
    feet = inchesToFeet(inches);
  }

  return {
    source: input.source,
    feet,
    inches,
    otherUnits: otherUnitsFromFeet(feet),
  };
}
