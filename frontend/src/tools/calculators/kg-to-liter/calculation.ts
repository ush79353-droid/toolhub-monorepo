import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  KG_PER_L_PER_DENSITY_UNIT,
  type DensityUnit,
  type KgToLiterInput,
  type KgToLiterResult,
} from './types';

export type { KgToLiterResult };

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

export function resolveDensityKgPerL(input: KgToLiterInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerL(input.densityValue, input.densityUnit);
}

export function kgToLiters(massKg: number, densityKgPerLiter: number): number {
  if (
    !Number.isFinite(massKg) ||
    !Number.isFinite(densityKgPerLiter) ||
    massKg < 0 ||
    densityKgPerLiter <= 0
  ) {
    throw new Error('Invalid mass or density');
  }
  return massKg / densityKgPerLiter;
}

export function litersToKg(volumeLiters: number, densityKgPerLiter: number): number {
  if (
    !Number.isFinite(volumeLiters) ||
    !Number.isFinite(densityKgPerLiter) ||
    volumeLiters < 0 ||
    densityKgPerLiter <= 0
  ) {
    throw new Error('Invalid volume or density');
  }
  return volumeLiters * densityKgPerLiter;
}

export function calculateKgToLiter(input: KgToLiterInput): KgToLiterResult {
  const densityKgPerL = resolveDensityKgPerL(input)!;
  let massKg: number;
  let volumeL: number;

  if (input.source === 'mass') {
    massKg = input.massKg!;
    volumeL = kgToLiters(massKg, densityKgPerL);
  } else {
    volumeL = input.volumeL!;
    massKg = litersToKg(volumeL, densityKgPerL);
  }

  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);

  const explanation =
    input.source === 'mass'
      ? `${formatMeasure(massKg)} kg ÷ ${formatMeasure(densityKgPerL)} kg/L = ${formatMeasure(volumeL)} L`
      : `${formatMeasure(volumeL)} L × ${formatMeasure(densityKgPerL)} kg/L = ${formatMeasure(massKg)} kg`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom density',
    densityKgPerL,
    densityApproximate: substance?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    massKg,
    volumeL,
    explanation,
  };
}

export function shareResultText(result: KgToLiterResult): string {
  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  return [
    'kg to Liter Converter',
    'Omega Calculators',
    '',
    `Substance: ${result.substanceName}`,
    `Density: ${formatMeasure(result.densityValue)} ${densityLabel} (≈ ${formatMeasure(result.densityKgPerL)} kg/L)`,
    '',
    `Weight: ${formatMeasure(result.massKg)} kg`,
    `Volume: ${formatMeasure(result.volumeL)} L`,
    '',
    'Formula:',
    'Liters = kg ÷ Density (kg/L)',
    result.explanation,
    '',
    'Calculator:',
    '/tools/kg-to-liter-converter',
  ].join('\n');
}
