import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  G_PER_ML_PER_DENSITY_UNIT,
  MILLIGRAMS_PER_GRAM,
  TABLESPOON_ML,
  TABLESPOON_STANDARD_LABEL,
  type DensityUnit,
  type MgToTablespoonInput,
  type MgToTablespoonResult,
  type TablespoonStandard,
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

function assertValid(massOrVolume: number, density: number, tablespoonMl: number): void {
  if (
    !Number.isFinite(massOrVolume) ||
    massOrVolume < 0 ||
    !Number.isFinite(density) ||
    density <= 0 ||
    !Number.isFinite(tablespoonMl) ||
    tablespoonMl <= 0
  ) {
    throw new Error('Invalid conversion input.');
  }
}

export function densityToGPerMl(value: number, unit: DensityUnit): number {
  return value * G_PER_ML_PER_DENSITY_UNIT[unit];
}

export function gPerMlToDensity(gPerMl: number, unit: DensityUnit): number {
  return gPerMl / G_PER_ML_PER_DENSITY_UNIT[unit];
}

export function milligramsToTablespoons(
  milligrams: number,
  densityGPerMl: number,
  tablespoonMl: number,
): number {
  assertValid(milligrams, densityGPerMl, tablespoonMl);
  const result = milligrams / (MILLIGRAMS_PER_GRAM * densityGPerMl * tablespoonMl);
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range.');
  }
  return result;
}

export function tablespoonsToMilligrams(
  tablespoons: number,
  densityGPerMl: number,
  tablespoonMl: number,
): number {
  assertValid(tablespoons, densityGPerMl, tablespoonMl);
  const result = tablespoons * tablespoonMl * densityGPerMl * MILLIGRAMS_PER_GRAM;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range.');
  }
  return result;
}

export function resolveDensityGPerMl(input: MgToTablespoonInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToGPerMl(input.densityValue, input.densityUnit);
}

export function tablespoonMlFor(standard: TablespoonStandard): number {
  return TABLESPOON_ML[standard];
}

export function calculateMgToTablespoon(input: MgToTablespoonInput): MgToTablespoonResult {
  const densityGPerMl = resolveDensityGPerMl(input)!;
  const tablespoonMl = tablespoonMlFor(input.tablespoonStandard);
  let milligrams: number;
  let tablespoons: number;

  if (input.source === 'milligrams') {
    milligrams = input.milligrams!;
    tablespoons = milligramsToTablespoons(milligrams, densityGPerMl, tablespoonMl);
  } else {
    tablespoons = input.tablespoons!;
    milligrams = tablespoonsToMilligrams(tablespoons, densityGPerMl, tablespoonMl);
  }

  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);
  const tbspLabel = TABLESPOON_STANDARD_LABEL[input.tablespoonStandard];

  const explanation =
    input.source === 'milligrams'
      ? `${formatMeasure(milligrams)} mg ÷ (1000 × ${formatMeasure(densityGPerMl)} g/mL × ${tablespoonMl} mL) = ${formatMeasure(tablespoons)} ${tbspLabel}`
      : `${formatMeasure(tablespoons)} ${tbspLabel} × ${tablespoonMl} mL × ${formatMeasure(densityGPerMl)} g/mL × 1000 = ${formatMeasure(milligrams)} mg`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom density',
    densityGPerMl,
    densityApproximate: substance?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    tablespoonStandard: input.tablespoonStandard,
    tablespoonMl,
    milligrams,
    tablespoons,
    explanation,
  };
}

export function shareResultText(result: MgToTablespoonResult): string {
  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  const tbspLabel = TABLESPOON_STANDARD_LABEL[result.tablespoonStandard];
  return [
    'mg to tablespoon Converter — Omega Calculators',
    '',
    `Ingredient: ${result.substanceName}`,
    `Density: ${formatMeasure(result.densityValue)} ${densityLabel}${result.densityApproximate ? ' (approximate)' : ''}`,
    `Mass: ${formatMeasure(result.milligrams)} mg`,
    `Volume: ${formatMeasure(result.tablespoons)} ${tbspLabel}`,
    '',
    'Formula:',
    result.explanation,
    '',
    '/tools/mg-to-tablespoon-converter',
  ].join('\n');
}
