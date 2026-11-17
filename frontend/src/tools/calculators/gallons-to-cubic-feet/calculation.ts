import { formatMeasure } from '../cubic-feet/calculation';
import {
  LITERS_PER_UNIT,
  SOURCE_TO_UNIT,
  type GalToCuFtInput,
  type GalToCuFtResult,
  type VolumeUnit,
} from './types';

export { formatMeasure as formatVolume };

export function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Volume must be a finite, non-negative number.');
  }
  if (from === to) return value;
  return (value * LITERS_PER_UNIT[from]) / LITERS_PER_UNIT[to];
}

export function calculateGalToCuFt(input: GalToCuFtInput): GalToCuFtResult {
  const from = SOURCE_TO_UNIT[input.source];
  const value = input.value!;
  const usGal = convertVolume(value, from, 'us_gal');
  const ukGal = convertVolume(value, from, 'uk_gal');
  const ft3 = convertVolume(value, from, 'ft3');

  const explanation =
    input.source === 'usGal'
      ? `${formatMeasure(usGal)} US gal → ${formatMeasure(ukGal)} UK gal · ${formatMeasure(ft3)} ft³`
      : input.source === 'ukGal'
        ? `${formatMeasure(ukGal)} UK gal → ${formatMeasure(usGal)} US gal · ${formatMeasure(ft3)} ft³`
        : `${formatMeasure(ft3)} ft³ → ${formatMeasure(usGal)} US gal · ${formatMeasure(ukGal)} UK gal`;

  return { source: input.source, usGal, ukGal, ft3, explanation };
}

export function shareResultText(result: GalToCuFtResult): string {
  return [
    'Gallons to Cubic Feet Converter — Omega Calculators',
    '',
    `${formatMeasure(result.usGal)} US gallons`,
    `= ${formatMeasure(result.ukGal)} UK gallons`,
    `= ${formatMeasure(result.ft3)} cubic feet`,
    '',
    result.explanation,
  ].join('\n');
}
