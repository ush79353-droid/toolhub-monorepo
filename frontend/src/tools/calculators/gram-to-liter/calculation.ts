import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  G_PER_MASS_UNIT,
  KG_PER_M3_PER_DENSITY_UNIT,
  L_PER_VOLUME_UNIT,
  MASS_UNIT_LABEL,
  VOLUME_UNIT_LABEL,
  type DensityUnit,
  type GramToLiterInput,
  type GramToLiterResult,
  type MassUnit,
  type VolumeUnit,
} from './types';

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

export function gramsToLiters(grams: number, densityKgPerM3: number): number {
  if (
    !Number.isFinite(grams) ||
    grams < 0 ||
    !Number.isFinite(densityKgPerM3) ||
    densityKgPerM3 <= 0
  ) {
    throw new RangeError('Mass must be nonnegative and density must be positive.');
  }
  return grams / densityKgPerM3;
}

export function litersToGrams(liters: number, densityKgPerM3: number): number {
  if (
    !Number.isFinite(liters) ||
    liters < 0 ||
    !Number.isFinite(densityKgPerM3) ||
    densityKgPerM3 <= 0
  ) {
    throw new RangeError('Volume must be nonnegative and density must be positive.');
  }
  return liters * densityKgPerM3;
}

export function toGrams(value: number, unit: MassUnit): number {
  return value * G_PER_MASS_UNIT[unit];
}

export function fromGrams(grams: number, unit: MassUnit): number {
  return grams / G_PER_MASS_UNIT[unit];
}

export function toLiters(value: number, unit: VolumeUnit): number {
  return value * L_PER_VOLUME_UNIT[unit];
}

export function fromLiters(liters: number, unit: VolumeUnit): number {
  return liters / L_PER_VOLUME_UNIT[unit];
}

export function resolveDensityKgPerM3(input: GramToLiterInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerM3(input.densityValue, input.densityUnit);
}

export function calculateGramToLiter(input: GramToLiterInput): GramToLiterResult {
  const densityKgPerM3 = resolveDensityKgPerM3(input)!;
  let massG: number;
  let volumeL: number;

  if (input.source === 'mass') {
    massG = toGrams(input.mass!, input.massUnit);
    volumeL = gramsToLiters(massG, densityKgPerM3);
  } else {
    volumeL = toLiters(input.volume!, input.volumeUnit);
    massG = litersToGrams(volumeL, densityKgPerM3);
  }

  const mass = fromGrams(massG, input.massUnit);
  const volume = fromLiters(volumeL, input.volumeUnit);
  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);

  const explanation =
    input.source === 'mass'
      ? `${formatMeasure(massG)} g ÷ ${formatMeasure(densityKgPerM3)} kg/m³ = ${formatMeasure(volumeL)} L`
      : `${formatMeasure(volumeL)} L × ${formatMeasure(densityKgPerM3)} kg/m³ = ${formatMeasure(massG)} g`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom density',
    densityKgPerM3,
    densityApproximate: substance?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    mass,
    massUnit: input.massUnit,
    massG,
    volume,
    volumeUnit: input.volumeUnit,
    volumeL,
    explanation,
  };
}

export function shareResultText(result: GramToLiterResult): string {
  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  return [
    'Gram to Liter Conversion | Omega Calculators',
    '',
    `Substance: ${result.substanceName}`,
    `Density: ${formatMeasure(result.densityValue)} ${densityLabel}${result.densityApproximate ? ' (approximate)' : ''}`,
    '',
    `${formatMeasure(result.mass)} ${MASS_UNIT_LABEL[result.massUnit]} = ${formatMeasure(result.volume)} ${VOLUME_UNIT_LABEL[result.volumeUnit]}`,
    '',
    'Calculated with Omega Calculators',
    result.explanation,
  ].join('\n');
}
