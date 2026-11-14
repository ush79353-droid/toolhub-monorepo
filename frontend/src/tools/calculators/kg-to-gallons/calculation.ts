import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  KG_PER_L_PER_DENSITY_UNIT,
  KG_PER_MASS_UNIT,
  LITERS_PER_VOLUME_UNIT,
  type DensityUnit,
  type KgToGallonsInput,
  type KgToGallonsResult,
  type MassUnit,
  type OtherUnitRow,
  type VolumeUnit,
} from './types';

/** Readable measure display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-6)) {
    return value
      .toExponential(8)
      .replace(/(\.\d*?[1-9])0+e/, '$1e')
      .replace(/\.0+e/, 'e')
      .replace(/e\+?/, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function densityToKgPerL(value: number, unit: DensityUnit): number {
  return value * KG_PER_L_PER_DENSITY_UNIT[unit];
}

export function kgPerLToDensity(kgPerL: number, unit: DensityUnit): number {
  return kgPerL / KG_PER_L_PER_DENSITY_UNIT[unit];
}

export function volumeToLiters(value: number, unit: VolumeUnit): number {
  return value * LITERS_PER_VOLUME_UNIT[unit];
}

export function litersToVolume(liters: number, unit: VolumeUnit): number {
  return liters / LITERS_PER_VOLUME_UNIT[unit];
}

export function massToKilograms(value: number, unit: MassUnit): number {
  return value * KG_PER_MASS_UNIT[unit];
}

export function kilogramsToMass(kg: number, unit: MassUnit): number {
  return kg / KG_PER_MASS_UNIT[unit];
}

export function resolveDensityKgPerL(input: KgToGallonsInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerL(input.densityValue, input.densityUnit);
}

function otherVolumeUnits(liters: number): readonly OtherUnitRow[] {
  return [
    { unit: 'L', label: 'Liters (L)', value: liters },
    { unit: 'mL', label: 'Milliliters (mL)', value: litersToVolume(liters, 'mL') },
    {
      unit: 'US gal',
      label: 'US liquid gallons',
      value: litersToVolume(liters, 'usLiquidGal'),
    },
    {
      unit: 'Imp. gal',
      label: 'Imperial gallons',
      value: litersToVolume(liters, 'imperialGal'),
    },
    {
      unit: 'US dry gal',
      label: 'US dry gallons',
      value: litersToVolume(liters, 'usDryGal'),
    },
    { unit: 'US qt', label: 'US liquid quarts', value: litersToVolume(liters, 'usQuart') },
    { unit: 'US pt', label: 'US liquid pints', value: litersToVolume(liters, 'usPint') },
    { unit: 'ft³', label: 'Cubic feet', value: litersToVolume(liters, 'ft3') },
    { unit: 'm³', label: 'Cubic meters', value: litersToVolume(liters, 'm3') },
  ];
}

function otherMassUnits(massKg: number): readonly OtherUnitRow[] {
  return [
    { unit: 'kg', label: 'Kilograms (kg)', value: massKg },
    { unit: 'g', label: 'Grams (g)', value: kilogramsToMass(massKg, 'g') },
    { unit: 'mg', label: 'Milligrams (mg)', value: kilogramsToMass(massKg, 'mg') },
    { unit: 'oz', label: 'Ounces (oz)', value: kilogramsToMass(massKg, 'oz') },
    { unit: 'lb', label: 'Pounds (lb)', value: kilogramsToMass(massKg, 'lb') },
    { unit: 't', label: 'Metric tonnes', value: kilogramsToMass(massKg, 'tonne') },
  ];
}

export function calculateKgToGallons(input: KgToGallonsInput): KgToGallonsResult {
  const densityKgPerL = resolveDensityKgPerL(input)!;
  let massKg: number;
  let volumeL: number;

  if (input.source === 'mass') {
    massKg = massToKilograms(input.mass!, input.massUnit);
    volumeL = massKg / densityKgPerL;
  } else {
    volumeL = volumeToLiters(input.volume!, input.volumeUnit);
    massKg = volumeL * densityKgPerL;
  }

  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID
      ? undefined
      : findSubstance(input.substanceId);

  return {
    source: input.source,
    category: input.category,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom substance',
    densityKgPerL,
    densityApproximate: substance?.approximate ?? true,
    gallonStandard: input.gallonStandard,
    massKg,
    volumeL,
    mass: kilogramsToMass(massKg, input.massUnit),
    massUnit: input.massUnit,
    volume: litersToVolume(volumeL, input.volumeUnit),
    volumeUnit: input.volumeUnit,
    otherVolumeUnits: otherVolumeUnits(volumeL),
    otherMassUnits: otherMassUnits(massKg),
  };
}
