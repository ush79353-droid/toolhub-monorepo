import {
  convertVolume as convertVolumeLiters,
  formatVolume,
  fromLiters,
  toLiters,
} from '../volume-conversion/calculation';
import {
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from '../volume-conversion/types';
import {
  GALLON_UNIT_LABEL,
  QUART_UNIT_LABEL,
  SOURCE_TO_VOLUME_ID,
  type GallonQuartUnit,
  type GallonUnit,
  type GalToQuartsInput,
  type GalToQuartsResult,
  type QuartUnit,
} from './types';

export { formatVolume };
export { LITERS_PER_IMPERIAL_GALLON, LITERS_PER_US_LIQUID_GALLON };

export const LITERS_PER_UNIT: Record<GallonQuartUnit, number> = {
  usGal: LITERS_PER_US_LIQUID_GALLON,
  ukGal: LITERS_PER_IMPERIAL_GALLON,
  usQt: LITERS_PER_US_LIQUID_GALLON / 4,
  ukQt: LITERS_PER_IMPERIAL_GALLON / 4,
};

export function convertGallonsQuarts(
  value: number,
  from: GallonQuartUnit,
  to: GallonQuartUnit,
): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Volume must be a finite, non-negative number.');
  }
  if (from === to) return value;
  return convertVolumeLiters(value, SOURCE_TO_VOLUME_ID[from], SOURCE_TO_VOLUME_ID[to]);
}

export function litersFromDraft(
  value: number,
  source: 'gallons' | 'quarts',
  gallonUnit: GallonUnit,
  quartUnit: QuartUnit,
): number {
  const unit = source === 'gallons' ? gallonUnit : quartUnit;
  return toLiters(value, SOURCE_TO_VOLUME_ID[unit]);
}

export function calculateGalToQuarts(input: GalToQuartsInput): GalToQuartsResult {
  const liters = litersFromDraft(
    input.value!,
    input.source,
    input.gallonUnit,
    input.quartUnit,
  );
  const gallons = fromLiters(liters, SOURCE_TO_VOLUME_ID[input.gallonUnit]);
  const quarts = fromLiters(liters, SOURCE_TO_VOLUME_ID[input.quartUnit]);

  const explanation = `${formatVolume(gallons)} ${GALLON_UNIT_LABEL[input.gallonUnit]} = ${formatVolume(quarts)} ${QUART_UNIT_LABEL[input.quartUnit]}`;

  return {
    source: input.source,
    gallons,
    quarts,
    liters,
    gallonUnit: input.gallonUnit,
    quartUnit: input.quartUnit,
    explanation,
  };
}

export function shareResultText(result: GalToQuartsResult): string {
  return [
    'Gallons to Quarts Converter — Omega Calculators',
    '',
    `${formatVolume(result.gallons)} ${GALLON_UNIT_LABEL[result.gallonUnit]} = ${formatVolume(result.quarts)} ${QUART_UNIT_LABEL[result.quartUnit]}`,
    '',
    'Calculated with Omega Calculators',
    result.explanation,
  ].join('\n');
}
