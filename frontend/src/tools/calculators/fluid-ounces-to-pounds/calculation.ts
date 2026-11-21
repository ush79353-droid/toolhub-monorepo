import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  KG_PER_M3_PER_DENSITY_UNIT,
  KG_PER_MASS_UNIT,
  M3_PER_VOLUME_UNIT,
  POUND_TO_KG,
  US_FL_OZ_TO_M3,
  type DensityUnit,
  type FlOzToLbInput,
  type FlOzToLbResult,
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
  return value * M3_PER_VOLUME_UNIT[unit];
}

export function fromM3(m3: number, unit: VolumeUnit): number {
  return m3 / M3_PER_VOLUME_UNIT[unit];
}

export function toKg(value: number, unit: MassUnit): number {
  return value * KG_PER_MASS_UNIT[unit];
}

export function fromKg(kg: number, unit: MassUnit): number {
  return kg / KG_PER_MASS_UNIT[unit];
}

/** US fluid ounces → pounds at a density in kg/m³ (exact SI path). */
export function fluidOuncesToPounds(fluidOunces: number, densityKgPerM3: number): number {
  if (
    !Number.isFinite(fluidOunces) ||
    !Number.isFinite(densityKgPerM3) ||
    densityKgPerM3 <= 0
  ) {
    throw new Error('Invalid volume or density');
  }
  const volumeM3 = fluidOunces * US_FL_OZ_TO_M3;
  const massKg = volumeM3 * densityKgPerM3;
  return massKg / POUND_TO_KG;
}

/** Pounds → US fluid ounces at a density in kg/m³ (exact SI path). */
export function poundsToFluidOunces(pounds: number, densityKgPerM3: number): number {
  if (!Number.isFinite(pounds) || !Number.isFinite(densityKgPerM3) || densityKgPerM3 <= 0) {
    throw new Error('Density must be greater than zero.');
  }
  const massKg = pounds * POUND_TO_KG;
  const volumeM3 = massKg / densityKgPerM3;
  return volumeM3 / US_FL_OZ_TO_M3;
}

export function volumeToMass(volumeM3: number, densityKgPerM3: number): number {
  if (
    !Number.isFinite(volumeM3) ||
    !Number.isFinite(densityKgPerM3) ||
    densityKgPerM3 <= 0
  ) {
    throw new Error('Invalid volume or density');
  }
  return volumeM3 * densityKgPerM3;
}

export function massToVolume(massKg: number, densityKgPerM3: number): number {
  if (!Number.isFinite(massKg) || !Number.isFinite(densityKgPerM3) || densityKgPerM3 <= 0) {
    throw new Error('Invalid mass or density');
  }
  return massKg / densityKgPerM3;
}

export function resolveDensityKgPerM3(input: FlOzToLbInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerM3(input.densityValue, input.densityUnit);
}

export function calculateFlOzToLb(input: FlOzToLbInput): FlOzToLbResult {
  const densityKgPerM3 = resolveDensityKgPerM3(input)!;
  let volumeM3: number;
  let massKg: number;

  if (input.source === 'volume') {
    volumeM3 = toM3(input.volume!, input.volumeUnit);
    massKg = volumeToMass(volumeM3, densityKgPerM3);
  } else {
    massKg = toKg(input.mass!, input.massUnit);
    volumeM3 = massToVolume(massKg, densityKgPerM3);
  }

  const volume = fromM3(volumeM3, input.volumeUnit);
  const mass = fromKg(massKg, input.massUnit);

  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);

  const explanation =
    input.source === 'volume'
      ? `${formatMeasure(volumeM3)} m³ × ${formatMeasure(densityKgPerM3)} kg/m³ = ${formatMeasure(massKg)} kg`
      : `${formatMeasure(massKg)} kg ÷ ${formatMeasure(densityKgPerM3)} kg/m³ = ${formatMeasure(volumeM3)} m³`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom density',
    densityKgPerM3,
    densityApproximate: substance?.approximate ?? true,
    volumeM3,
    massKg,
    volume,
    volumeUnit: input.volumeUnit,
    mass,
    massUnit: input.massUnit,
    explanation,
  };
}

export function shareResultText(result: FlOzToLbResult): string {
  const volumeLabel =
    result.volumeUnit === 'usFlOz'
      ? 'US fl oz'
      : result.volumeUnit === 'impFlOz'
        ? 'UK fl oz'
        : result.volumeUnit;
  return [
    'Fluid Ounces to Pounds Conversion | Omega Calculators',
    '',
    `Ingredient: ${result.substanceName}`,
    `Density: ${formatMeasure(result.densityKgPerM3)} kg/m³${result.densityApproximate ? ' (approximate)' : ''}`,
    '',
    `Volume: ${formatMeasure(result.volume)} ${volumeLabel}`,
    `Mass: ${formatMeasure(result.mass)} ${result.massUnit}`,
    '',
    'Formula:',
    'Mass = Density × Volume',
    result.explanation,
  ].join('\n');
}
