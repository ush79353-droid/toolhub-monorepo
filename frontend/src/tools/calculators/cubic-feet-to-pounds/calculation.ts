import { CUSTOM_MATERIAL_ID, findMaterial } from './materials';
import {
  DENSITY_UNIT_OPTIONS,
  KG_PER_M3_PER_DENSITY_UNIT,
  type CubicFeetToPoundsInput,
  type CubicFeetToPoundsResult,
  type DensityUnit,
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

export function convertDensity(value: number, from: DensityUnit, to: DensityUnit): number {
  if (from === to) return value;
  return kgPerM3ToDensity(densityToKgPerM3(value, from), to);
}

export function densityToLbPerFt3(value: number, unit: DensityUnit): number {
  return convertDensity(value, unit, 'lbPerFt3');
}

export function lbPerFt3ToDensity(lbPerFt3: number, unit: DensityUnit): number {
  return convertDensity(lbPerFt3, 'lbPerFt3', unit);
}

export function cubicFeetToPounds(cubicFeet: number, densityLbPerFt3: number): number {
  if (!Number.isFinite(cubicFeet) || cubicFeet < 0) {
    throw new Error('Invalid volume value');
  }
  if (!Number.isFinite(densityLbPerFt3) || densityLbPerFt3 <= 0) {
    throw new Error('Density must be greater than zero');
  }
  const result = cubicFeet * densityLbPerFt3;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function poundsToCubicFeet(pounds: number, densityLbPerFt3: number): number {
  if (!Number.isFinite(pounds) || pounds < 0) {
    throw new Error('Invalid mass value');
  }
  if (!Number.isFinite(densityLbPerFt3) || densityLbPerFt3 <= 0) {
    throw new Error('Density must be greater than zero');
  }
  const result = pounds / densityLbPerFt3;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function resolveDensityLbPerFt3(input: CubicFeetToPoundsInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToLbPerFt3(input.densityValue, input.densityUnit);
}

export function calculateCubicFeetToPounds(
  input: CubicFeetToPoundsInput,
): CubicFeetToPoundsResult {
  const densityLbPerFt3 = resolveDensityLbPerFt3(input)!;
  let cubicFeet: number;
  let pounds: number;

  if (input.source === 'cubicFeet') {
    cubicFeet = input.cubicFeet!;
    pounds = cubicFeetToPounds(cubicFeet, densityLbPerFt3);
  } else {
    pounds = input.pounds!;
    cubicFeet = poundsToCubicFeet(pounds, densityLbPerFt3);
  }

  const material =
    input.materialId === CUSTOM_MATERIAL_ID ? undefined : findMaterial(input.materialId);

  const explanation =
    input.source === 'cubicFeet'
      ? `${formatMeasure(cubicFeet)} ft³ × ${formatMeasure(densityLbPerFt3)} lb/ft³ = ${formatMeasure(pounds)} lb`
      : `${formatMeasure(pounds)} lb ÷ ${formatMeasure(densityLbPerFt3)} lb/ft³ = ${formatMeasure(cubicFeet)} ft³`;

  return {
    source: input.source,
    materialId: input.materialId,
    materialName: material?.name ?? 'Custom material',
    densityLbPerFt3,
    densityApproximate: material?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    cubicFeet,
    pounds,
    explanation,
  };
}

export function shareResultText(result: CubicFeetToPoundsResult): string {
  const unitLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;

  return [
    'Cubic Feet to Pounds Calculator',
    'Omega Calculators',
    '',
    `Material: ${result.materialName}`,
    `Density: ${formatMeasure(result.densityValue)} ${unitLabel}${
      result.densityApproximate ? ' (approximate)' : ''
    }`,
    `Volume: ${formatMeasure(result.cubicFeet)} ft³`,
    `Mass: ${formatMeasure(result.pounds)} lb`,
  ].join('\n');
}
