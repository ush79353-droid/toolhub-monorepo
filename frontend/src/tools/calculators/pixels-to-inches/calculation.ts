import {
  CM_PER_INCH,
  INCHES_PER_FOOT,
  MM_PER_INCH,
  type OtherUnitRow,
  type PixelsToInchesInput,
  type PixelsToInchesResult,
} from './types';

/** Readable numeric display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
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

export function pixelsToInches(pixels: number, ppi: number): number {
  return pixels / ppi;
}

export function inchesToPixels(inches: number, ppi: number): number {
  return inches * ppi;
}

function otherUnitsFromInches(inches: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mm', label: 'Millimeters (mm)', value: inches * MM_PER_INCH },
    { unit: 'cm', label: 'Centimeters (cm)', value: inches * CM_PER_INCH },
    { unit: 'ft', label: 'Feet (ft)', value: inches / INCHES_PER_FOOT },
  ];
}

export function calculatePixelsToInches(input: PixelsToInchesInput): PixelsToInchesResult {
  const ppi = input.ppi!;
  let inches: number;
  let pixels: number;

  if (input.source === 'inches') {
    inches = input.inches!;
    pixels = inchesToPixels(inches, ppi);
  } else {
    pixels = input.pixels!;
    inches = pixelsToInches(pixels, ppi);
  }

  return {
    source: input.source,
    inches,
    pixels,
    ppi,
    otherUnits: otherUnitsFromInches(inches),
  };
}
