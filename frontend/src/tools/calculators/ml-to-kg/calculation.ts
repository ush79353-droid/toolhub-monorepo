import {
  densityToKgPerM3,
  formatMeasure,
  kgPerM3ToDensity,
  kgToMl,
  mlToKg,
} from '../kg-to-ml/calculation';
import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  KG_PER_MASS_UNIT,
  MASS_UNIT_OPTIONS,
  ML_PER_VOLUME_UNIT,
  VOLUME_UNIT_OPTIONS,
  type MassUnit,
  type MlToKgInput,
  type MlToKgResult,
  type VolumeUnit,
} from './types';

export {
  densityToKgPerM3,
  formatMeasure,
  kgPerM3ToDensity,
  kgToMl,
  mlToKg,
};

export function volumeToMl(value: number, unit: VolumeUnit): number {
  return value * ML_PER_VOLUME_UNIT[unit];
}

export function mlToVolume(ml: number, unit: VolumeUnit): number {
  return ml / ML_PER_VOLUME_UNIT[unit];
}

export function massToKg(value: number, unit: MassUnit): number {
  return value * KG_PER_MASS_UNIT[unit];
}

export function kgToMass(kg: number, unit: MassUnit): number {
  return kg / KG_PER_MASS_UNIT[unit];
}

export function resolveDensityKgPerM3(input: MlToKgInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerM3(input.densityValue, input.densityUnit);
}

export function calculateMlToKg(input: MlToKgInput): MlToKgResult {
  const densityKgPerM3 = resolveDensityKgPerM3(input)!;
  let massKg: number;
  let volumeMl: number;

  if (input.source === 'volume') {
    volumeMl = volumeToMl(input.volumeValue!, input.volumeUnit);
    massKg = mlToKg(volumeMl, densityKgPerM3);
  } else {
    massKg = massToKg(input.massValue!, input.massUnit);
    volumeMl = kgToMl(massKg, densityKgPerM3);
  }

  const volumeValue = mlToVolume(volumeMl, input.volumeUnit);
  const massValue = kgToMass(massKg, input.massUnit);
  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);

  const explanation =
    input.source === 'volume'
      ? `(${formatMeasure(volumeMl)} mL × ${formatMeasure(densityKgPerM3)} kg/m³) ÷ 1,000,000 = ${formatMeasure(massKg)} kg`
      : `(${formatMeasure(massKg)} kg × 1,000,000) ÷ ${formatMeasure(densityKgPerM3)} kg/m³ = ${formatMeasure(volumeMl)} mL`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom substance',
    densityKgPerM3,
    densityApproximate: substance?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    volumeMl,
    volumeValue,
    volumeUnit: input.volumeUnit,
    massKg,
    massValue,
    massUnit: input.massUnit,
    explanation,
  };
}

export function shareResultText(result: MlToKgResult): string {
  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  const volumeLabel =
    VOLUME_UNIT_OPTIONS.find((o) => o.value === result.volumeUnit)?.label ?? result.volumeUnit;
  const massLabel =
    MASS_UNIT_OPTIONS.find((o) => o.value === result.massUnit)?.label ?? result.massUnit;

  return [
    'mL to kg Converter | Omega Calculators',
    '',
    `Substance: ${result.substanceName}`,
    `Density: ${formatMeasure(result.densityValue)} ${densityLabel}`,
    '',
    `Volume: ${formatMeasure(result.volumeValue)} ${volumeLabel}`,
    `Mass: ${formatMeasure(result.massValue)} ${massLabel}`,
    '',
    '/tools/ml-to-kg-converter',
  ].join('\n');
}
