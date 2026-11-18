import {
  calculateMlToKg,
  densityToKgPerM3,
  formatMeasure,
  kgPerM3ToDensity,
  kgToMass,
  massToKg,
  mlToKg,
  mlToVolume,
  volumeToMl,
} from '../ml-to-kg/calculation';
import type { MlToKgInput, MlToKgResult } from '../ml-to-kg/types';
import { findSubstance } from './substances';
import { KG_PER_POUND } from './types';

export {
  densityToKgPerM3,
  formatMeasure,
  kgPerM3ToDensity,
  kgToMass,
  massToKg,
  mlToVolume,
  volumeToMl,
};

export type MlToLbsInput = MlToKgInput;
export type MlToLbsResult = MlToKgResult;

/** Mass in pounds from volume in mL and density in kg/m³. */
export function mlToLbs(volumeMl: number, densityKgPerM3: number): number {
  return mlToKg(volumeMl, densityKgPerM3) / KG_PER_POUND;
}

/** Volume in mL from mass in pounds and density in kg/m³. */
export function lbsToMl(massLbs: number, densityKgPerM3: number): number {
  if (!(densityKgPerM3 > 0) || !Number.isFinite(densityKgPerM3)) {
    throw new Error('Density must be greater than zero.');
  }
  return (massLbs * KG_PER_POUND * 1_000_000) / densityKgPerM3;
}

export function calculateMlToLbs(input: MlToLbsInput): MlToLbsResult {
  return calculateMlToKg(input);
}

export function shareResultText(
  result: MlToLbsResult,
  path = '/tools/ml-to-lbs-conversion',
): string {
  const substance = findSubstance(result.substanceId);
  const name = substance?.name ?? 'Custom substance';
  return [
    'mL to lbs Conversion — Omega Calculators',
    '',
    `Ingredient: ${name}`,
    `Density: ${formatMeasure(result.densityValue)} ${result.densityUnitLabel}`,
    '',
    `Volume: ${formatMeasure(result.volumeValue)} ${result.volumeUnitLabel}`,
    `Mass: ${formatMeasure(result.massValue)} ${result.massUnitLabel}`,
    '',
    path,
  ].join('\n');
}
