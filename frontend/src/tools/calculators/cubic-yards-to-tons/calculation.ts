import {
  CUSTOM_MATERIAL_ID,
  findMaterial,
} from './materials';
import {
  CUBIC_METERS_PER_VOLUME_UNIT,
  KG_PER_M3_PER_DENSITY_UNIT,
  KILOGRAMS_PER_MASS_UNIT,
  type CubicYardsToTonsInput,
  type CubicYardsToTonsResult,
  type DensityUnit,
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

export function densityToKgPerM3(value: number, unit: DensityUnit): number {
  return value * KG_PER_M3_PER_DENSITY_UNIT[unit];
}

export function kgPerM3ToDensity(kgPerM3: number, unit: DensityUnit): number {
  return kgPerM3 / KG_PER_M3_PER_DENSITY_UNIT[unit];
}

export function volumeToCubicMeters(value: number, unit: VolumeUnit): number {
  return value * CUBIC_METERS_PER_VOLUME_UNIT[unit];
}

export function cubicMetersToVolume(cubicMeters: number, unit: VolumeUnit): number {
  return cubicMeters / CUBIC_METERS_PER_VOLUME_UNIT[unit];
}

export function massToKilograms(value: number, unit: MassUnit): number {
  return value * KILOGRAMS_PER_MASS_UNIT[unit];
}

export function kilogramsToMass(kilograms: number, unit: MassUnit): number {
  return kilograms / KILOGRAMS_PER_MASS_UNIT[unit];
}

export function resolveDensityKgPerM3(input: CubicYardsToTonsInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerM3(input.densityValue, input.densityUnit);
}

function otherVolumeUnits(cubicMeters: number): readonly OtherUnitRow[] {
  return [
    { unit: 'ft³', label: 'Cubic feet (ft³)', value: cubicMetersToVolume(cubicMeters, 'ft3') },
    { unit: 'm³', label: 'Cubic meters (m³)', value: cubicMeters },
    { unit: 'L', label: 'Liters (L)', value: cubicMetersToVolume(cubicMeters, 'L') },
  ];
}

function otherMassUnits(massKg: number): readonly OtherUnitRow[] {
  return [
    { unit: 'kg', label: 'Kilograms (kg)', value: massKg },
    { unit: 'lb', label: 'Pounds (lb)', value: kilogramsToMass(massKg, 'lb') },
    { unit: 't', label: 'Metric tonnes (t)', value: kilogramsToMass(massKg, 't') },
    {
      unit: 'US ton',
      label: 'US short tons',
      value: kilogramsToMass(massKg, 'usTon'),
    },
    {
      unit: 'long ton',
      label: 'Imperial long tons',
      value: kilogramsToMass(massKg, 'longTon'),
    },
  ];
}

export function calculateCubicYardsToTons(
  input: CubicYardsToTonsInput
): CubicYardsToTonsResult {
  const densityKgPerM3 = resolveDensityKgPerM3(input)!;
  let volumeCubicMeters: number;
  let massKg: number;

  if (input.source === 'volume') {
    volumeCubicMeters = volumeToCubicMeters(input.volume!, input.volumeUnit);
    massKg = volumeCubicMeters * densityKgPerM3;
  } else {
    massKg = massToKilograms(input.mass!, input.massUnit);
    volumeCubicMeters = massKg / densityKgPerM3;
  }

  const material =
    input.materialId === CUSTOM_MATERIAL_ID ? undefined : findMaterial(input.materialId);

  return {
    source: input.source,
    materialId: input.materialId,
    materialName: material?.name ?? 'Custom material',
    densityKgPerM3,
    densityApproximate: material?.approximate ?? true,
    volumeCubicMeters,
    massKg,
    volume: cubicMetersToVolume(volumeCubicMeters, input.volumeUnit),
    volumeUnit: input.volumeUnit,
    mass: kilogramsToMass(massKg, input.massUnit),
    massUnit: input.massUnit,
    otherVolumeUnits: otherVolumeUnits(volumeCubicMeters),
    otherMassUnits: otherMassUnits(massKg),
  };
}
