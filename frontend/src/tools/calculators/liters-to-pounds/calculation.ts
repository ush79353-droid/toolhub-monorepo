import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  KG_PER_L_PER_DENSITY_UNIT,
  KG_PER_POUND,
  type DensityUnit,
  type LitersToPoundsInput,
  type LitersToPoundsResult,
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

export function densityToKgPerL(value: number, unit: DensityUnit): number {
  return value * KG_PER_L_PER_DENSITY_UNIT[unit];
}

export function kgPerLToDensity(kgPerL: number, unit: DensityUnit): number {
  return kgPerL / KG_PER_L_PER_DENSITY_UNIT[unit];
}

export function litersToPounds(liters: number, densityKgPerLiter: number): number {
  return (liters * densityKgPerLiter) / KG_PER_POUND;
}

export function poundsToLiters(pounds: number, densityKgPerLiter: number): number {
  return (pounds * KG_PER_POUND) / densityKgPerLiter;
}

export function resolveDensityKgPerL(input: LitersToPoundsInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerL(input.densityValue, input.densityUnit);
}

export function calculateLitersToPounds(input: LitersToPoundsInput): LitersToPoundsResult {
  const densityKgPerL = resolveDensityKgPerL(input)!;
  let liters: number;
  let pounds: number;

  if (input.source === 'liters') {
    liters = input.liters!;
    pounds = litersToPounds(liters, densityKgPerL);
  } else {
    pounds = input.pounds!;
    liters = poundsToLiters(pounds, densityKgPerL);
  }

  const kilograms = liters * densityKgPerL;
  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);

  const explanation =
    input.source === 'liters'
      ? `${formatMeasure(liters)} L × ${formatMeasure(densityKgPerL)} kg/L ÷ ${KG_PER_POUND} = ${formatMeasure(pounds)} lb`
      : `${formatMeasure(pounds)} lb × ${KG_PER_POUND} ÷ ${formatMeasure(densityKgPerL)} kg/L = ${formatMeasure(liters)} L`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom substance',
    densityKgPerL,
    densityApproximate: substance?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    liters,
    pounds,
    kilograms,
    explanation,
  };
}

export function shareResultText(result: LitersToPoundsResult): string {
  const unitLabel =
    (
      {
        kgPerM3: 'kg/m³',
        kgPerL: 'kg/L',
        gPerMl: 'g/mL',
        gPerCm3: 'g/cm³',
        lbPerL: 'lb/L',
        lbPerFt3: 'lb/ft³',
      } as const
    )[result.densityUnit] ?? result.densityUnit;

  return [
    'Liters to Pounds Calculator',
    '',
    `Substance: ${result.substanceName}`,
    `Density: ${formatMeasure(result.densityValue)} ${unitLabel}${
      result.densityApproximate ? ' (approximate)' : ''
    }`,
    '',
    `Volume: ${formatMeasure(result.liters)} L`,
    `Weight: ${formatMeasure(result.pounds)} lb`,
    '',
    'Omega Calculators',
  ].join('\n');
}
