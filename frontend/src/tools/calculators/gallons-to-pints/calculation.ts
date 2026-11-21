import {
  convertVolume as convertVolumeLiters,
  formatVolume,
} from '../volume-conversion/calculation';
import {
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from '../volume-conversion/types';
import {
  MORE_SOURCES,
  SOURCE_TO_VOLUME_ID,
  type GalToPintsInput,
  type GalToPintsResult,
  type VolumeUnit,
} from './types';

export { formatVolume };
export { LITERS_PER_IMPERIAL_GALLON, LITERS_PER_US_LIQUID_GALLON };

/** Exact liters for task-facing unit aliases (via volume-conversion registry). */
export const LITERS_PER_UNIT: Record<VolumeUnit, number> = {
  usGal: LITERS_PER_US_LIQUID_GALLON,
  ukGal: LITERS_PER_IMPERIAL_GALLON,
  usPt: LITERS_PER_US_LIQUID_GALLON / 8,
  ukPt: LITERS_PER_IMPERIAL_GALLON / 8,
  mL: 0.001,
  L: 1,
  usFlOz: LITERS_PER_US_LIQUID_GALLON / 128,
  ukFlOz: LITERS_PER_IMPERIAL_GALLON / 160,
  usQt: LITERS_PER_US_LIQUID_GALLON / 4,
  ukQt: LITERS_PER_IMPERIAL_GALLON / 4,
  m3: 1000,
};

export function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Volume must be finite and non-negative.');
  }
  if (from === to) return value;
  return convertVolumeLiters(value, SOURCE_TO_VOLUME_ID[from], SOURCE_TO_VOLUME_ID[to]);
}

export function calculateGalToPints(input: GalToPintsInput): GalToPintsResult {
  const from = input.source;
  const value = input.value!;
  const usGal = convertVolume(value, from, 'usGal');
  const ukGal = convertVolume(value, from, 'ukGal');
  const usPt = convertVolume(value, from, 'usPt');
  const ukPt = convertVolume(value, from, 'ukPt');

  const more = MORE_SOURCES.map((row) => ({
    unit: row.unit,
    label: row.label,
    symbol: row.symbol,
    value: convertVolume(value, from, row.unit),
  }));

  const explanation = `${formatVolume(usGal)} US gal = ${formatVolume(usPt)} US pt · ${formatVolume(ukGal)} UK gal = ${formatVolume(ukPt)} UK pt`;

  return { source: from, usGal, ukGal, usPt, ukPt, more, explanation };
}

export function shareResultText(result: GalToPintsResult): string {
  return [
    'Gallons to Pints Converter | Omega Calculators',
    '',
    `${formatVolume(result.usGal)} US gallons = ${formatVolume(result.usPt)} US pints`,
    `${formatVolume(result.ukGal)} UK gallons = ${formatVolume(result.ukPt)} UK pints`,
    '',
    result.explanation,
  ].join('\n');
}
