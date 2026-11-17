import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  G_PER_MASS_UNIT,
  G_PER_ML_PER_DENSITY_UNIT,
  MASS_UNIT_LABEL,
  ML_PER_VOLUME_UNIT,
  UK_FL_OZ_IN_ML,
  US_FL_OZ_IN_ML,
  VOLUME_UNIT_LABEL,
  type DensityUnit,
  type FluidOunceSystem,
  type GramsToFlOzInput,
  type GramsToFlOzResult,
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

function validateInputs(value: number, density: number): void {
  if (!Number.isFinite(value) || value < 0 || !Number.isFinite(density) || density <= 0) {
    throw new RangeError('Enter a nonnegative quantity and a positive density.');
  }
}

export function densityToGPerMl(value: number, unit: DensityUnit): number {
  return value * G_PER_ML_PER_DENSITY_UNIT[unit];
}

export function gPerMlToDensity(gPerMl: number, unit: DensityUnit): number {
  return gPerMl / G_PER_ML_PER_DENSITY_UNIT[unit];
}

export function gramsToFluidOunces(
  grams: number,
  densityGramsPerMl: number,
  system: FluidOunceSystem = 'US',
): number {
  validateInputs(grams, densityGramsPerMl);
  const volumeMl = grams / densityGramsPerMl;
  const factor = system === 'US' ? US_FL_OZ_IN_ML : UK_FL_OZ_IN_ML;
  return volumeMl / factor;
}

export function fluidOuncesToGrams(
  fluidOunces: number,
  densityGramsPerMl: number,
  system: FluidOunceSystem = 'US',
): number {
  validateInputs(fluidOunces, densityGramsPerMl);
  const factor = system === 'US' ? US_FL_OZ_IN_ML : UK_FL_OZ_IN_ML;
  return fluidOunces * factor * densityGramsPerMl;
}

export function toGrams(value: number, unit: MassUnit): number {
  return value * G_PER_MASS_UNIT[unit];
}

export function fromGrams(grams: number, unit: MassUnit): number {
  return grams / G_PER_MASS_UNIT[unit];
}

export function toMl(value: number, unit: VolumeUnit): number {
  return value * ML_PER_VOLUME_UNIT[unit];
}

export function fromMl(ml: number, unit: VolumeUnit): number {
  return ml / ML_PER_VOLUME_UNIT[unit];
}

export function resolveDensityGPerMl(input: GramsToFlOzInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToGPerMl(input.densityValue, input.densityUnit);
}

export function calculateGramsToFlOz(input: GramsToFlOzInput): GramsToFlOzResult {
  const densityGPerMl = resolveDensityGPerMl(input)!;
  let massG: number;
  let volumeMl: number;

  if (input.source === 'mass') {
    massG = toGrams(input.mass!, input.massUnit);
    volumeMl = massG / densityGPerMl;
  } else {
    volumeMl = toMl(input.volume!, input.volumeUnit);
    massG = volumeMl * densityGPerMl;
  }

  const mass = fromGrams(massG, input.massUnit);
  const volume = fromMl(volumeMl, input.volumeUnit);
  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);

  const explanation =
    input.source === 'mass'
      ? `${formatMeasure(massG)} g ÷ ${formatMeasure(densityGPerMl)} g/mL = ${formatMeasure(volumeMl)} mL → ${formatMeasure(volume)} ${VOLUME_UNIT_LABEL[input.volumeUnit]}`
      : `${formatMeasure(volume)} ${VOLUME_UNIT_LABEL[input.volumeUnit]} = ${formatMeasure(volumeMl)} mL × ${formatMeasure(densityGPerMl)} g/mL = ${formatMeasure(massG)} g`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom density',
    densityGPerMl,
    densityApproximate: substance?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    mass,
    massUnit: input.massUnit,
    massG,
    volume,
    volumeUnit: input.volumeUnit,
    volumeMl,
    explanation,
  };
}

export function shareResultText(result: GramsToFlOzResult): string {
  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  return [
    'Grams to fl oz Converter — Omega Calculators',
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
