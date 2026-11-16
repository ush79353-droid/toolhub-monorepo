import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  CC_PER_VOLUME_UNIT,
  G_PER_CM3_PER_DENSITY_UNIT,
  G_PER_MASS_UNIT,
  type CcToGramsInput,
  type CcToGramsResult,
  type DensityUnit,
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

export function densityToGPerCm3(value: number, unit: DensityUnit): number {
  return value * G_PER_CM3_PER_DENSITY_UNIT[unit];
}

export function gPerCm3ToDensity(gPerCm3: number, unit: DensityUnit): number {
  return gPerCm3 / G_PER_CM3_PER_DENSITY_UNIT[unit];
}

export function toCc(value: number, unit: VolumeUnit): number {
  return value * CC_PER_VOLUME_UNIT[unit];
}

export function fromCc(cc: number, unit: VolumeUnit): number {
  return cc / CC_PER_VOLUME_UNIT[unit];
}

export function toGrams(value: number, unit: MassUnit): number {
  return value * G_PER_MASS_UNIT[unit];
}

export function fromGrams(g: number, unit: MassUnit): number {
  return g / G_PER_MASS_UNIT[unit];
}

export function volumeToMass(volumeCc: number, densityGPerCm3: number): number {
  if (
    !Number.isFinite(volumeCc) ||
    !Number.isFinite(densityGPerCm3) ||
    densityGPerCm3 <= 0
  ) {
    throw new Error('Invalid volume or density');
  }
  return volumeCc * densityGPerCm3;
}

export function massToVolume(massG: number, densityGPerCm3: number): number {
  if (!Number.isFinite(massG) || !Number.isFinite(densityGPerCm3) || densityGPerCm3 <= 0) {
    throw new Error('Invalid mass or density');
  }
  return massG / densityGPerCm3;
}

export function resolveDensityGPerCm3(input: CcToGramsInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToGPerCm3(input.densityValue, input.densityUnit);
}

export function calculateCcToGrams(input: CcToGramsInput): CcToGramsResult {
  const densityGPerCm3 = resolveDensityGPerCm3(input)!;
  let volumeCc: number;
  let massG: number;

  if (input.source === 'volume') {
    volumeCc = input.volumeCc!;
    massG = volumeToMass(volumeCc, densityGPerCm3);
  } else {
    massG = input.massG!;
    volumeCc = massToVolume(massG, densityGPerCm3);
  }

  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);

  const explanation =
    input.source === 'volume'
      ? `${formatMeasure(volumeCc)} cc × ${formatMeasure(densityGPerCm3)} g/cm³ = ${formatMeasure(massG)} g`
      : `${formatMeasure(massG)} g ÷ ${formatMeasure(densityGPerCm3)} g/cm³ = ${formatMeasure(volumeCc)} cc`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom density',
    densityGPerCm3,
    densityApproximate: substance?.approximate ?? true,
    volumeCc,
    massG,
    explanation,
  };
}

export function shareResultText(result: CcToGramsResult): string {
  return [
    'CC to Grams Converter — Omega Calculators',
    '',
    `Ingredient: ${result.substanceName}`,
    `Density: ${formatMeasure(result.densityGPerCm3)} g/cm³${result.densityApproximate ? ' (approximate)' : ''}`,
    '',
    `Volume: ${formatMeasure(result.volumeCc)} cc`,
    `Mass: ${formatMeasure(result.massG)} g`,
    '',
    'Formula:',
    'Mass = Volume × Density',
    result.explanation,
  ].join('\n');
}
