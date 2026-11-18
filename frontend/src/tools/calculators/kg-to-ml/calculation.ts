import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  KG_PER_M3_PER_DENSITY_UNIT,
  type DensityUnit,
  type KgToMlInput,
  type KgToMlResult,
} from './types';

export type { KgToMlResult };

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

export function densityToKgPerM3(value: number, unit: DensityUnit): number {
  return value * KG_PER_M3_PER_DENSITY_UNIT[unit];
}

export function kgPerM3ToDensity(kgPerM3: number, unit: DensityUnit): number {
  return kgPerM3 / KG_PER_M3_PER_DENSITY_UNIT[unit];
}

export function resolveDensityKgPerM3(input: KgToMlInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerM3(input.densityValue, input.densityUnit);
}

export function kgToMl(massKg: number, densityKgPerM3: number): number {
  if (
    !Number.isFinite(massKg) ||
    !Number.isFinite(densityKgPerM3) ||
    massKg < 0 ||
    densityKgPerM3 <= 0
  ) {
    throw new Error('Invalid mass or density');
  }
  return (massKg / densityKgPerM3) * 1_000_000;
}

export function mlToKg(volumeMl: number, densityKgPerM3: number): number {
  if (
    !Number.isFinite(volumeMl) ||
    !Number.isFinite(densityKgPerM3) ||
    volumeMl < 0 ||
    densityKgPerM3 <= 0
  ) {
    throw new Error('Invalid volume or density');
  }
  return (volumeMl * densityKgPerM3) / 1_000_000;
}

export function calculateKgToMl(input: KgToMlInput): KgToMlResult {
  const densityKgPerM3 = resolveDensityKgPerM3(input)!;
  let massKg: number;
  let volumeMl: number;

  if (input.source === 'mass') {
    massKg = input.massKg!;
    volumeMl = kgToMl(massKg, densityKgPerM3);
  } else {
    volumeMl = input.volumeMl!;
    massKg = mlToKg(volumeMl, densityKgPerM3);
  }

  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);

  const explanation =
    input.source === 'mass'
      ? `(${formatMeasure(massKg)} kg ÷ ${formatMeasure(densityKgPerM3)} kg/m³) × 1,000,000 = ${formatMeasure(volumeMl)} mL`
      : `(${formatMeasure(volumeMl)} mL × ${formatMeasure(densityKgPerM3)} kg/m³) ÷ 1,000,000 = ${formatMeasure(massKg)} kg`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom density',
    densityKgPerM3,
    densityApproximate: substance?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    massKg,
    volumeMl,
    explanation,
  };
}

export function shareResultText(result: KgToMlResult): string {
  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  return [
    'kg to mL Converter',
    'Omega Calculators',
    '',
    `Substance: ${result.substanceName}`,
    `Density: ${formatMeasure(result.densityValue)} ${densityLabel}`,
    '',
    `Mass: ${formatMeasure(result.massKg)} kg`,
    `Volume: ${formatMeasure(result.volumeMl)} mL`,
    '',
    'Formula:',
    'mL = (kg ÷ density in kg/m³) × 1,000,000',
    result.explanation,
    '',
    'Calculator:',
    '/tools/kg-to-ml-converter',
  ].join('\n');
}
