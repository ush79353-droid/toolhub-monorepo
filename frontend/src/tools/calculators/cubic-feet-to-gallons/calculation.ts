import { formatMeasure } from '../cubic-feet/calculation';
import {
  CUBIC_FOOT_IN_CUBIC_METERS,
  UK_GALLON_IN_CUBIC_METERS,
  US_GALLON_IN_CUBIC_METERS,
  type CuFtToGalInput,
  type CuFtToGalResult,
  type GallonUnit,
} from './types';

export { formatMeasure as formatVolume };

function gallonInCubicMeters(unit: GallonUnit): number {
  return unit === 'uk' ? UK_GALLON_IN_CUBIC_METERS : US_GALLON_IN_CUBIC_METERS;
}

function gallonLabel(unit: GallonUnit): string {
  return unit === 'uk' ? 'UK gal' : 'US gal';
}

/** Alias matching the brief API name. */
export function cubicFeetToGallons(cubicFeet: number, unit: GallonUnit = 'us'): number {
  return (cubicFeet * CUBIC_FOOT_IN_CUBIC_METERS) / gallonInCubicMeters(unit);
}

/** Alias matching the brief API name. */
export function gallonsToCubicFeet(gallons: number, unit: GallonUnit = 'us'): number {
  return (gallons * gallonInCubicMeters(unit)) / CUBIC_FOOT_IN_CUBIC_METERS;
}

export function calculateCuFtToGal(input: CuFtToGalInput): CuFtToGalResult {
  const unit = input.gallonUnit;
  let cubicFeet: number;
  let gallons: number;

  if (input.source === 'cubicFeet') {
    cubicFeet = input.value!;
    gallons = cubicFeetToGallons(cubicFeet, unit);
  } else {
    gallons = input.value!;
    cubicFeet = gallonsToCubicFeet(gallons, unit);
  }

  const explanation =
    input.source === 'cubicFeet'
      ? `${formatMeasure(cubicFeet)} ft³ → ${formatMeasure(gallons)} ${gallonLabel(unit)}`
      : `${formatMeasure(gallons)} ${gallonLabel(unit)} → ${formatMeasure(cubicFeet)} ft³`;

  return {
    source: input.source,
    cubicFeet,
    gallons,
    gallonUnit: unit,
    explanation,
  };
}

export function shareResultText(result: CuFtToGalResult): string {
  return [
    'Cubic Feet to Gallons Converter — Omega Calculators',
    '',
    `${formatMeasure(result.cubicFeet)} ft³ = ${formatMeasure(result.gallons)} ${gallonLabel(result.gallonUnit)}`,
  ].join('\n');
}
