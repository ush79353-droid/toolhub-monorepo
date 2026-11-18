import {
  convertVolume as convertVolumeLiters,
  formatVolume,
} from '../volume-conversion/calculation';
import {
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from '../volume-conversion/types';
import {
  SOURCE_TO_VOLUME_ID,
  VOLUME_UNITS_ML,
  type PintGallonUnit,
  type PintsToGallonsInput,
  type PintsToGallonsResult,
} from './types';

export { formatVolume };
export { LITERS_PER_IMPERIAL_GALLON, LITERS_PER_US_LIQUID_GALLON, VOLUME_UNITS_ML };

/** Exact liters for the four primary units (via shared volume registry). */
export const LITERS_PER_UNIT: Record<PintGallonUnit, number> = {
  usPt: LITERS_PER_US_LIQUID_GALLON / 8,
  ukPt: LITERS_PER_IMPERIAL_GALLON / 8,
  usGal: LITERS_PER_US_LIQUID_GALLON,
  ukGal: LITERS_PER_IMPERIAL_GALLON,
};

export function convertPintGallon(
  value: number,
  from: PintGallonUnit,
  to: PintGallonUnit,
): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Volume must be finite and non-negative.');
  }
  if (from === to) return value;
  return convertVolumeLiters(value, SOURCE_TO_VOLUME_ID[from], SOURCE_TO_VOLUME_ID[to]);
}

export function calculatePintsToGallons(input: PintsToGallonsInput): PintsToGallonsResult {
  const from = input.source;
  const value = input.value!;
  const usPt = convertPintGallon(value, from, 'usPt');
  const ukPt = convertPintGallon(value, from, 'ukPt');
  const usGal = convertPintGallon(value, from, 'usGal');
  const ukGal = convertPintGallon(value, from, 'ukGal');

  const explanation = `${formatVolume(usPt)} US pt = ${formatVolume(usGal)} US gal · ${formatVolume(ukPt)} UK pt = ${formatVolume(ukGal)} UK gal`;

  return { source: from, usPt, ukPt, usGal, ukGal, explanation };
}

export function shareResultText(result: PintsToGallonsResult): string {
  return [
    'Pints to Gallons Converter — Omega Calculators',
    '',
    `${formatVolume(result.usPt)} US pint equals:`,
    `${formatVolume(result.usGal)} US gallon`,
    `${formatVolume(result.ukPt)} UK pint`,
    `${formatVolume(result.ukGal)} UK gallon`,
    '',
    '/tools/pints-to-gallons-converter',
  ].join('\n');
}
