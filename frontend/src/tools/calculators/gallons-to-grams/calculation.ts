import { formatMeasure as formatVolume } from '../cubic-feet/calculation';
import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  CUBIC_METERS_PER_US_GALLON,
  GRAMS_PER_KILOGRAM,
  KG_PER_M3_PER_DENSITY_UNIT,
  LITERS_PER_US_GALLON,
  type DensityUnit,
  type GalToGramsInput,
  type GalToGramsResult,
} from './types';

export { formatVolume as formatMeasure };

export function densityToKgPerM3(value: number, unit: DensityUnit): number {
  return value * KG_PER_M3_PER_DENSITY_UNIT[unit];
}

export function kgPerM3ToDensity(kgPerM3: number, unit: DensityUnit): number {
  return kgPerM3 / KG_PER_M3_PER_DENSITY_UNIT[unit];
}

/** US liquid gallons → grams at density in kg/m³. */
export function gallonsToGrams(gallons: number, densityKgPerM3: number): number {
  if (!Number.isFinite(gallons) || gallons < 0) {
    throw new RangeError('Gallons must be finite and non-negative.');
  }
  if (!Number.isFinite(densityKgPerM3) || densityKgPerM3 <= 0) {
    throw new RangeError('Density must be finite and greater than zero.');
  }
  return gallons * CUBIC_METERS_PER_US_GALLON * densityKgPerM3 * GRAMS_PER_KILOGRAM;
}

/** Grams → US liquid gallons at density in kg/m³. */
export function gramsToGallons(grams: number, densityKgPerM3: number): number {
  if (!Number.isFinite(grams) || grams < 0) {
    throw new RangeError('Grams must be finite and non-negative.');
  }
  if (!Number.isFinite(densityKgPerM3) || densityKgPerM3 <= 0) {
    throw new RangeError('Density must be finite and greater than zero.');
  }
  return grams / (CUBIC_METERS_PER_US_GALLON * densityKgPerM3 * GRAMS_PER_KILOGRAM);
}

export function resolveDensityKgPerM3(input: GalToGramsInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerM3(input.densityValue, input.densityUnit);
}

export function calculateGalToGrams(input: GalToGramsInput): GalToGramsResult {
  const densityKgPerM3 = resolveDensityKgPerM3(input)!;
  let gallons: number;
  let grams: number;

  if (input.source === 'volume') {
    gallons = input.gallons!;
    grams = gallonsToGrams(gallons, densityKgPerM3);
  } else {
    grams = input.grams!;
    gallons = gramsToGallons(grams, densityKgPerM3);
  }

  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);

  const explanation =
    input.source === 'volume'
      ? `${formatVolume(gallons)} US gal × ${formatVolume(LITERS_PER_US_GALLON)} L/gal × ${formatVolume(densityKgPerM3)} kg/m³ = ${formatVolume(grams)} g`
      : `${formatVolume(grams)} g ÷ (${formatVolume(LITERS_PER_US_GALLON)} × ${formatVolume(densityKgPerM3)}) = ${formatVolume(gallons)} US gal`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom density',
    densityKgPerM3,
    densityApproximate: substance?.approximate ?? true,
    gallons,
    grams,
    explanation,
  };
}

export function shareResultText(result: GalToGramsResult): string {
  return [
    'Gallons to Grams Conversion — Omega Calculators',
    '',
    `Substance: ${result.substanceName}`,
    `Density: ${formatVolume(result.densityKgPerM3)} kg/m³${result.densityApproximate ? ' (approximate)' : ''}`,
    '',
    `${formatVolume(result.gallons)} US gallon${result.gallons === 1 ? '' : 's'} = ${formatVolume(result.grams)} grams`,
    '',
    'Formula:',
    'Mass = Density × Volume',
    result.explanation,
  ].join('\n');
}
