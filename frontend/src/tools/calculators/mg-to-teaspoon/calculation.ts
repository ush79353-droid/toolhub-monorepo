import {
  densityToGPerMl,
  formatMeasure,
  gPerMlToDensity,
} from '../mg-to-tablespoon/calculation';
import { CUSTOM_SUBSTANCE_ID, findSubstance } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  MILLIGRAMS_PER_GRAM,
  TEASPOON_ML,
  TEASPOON_STANDARD_LABEL,
  type MgToTeaspoonInput,
  type MgToTeaspoonResult,
  type TeaspoonStandard,
} from './types';

export { densityToGPerMl, formatMeasure, gPerMlToDensity };

function assertValid(massOrVolume: number, density: number, teaspoonMl: number): void {
  if (
    !Number.isFinite(massOrVolume) ||
    massOrVolume < 0 ||
    !Number.isFinite(density) ||
    density <= 0 ||
    !Number.isFinite(teaspoonMl) ||
    teaspoonMl <= 0
  ) {
    throw new Error('Invalid conversion input.');
  }
}

export function milligramsToTeaspoons(
  milligrams: number,
  densityGPerMl: number,
  teaspoonMl: number,
): number {
  assertValid(milligrams, densityGPerMl, teaspoonMl);
  const result = milligrams / (MILLIGRAMS_PER_GRAM * densityGPerMl * teaspoonMl);
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range.');
  }
  return result;
}

export function teaspoonsToMilligrams(
  teaspoons: number,
  densityGPerMl: number,
  teaspoonMl: number,
): number {
  assertValid(teaspoons, densityGPerMl, teaspoonMl);
  const result = teaspoons * teaspoonMl * densityGPerMl * MILLIGRAMS_PER_GRAM;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range.');
  }
  return result;
}

export function resolveDensityGPerMl(input: MgToTeaspoonInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToGPerMl(input.densityValue, input.densityUnit);
}

export function teaspoonMlFor(standard: TeaspoonStandard): number {
  return TEASPOON_ML[standard];
}

export function calculateMgToTeaspoon(input: MgToTeaspoonInput): MgToTeaspoonResult {
  const densityGPerMl = resolveDensityGPerMl(input)!;
  const teaspoonMl = teaspoonMlFor(input.teaspoonStandard);
  let milligrams: number;
  let teaspoons: number;

  if (input.source === 'milligrams') {
    milligrams = input.milligrams!;
    teaspoons = milligramsToTeaspoons(milligrams, densityGPerMl, teaspoonMl);
  } else {
    teaspoons = input.teaspoons!;
    milligrams = teaspoonsToMilligrams(teaspoons, densityGPerMl, teaspoonMl);
  }

  const substance =
    input.substanceId === CUSTOM_SUBSTANCE_ID ? undefined : findSubstance(input.substanceId);
  const tspLabel = TEASPOON_STANDARD_LABEL[input.teaspoonStandard];

  const explanation =
    input.source === 'milligrams'
      ? `${formatMeasure(milligrams)} mg ÷ (1000 × ${formatMeasure(densityGPerMl)} g/mL × ${teaspoonMl} mL) = ${formatMeasure(teaspoons)} ${tspLabel}`
      : `${formatMeasure(teaspoons)} ${tspLabel} × ${teaspoonMl} mL × ${formatMeasure(densityGPerMl)} g/mL × 1000 = ${formatMeasure(milligrams)} mg`;

  return {
    source: input.source,
    substanceId: input.substanceId,
    substanceName: substance?.name ?? 'Custom density',
    densityGPerMl,
    densityApproximate: substance?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    teaspoonStandard: input.teaspoonStandard,
    teaspoonMl,
    milligrams,
    teaspoons,
    explanation,
  };
}

export function shareResultText(result: MgToTeaspoonResult): string {
  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  const tspLabel = TEASPOON_STANDARD_LABEL[result.teaspoonStandard];
  return [
    'mg to Teaspoon Converter — Omega Calculators',
    '',
    `Ingredient: ${result.substanceName}`,
    `Density: ${formatMeasure(result.densityValue)} ${densityLabel}${result.densityApproximate ? ' (approximate)' : ''}`,
    `Mass: ${formatMeasure(result.milligrams)} mg`,
    `Volume: ${formatMeasure(result.teaspoons)} ${tspLabel}`,
    '',
    'Formula:',
    result.explanation,
    '',
    '/tools/mg-to-teaspoon-converter',
  ].join('\n');
}
