import {
  CUSTOM_CATEGORY_ID,
  CUSTOM_TYPE_ID,
  findType,
} from './ingredients';
import {
  DENSITY_UNIT_OPTIONS,
  G_PER_ML_PER_DENSITY_UNIT,
  METRIC_TEASPOON_ML,
  ML_PER_VOLUME_UNIT,
  US_TEASPOON_ML,
  VOLUME_UNIT_LABEL,
  type DensityUnit,
  type TspToGramsInput,
  type TspToGramsResult,
  type VolumeUnit,
} from './types';

export { METRIC_TEASPOON_ML, US_TEASPOON_ML };

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

/** Kitchen-friendly display (≈2–3 decimals for typical cooking masses). */
export function formatKitchen(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-4 || abs >= 1e6)) return formatMeasure(value);
  if (abs >= 100) return String(Number(value.toFixed(1)));
  if (abs >= 1) return String(Number(value.toFixed(2)));
  return String(Number(value.toFixed(3)));
}

export function kgM3ToGmL(densityKgM3: number): number {
  return densityKgM3 / 1000;
}

export function densityToGPerMl(value: number, unit: DensityUnit): number {
  return value * G_PER_ML_PER_DENSITY_UNIT[unit];
}

export function gPerMlToDensity(gPerMl: number, unit: DensityUnit): number {
  return gPerMl / G_PER_ML_PER_DENSITY_UNIT[unit];
}

export function teaspoonsToGrams(
  teaspoons: number,
  densityGmL: number,
  teaspoonVolumeMl: number = US_TEASPOON_ML,
): number {
  if (
    !Number.isFinite(teaspoons) ||
    teaspoons < 0 ||
    !Number.isFinite(densityGmL) ||
    densityGmL <= 0 ||
    !Number.isFinite(teaspoonVolumeMl) ||
    teaspoonVolumeMl <= 0
  ) {
    throw new RangeError('Volume must be nonnegative; density and teaspoon volume must be positive.');
  }
  return teaspoons * teaspoonVolumeMl * densityGmL;
}

export function gramsToTeaspoons(
  grams: number,
  densityGmL: number,
  teaspoonVolumeMl: number = US_TEASPOON_ML,
): number {
  if (
    !Number.isFinite(grams) ||
    grams < 0 ||
    !Number.isFinite(densityGmL) ||
    densityGmL <= 0 ||
    !Number.isFinite(teaspoonVolumeMl) ||
    teaspoonVolumeMl <= 0
  ) {
    throw new RangeError('Mass must be nonnegative; density and teaspoon volume must be positive.');
  }
  return grams / (densityGmL * teaspoonVolumeMl);
}

export function toMl(value: number, unit: VolumeUnit): number {
  return value * ML_PER_VOLUME_UNIT[unit];
}

export function fromMl(ml: number, unit: VolumeUnit): number {
  return ml / ML_PER_VOLUME_UNIT[unit];
}

export function resolveDensityGPerMl(input: TspToGramsInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToGPerMl(input.densityValue, input.densityUnit);
}

export function calculateTspToGrams(input: TspToGramsInput): TspToGramsResult {
  const densityGPerMl = resolveDensityGPerMl(input)!;
  const teaspoonVolumeMl = ML_PER_VOLUME_UNIT[input.volumeUnit];

  let grams: number;
  let teaspoons: number;
  let volumeMl: number;

  if (input.source === 'volume') {
    teaspoons = input.teaspoons!;
    volumeMl = toMl(teaspoons, input.volumeUnit);
    grams = teaspoonsToGrams(teaspoons, densityGPerMl, teaspoonVolumeMl);
  } else {
    grams = input.grams!;
    teaspoons = gramsToTeaspoons(grams, densityGPerMl, teaspoonVolumeMl);
    volumeMl = toMl(teaspoons, input.volumeUnit);
  }

  const type =
    input.categoryId === CUSTOM_CATEGORY_ID || input.typeId === CUSTOM_TYPE_ID
      ? undefined
      : findType(input.categoryId, input.typeId);

  const explanation =
    input.source === 'volume'
      ? `${formatMeasure(teaspoons)} ${VOLUME_UNIT_LABEL[input.volumeUnit]} × ${formatMeasure(teaspoonVolumeMl)} mL × ${formatMeasure(densityGPerMl)} g/mL = ${formatMeasure(grams)} g`
      : `${formatMeasure(grams)} g ÷ (${formatMeasure(densityGPerMl)} g/mL × ${formatMeasure(teaspoonVolumeMl)} mL) = ${formatMeasure(teaspoons)} ${VOLUME_UNIT_LABEL[input.volumeUnit]}`;

  return {
    source: input.source,
    categoryId: input.categoryId,
    typeId: input.typeId,
    ingredientName: type?.name ?? 'Custom density',
    densityGPerMl,
    densityApproximate: true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    teaspoons,
    volumeUnit: input.volumeUnit,
    volumeMl,
    grams,
    explanation,
  };
}

export function shareResultText(result: TspToGramsResult): string {
  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  return [
    'tsp to grams Converter',
    'Omega Calculators',
    '',
    `Ingredient: ${result.ingredientName}`,
    `Density: ${formatMeasure(result.densityValue)} ${densityLabel}`,
    '',
    `${formatKitchen(result.teaspoons)} ${VOLUME_UNIT_LABEL[result.volumeUnit]} ≈ ${formatKitchen(result.grams)} g`,
    '',
    '/tools/tsp-to-grams-converter',
  ].join('\n');
}
