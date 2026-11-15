import { CUSTOM_INGREDIENT_ID, findIngredient } from './ingredients';
import {
  G_PER_ML_PER_DENSITY_UNIT,
  GRAMS_PER_MASS_UNIT,
  ML_PER_VOLUME_UNIT,
  type DensityUnit,
  type MassUnit,
  type OtherUnitRow,
  type PintToPoundInput,
  type PintToPoundResult,
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

export function resolveDensityGPerMl(input: PintToPoundInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToGPerMl(input.densityValue, input.densityUnit);
}

function otherVolumeUnits(ml: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mL', label: 'Milliliters (mL)', value: ml },
    { unit: 'L', label: 'Liters (L)', value: mlToVolume(ml, 'L') },
    { unit: 'US cup', label: 'US liquid cups', value: mlToVolume(ml, 'usCup') },
    {
      unit: 'US liq. pt',
      label: 'US liquid pints',
      value: mlToVolume(ml, 'usLiquidPt'),
    },
    {
      unit: 'Imp. pt',
      label: 'Imperial liquid pints',
      value: mlToVolume(ml, 'imperialPt'),
    },
    {
      unit: 'US dry pt',
      label: 'US dry pints',
      value: mlToVolume(ml, 'usDryPt'),
    },
    {
      unit: 'US qt',
      label: 'US liquid quarts',
      value: mlToVolume(ml, 'usQuart'),
    },
  ];
}

function otherMassUnits(massG: number): readonly OtherUnitRow[] {
  return [
    { unit: 'g', label: 'Grams (g)', value: massG },
    { unit: 'kg', label: 'Kilograms (kg)', value: gramsToMass(massG, 'kg') },
    { unit: 'oz', label: 'Ounces (oz)', value: gramsToMass(massG, 'oz') },
    { unit: 'lb', label: 'Pounds (lb)', value: gramsToMass(massG, 'lb') },
  ];
}

export function calculatePintToPound(input: PintToPoundInput): PintToPoundResult {
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

  const ingredient =
    input.ingredientId === CUSTOM_INGREDIENT_ID
      ? undefined
      : findIngredient(input.ingredientId);

  return {
    source: input.source,
    ingredientId: input.ingredientId,
    ingredientName: ingredient?.name ?? 'Custom ingredient',
    densityGPerMl,
    densityApproximate: ingredient?.approximate ?? true,
    pintStandard: input.pintStandard,
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
