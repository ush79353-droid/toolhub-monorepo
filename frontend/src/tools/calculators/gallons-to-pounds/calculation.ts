import { CUSTOM_LIQUID_ID, findLiquid } from './liquids';
import {
  G_PER_ML_PER_DENSITY_UNIT,
  GRAMS_PER_MASS_UNIT,
  ML_PER_VOLUME_UNIT,
  type DensityUnit,
  type GallonsToPoundsInput,
  type GallonsToPoundsResult,
  type MassUnit,
  type OtherUnitRow,
  type VolumeUnit,
} from './types';

/** Readable measure display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
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

export function densityToGPerMl(value: number, unit: DensityUnit): number {
  return value * G_PER_ML_PER_DENSITY_UNIT[unit];
}

export function gPerMlToDensity(gPerMl: number, unit: DensityUnit): number {
  return gPerMl / G_PER_ML_PER_DENSITY_UNIT[unit];
}

export function volumeToMl(value: number, unit: VolumeUnit): number {
  return value * ML_PER_VOLUME_UNIT[unit];
}

export function mlToVolume(ml: number, unit: VolumeUnit): number {
  return ml / ML_PER_VOLUME_UNIT[unit];
}

export function massToGrams(value: number, unit: MassUnit): number {
  return value * GRAMS_PER_MASS_UNIT[unit];
}

export function gramsToMass(grams: number, unit: MassUnit): number {
  return grams / GRAMS_PER_MASS_UNIT[unit];
}

export function resolveDensityGPerMl(input: GallonsToPoundsInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToGPerMl(input.densityValue, input.densityUnit);
}

function otherVolumeUnits(ml: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mL', label: 'Milliliters (mL)', value: ml },
    { unit: 'L', label: 'Liters (L)', value: mlToVolume(ml, 'L') },
    {
      unit: 'US gal',
      label: 'US liquid gallons',
      value: mlToVolume(ml, 'usLiquidGal'),
    },
    {
      unit: 'Imp. gal',
      label: 'Imperial gallons',
      value: mlToVolume(ml, 'imperialGal'),
    },
    {
      unit: 'US dry gal',
      label: 'US dry gallons',
      value: mlToVolume(ml, 'usDryGal'),
    },
    { unit: 'US qt', label: 'US liquid quarts', value: mlToVolume(ml, 'usQuart') },
    { unit: 'US pt', label: 'US liquid pints', value: mlToVolume(ml, 'usPint') },
    { unit: 'ft³', label: 'Cubic feet', value: mlToVolume(ml, 'ft3') },
  ];
}

function otherMassUnits(massG: number): readonly OtherUnitRow[] {
  return [
    { unit: 'g', label: 'Grams (g)', value: massG },
    { unit: 'kg', label: 'Kilograms (kg)', value: gramsToMass(massG, 'kg') },
    { unit: 'oz', label: 'Ounces (oz)', value: gramsToMass(massG, 'oz') },
    { unit: 'lb', label: 'Pounds (lb)', value: gramsToMass(massG, 'lb') },
    {
      unit: 'short ton',
      label: 'US short tons',
      value: gramsToMass(massG, 'shortTon'),
    },
    { unit: 't', label: 'Metric tonnes', value: gramsToMass(massG, 'tonne') },
  ];
}

export function calculateGallonsToPounds(
  input: GallonsToPoundsInput
): GallonsToPoundsResult {
  const densityGPerMl = resolveDensityGPerMl(input)!;
  let volumeMl: number;
  let massG: number;

  if (input.source === 'volume') {
    volumeMl = volumeToMl(input.volume!, input.volumeUnit);
    massG = volumeMl * densityGPerMl;
  } else {
    massG = massToGrams(input.mass!, input.massUnit);
    volumeMl = massG / densityGPerMl;
  }

  const liquid =
    input.liquidId === CUSTOM_LIQUID_ID ? undefined : findLiquid(input.liquidId);

  return {
    source: input.source,
    liquidId: input.liquidId,
    liquidName: liquid?.name ?? 'Custom liquid',
    densityGPerMl,
    densityApproximate: liquid?.approximate ?? true,
    gallonStandard: input.gallonStandard,
    volumeMl,
    massG,
    volume: mlToVolume(volumeMl, input.volumeUnit),
    volumeUnit: input.volumeUnit,
    mass: gramsToMass(massG, input.massUnit),
    massUnit: input.massUnit,
    otherVolumeUnits: otherVolumeUnits(volumeMl),
    otherMassUnits: otherMassUnits(massG),
  };
}
