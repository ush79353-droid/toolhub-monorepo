import {
  GRAMS_PER_AVOIRDUPOIS_OUNCE,
  GRAMS_PER_DECAGRAM,
  GRAMS_PER_KILOGRAM,
  GRAMS_PER_POUND,
  GRAMS_PER_SHORT_TON,
  GRAMS_PER_TONNE,
  MILLIGRAMS_PER_GRAM,
  type GramsToOuncesInput,
  type GramsToOuncesResult,
  type OtherUnitRow,
} from './types';

/** Readable mass display without ugly trailing zeros. */
export function formatMass(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function gramsToOunces(grams: number): number {
  return grams / GRAMS_PER_AVOIRDUPOIS_OUNCE;
}

export function ouncesToGrams(ounces: number): number {
  return ounces * GRAMS_PER_AVOIRDUPOIS_OUNCE;
}

function otherUnitsFromGrams(g: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mg', label: 'Milligrams (mg)', value: g * MILLIGRAMS_PER_GRAM },
    { unit: 'g', label: 'Grams (g)', value: g },
    { unit: 'dag', label: 'Decagrams (dag)', value: g / GRAMS_PER_DECAGRAM },
    { unit: 'kg', label: 'Kilograms (kg)', value: g / GRAMS_PER_KILOGRAM },
    { unit: 'oz', label: 'Avoirdupois ounces (oz)', value: gramsToOunces(g) },
    { unit: 'lb', label: 'Pounds (lb)', value: g / GRAMS_PER_POUND },
    {
      unit: 'short ton',
      label: 'US short tons',
      value: g / GRAMS_PER_SHORT_TON,
    },
    { unit: 't', label: 'Metric tonnes (t)', value: g / GRAMS_PER_TONNE },
  ];
}

export function calculateGramsToOunces(input: GramsToOuncesInput): GramsToOuncesResult {
  let g: number;
  let oz: number;

  if (input.source === 'g') {
    g = input.g!;
    oz = gramsToOunces(g);
  } else {
    oz = input.oz!;
    g = ouncesToGrams(oz);
  }

  return {
    source: input.source,
    g,
    oz,
    otherUnits: otherUnitsFromGrams(g),
  };
}
