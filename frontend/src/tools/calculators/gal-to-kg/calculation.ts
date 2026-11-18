import { CUSTOM_MATERIAL_ID, findMaterial } from '../cubic-meter-to-ton/materials';
import {
  DENSITY_UNIT_OPTIONS,
  GALLON_UNIT_LABEL,
  KG_PER_L_PER_DENSITY_UNIT,
  KG_PER_OTHER_MASS_UNIT,
  LITERS_PER_GALLON,
  OTHER_MASS_UNIT_LABEL,
  type DensityUnit,
  type GallonUnit,
  type GalToKgInput,
  type GalToKgResult,
  type OtherMassUnit,
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

export function densityToKgPerL(value: number, unit: DensityUnit): number {
  return value * KG_PER_L_PER_DENSITY_UNIT[unit];
}

export function kgPerLToDensity(kgPerL: number, unit: DensityUnit): number {
  return kgPerL / KG_PER_L_PER_DENSITY_UNIT[unit];
}

export function gallonsToKilograms(
  gallons: number,
  densityKgPerLiter: number,
  unit: GallonUnit = 'usGal',
): number {
  if (
    !Number.isFinite(gallons) ||
    gallons < 0 ||
    !Number.isFinite(densityKgPerLiter) ||
    densityKgPerLiter <= 0
  ) {
    throw new RangeError('Invalid gallons or density');
  }
  return gallons * LITERS_PER_GALLON[unit] * densityKgPerLiter;
}

export function kilogramsToGallons(
  kilograms: number,
  densityKgPerLiter: number,
  unit: GallonUnit = 'usGal',
): number {
  if (
    !Number.isFinite(kilograms) ||
    kilograms < 0 ||
    !Number.isFinite(densityKgPerLiter) ||
    densityKgPerLiter <= 0
  ) {
    throw new RangeError('Invalid mass or density');
  }
  return kilograms / (LITERS_PER_GALLON[unit] * densityKgPerLiter);
}

export function toKg(value: number, unit: OtherMassUnit): number {
  return value * KG_PER_OTHER_MASS_UNIT[unit];
}

export function fromKg(kg: number, unit: OtherMassUnit): number {
  return kg / KG_PER_OTHER_MASS_UNIT[unit];
}

export function resolveDensityKgPerL(input: GalToKgInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerL(input.densityValue, input.densityUnit);
}

export function calculateGalToKg(input: GalToKgInput): GalToKgResult {
  const densityKgPerL = resolveDensityKgPerL(input)!;
  let kg: number;
  let gallons: number;

  if (input.source === 'gallons') {
    gallons = input.gallons!;
    kg = gallonsToKilograms(gallons, densityKgPerL, input.gallonUnit);
  } else if (input.source === 'kg') {
    kg = input.kg!;
    gallons = kilogramsToGallons(kg, densityKgPerL, input.gallonUnit);
  } else {
    kg = toKg(input.otherMass!, input.otherMassUnit);
    gallons = kilogramsToGallons(kg, densityKgPerL, input.gallonUnit);
  }

  const otherMass = fromKg(kg, input.otherMassUnit);
  const material =
    input.materialId === CUSTOM_MATERIAL_ID ? undefined : findMaterial(input.materialId);

  const explanation =
    input.source === 'gallons'
      ? `${formatMeasure(gallons)} ${GALLON_UNIT_LABEL[input.gallonUnit]} × ${formatMeasure(LITERS_PER_GALLON[input.gallonUnit])} L/gal × ${formatMeasure(densityKgPerL)} kg/L = ${formatMeasure(kg)} kg`
      : `${formatMeasure(kg)} kg ÷ (${formatMeasure(LITERS_PER_GALLON[input.gallonUnit])} × ${formatMeasure(densityKgPerL)}) = ${formatMeasure(gallons)} ${GALLON_UNIT_LABEL[input.gallonUnit]}`;

  return {
    source: input.source,
    materialId: input.materialId,
    materialName: material?.name ?? 'Custom density',
    densityKgPerL,
    densityApproximate: material?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    gallons,
    gallonUnit: input.gallonUnit,
    kg,
    otherMass,
    otherMassUnit: input.otherMassUnit,
    explanation,
  };
}

export function shareResultText(result: GalToKgResult): string {
  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  return [
    'Gal to kg Converter — Omega Calculators',
    '',
    `Material: ${result.materialName}`,
    `Density: ${formatMeasure(result.densityValue)} ${densityLabel}${result.densityApproximate ? ' (approximate)' : ''}`,
    '',
    `${formatMeasure(result.gallons)} ${GALLON_UNIT_LABEL[result.gallonUnit]} = ${formatMeasure(result.kg)} kg`,
    `Also: ${formatMeasure(result.otherMass)} ${OTHER_MASS_UNIT_LABEL[result.otherMassUnit]}`,
    '',
    'Calculated with Omega Calculators',
    result.explanation,
  ].join('\n');
}
