import { CUSTOM_MATERIAL_ID, findMaterial } from '../cubic-meter-to-ton/materials';
import {
  CUBIC_METERS_PER_VOLUME_UNIT,
  DENSITY_UNIT_OPTIONS,
  KG_PER_M3_PER_DENSITY_UNIT,
  KG_PER_MASS_UNIT,
  MASS_UNIT_LABEL,
  VOLUME_UNIT_LABEL,
  type DensityUnit,
  type GalToTonsInput,
  type GalToTonsResult,
  type MassUnit,
  type VolumeUnit,
} from './types';

/** Readable measure display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function densityToKgPerM3(value: number, unit: DensityUnit): number {
  return value * KG_PER_M3_PER_DENSITY_UNIT[unit];
}

export function kgPerM3ToDensity(kgPerM3: number, unit: DensityUnit): number {
  return kgPerM3 / KG_PER_M3_PER_DENSITY_UNIT[unit];
}

export function toM3(value: number, unit: VolumeUnit): number {
  return value * CUBIC_METERS_PER_VOLUME_UNIT[unit];
}

export function fromM3(m3: number, unit: VolumeUnit): number {
  return m3 / CUBIC_METERS_PER_VOLUME_UNIT[unit];
}

export function toKg(value: number, unit: MassUnit): number {
  return value * KG_PER_MASS_UNIT[unit];
}

export function fromKg(kg: number, unit: MassUnit): number {
  return kg / KG_PER_MASS_UNIT[unit];
}

export function volumeToMass(
  volume: number,
  volumeUnit: VolumeUnit,
  densityKgPerM3: number,
  massUnit: MassUnit,
): number {
  if (!Number.isFinite(volume) || volume < 0) {
    throw new RangeError('Invalid volume or density.');
  }
  if (!Number.isFinite(densityKgPerM3) || densityKgPerM3 <= 0) {
    throw new RangeError('Invalid volume or density.');
  }
  const massKg = toM3(volume, volumeUnit) * densityKgPerM3;
  return fromKg(massKg, massUnit);
}

export function massToVolume(
  mass: number,
  massUnit: MassUnit,
  densityKgPerM3: number,
  volumeUnit: VolumeUnit,
): number {
  if (!Number.isFinite(mass) || mass < 0) {
    throw new RangeError('Invalid mass or density.');
  }
  if (!Number.isFinite(densityKgPerM3) || densityKgPerM3 <= 0) {
    throw new RangeError('Invalid mass or density.');
  }
  const volumeM3 = toKg(mass, massUnit) / densityKgPerM3;
  return fromM3(volumeM3, volumeUnit);
}

export function resolveDensityKgPerM3(input: GalToTonsInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerM3(input.densityValue, input.densityUnit);
}

export function calculateGalToTons(input: GalToTonsInput): GalToTonsResult {
  const densityKgPerM3 = resolveDensityKgPerM3(input)!;
  let volumeM3: number;
  let massKg: number;

  if (input.source === 'volume') {
    volumeM3 = toM3(input.volume!, input.volumeUnit);
    massKg = volumeM3 * densityKgPerM3;
  } else {
    massKg = toKg(input.mass!, input.massUnit);
    volumeM3 = massKg / densityKgPerM3;
  }

  const volume = fromM3(volumeM3, input.volumeUnit);
  const mass = fromKg(massKg, input.massUnit);
  const material =
    input.materialId === CUSTOM_MATERIAL_ID ? undefined : findMaterial(input.materialId);

  const explanation =
    input.source === 'volume'
      ? `${formatMeasure(volumeM3)} m³ × ${formatMeasure(densityKgPerM3)} kg/m³ = ${formatMeasure(massKg)} kg`
      : `${formatMeasure(massKg)} kg ÷ ${formatMeasure(densityKgPerM3)} kg/m³ = ${formatMeasure(volumeM3)} m³`;

  return {
    source: input.source,
    materialId: input.materialId,
    materialName: material?.name ?? 'Custom density',
    densityKgPerM3,
    densityApproximate: material?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    volume,
    volumeUnit: input.volumeUnit,
    volumeM3,
    mass,
    massUnit: input.massUnit,
    massKg,
    explanation,
  };
}

export function shareResultText(result: GalToTonsResult): string {
  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  return [
    'Gallons to Tons Converter — Omega Calculators',
    '',
    `Material: ${result.materialName}`,
    `Density: ${formatMeasure(result.densityValue)} ${densityLabel}${result.densityApproximate ? ' (approximate)' : ''}`,
    '',
    `${formatMeasure(result.volume)} ${VOLUME_UNIT_LABEL[result.volumeUnit]} ≈ ${formatMeasure(result.mass)} ${MASS_UNIT_LABEL[result.massUnit]}`,
    '',
    'Calculated with Omega Calculators',
    'Formula: Mass = Density × Volume',
    result.explanation,
  ].join('\n');
}
