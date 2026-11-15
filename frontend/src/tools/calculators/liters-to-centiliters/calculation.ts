import {
  CENTILITERS_PER_LITER,
  CUBIC_CENTIMETERS_PER_LITER,
  CUBIC_METERS_PER_LITER,
  DECILITERS_PER_LITER,
  LITERS_PER_US_FLUID_OUNCE,
  LITERS_PER_US_GALLON,
  MILLILITERS_PER_LITER,
  type LitersToCentilitersInput,
  type LitersToCentilitersResult,
  type OtherUnitRow,
} from './types';

/** Readable volume display without ugly trailing zeros. */
export function formatVolume(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function litersToCentiliters(liters: number): number {
  return liters * CENTILITERS_PER_LITER;
}

export function centilitersToLiters(centiliters: number): number {
  return centiliters / CENTILITERS_PER_LITER;
}

function otherUnitsFromLiters(liters: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mL', label: 'Milliliters (mL)', value: liters * MILLILITERS_PER_LITER },
    { unit: 'dL', label: 'Deciliters (dL)', value: liters * DECILITERS_PER_LITER },
    { unit: 'cm³', label: 'Cubic centimeters (cm³)', value: liters * CUBIC_CENTIMETERS_PER_LITER },
    { unit: 'm³', label: 'Cubic meters (m³)', value: liters * CUBIC_METERS_PER_LITER },
    { unit: 'US gal', label: 'US liquid gallons (US gal)', value: liters / LITERS_PER_US_GALLON },
    {
      unit: 'US fl oz',
      label: 'US fluid ounces (US fl oz)',
      value: liters / LITERS_PER_US_FLUID_OUNCE,
    },
  ];
}

export function calculateLitersToCentiliters(
  input: LitersToCentilitersInput
): LitersToCentilitersResult {
  let liters: number;
  let centiliters: number;

  if (input.source === 'liters') {
    liters = input.liters!;
    centiliters = litersToCentiliters(liters);
  } else {
    centiliters = input.centiliters!;
    liters = centilitersToLiters(centiliters);
  }

  return {
    source: input.source,
    liters,
    centiliters,
    otherUnits: otherUnitsFromLiters(liters),
  };
}
