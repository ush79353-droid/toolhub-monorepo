import {
  convertVolume as convertVolumeLiters,
  formatVolume,
  fromLiters,
  toLiters,
} from '../volume-conversion/calculation';
import {
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_DRY_QUART,
  LITERS_PER_US_LIQUID_GALLON,
} from '../volume-conversion/types';
import {
  EXTRA_TO_VOLUME_ID,
  EXTRA_VOLUME_UNITS,
  GALLON_UNIT_LABEL,
  QUART_UNIT_LABEL,
  SOURCE_TO_VOLUME_ID,
  US_QUARTS_PER_GALLON,
  VOLUME_UNITS_ML,
  type ExtraVolumeUnit,
  type GallonUnit,
  type QuartGallonUnit,
  type QuartUnit,
  type QuartsToGallonsInput,
  type QuartsToGallonsResult,
} from './types';

export { formatVolume };
export {
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_DRY_QUART,
  LITERS_PER_US_LIQUID_GALLON,
  US_QUARTS_PER_GALLON,
  VOLUME_UNITS_ML,
};

export const LITERS_PER_UNIT: Record<QuartGallonUnit, number> = {
  usGal: LITERS_PER_US_LIQUID_GALLON,
  ukGal: LITERS_PER_IMPERIAL_GALLON,
  usQt: LITERS_PER_US_LIQUID_GALLON / 4,
  ukQt: LITERS_PER_IMPERIAL_GALLON / 4,
  usDryQt: LITERS_PER_US_DRY_QUART,
};

export function quartsToGallons(
  quarts: number,
  quartUnit: QuartUnit = 'usQt',
  gallonUnit: GallonUnit = 'usGal',
): number {
  if (!Number.isFinite(quarts) || quarts < 0) {
    throw new RangeError('Volume must be a finite, non-negative number.');
  }
  return convertVolumeLiters(
    quarts,
    SOURCE_TO_VOLUME_ID[quartUnit],
    SOURCE_TO_VOLUME_ID[gallonUnit],
  );
}

export function gallonsToQuarts(
  gallons: number,
  gallonUnit: GallonUnit = 'usGal',
  quartUnit: QuartUnit = 'usQt',
): number {
  if (!Number.isFinite(gallons) || gallons < 0) {
    throw new RangeError('Volume must be a finite, non-negative number.');
  }
  return convertVolumeLiters(
    gallons,
    SOURCE_TO_VOLUME_ID[gallonUnit],
    SOURCE_TO_VOLUME_ID[quartUnit],
  );
}

export function convertQuartsGallons(
  value: number,
  from: QuartGallonUnit,
  to: QuartGallonUnit,
): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Volume must be a finite, non-negative number.');
  }
  if (from === to) return value;
  return convertVolumeLiters(value, SOURCE_TO_VOLUME_ID[from], SOURCE_TO_VOLUME_ID[to]);
}

export function litersFromDraft(
  value: number,
  source: QuartsToGallonsInput['source'],
  gallonUnit: GallonUnit,
  quartUnit: QuartUnit,
): number {
  if (source === 'gallons') return toLiters(value, SOURCE_TO_VOLUME_ID[gallonUnit]);
  if (source === 'quarts') return toLiters(value, SOURCE_TO_VOLUME_ID[quartUnit]);
  return toLiters(value, EXTRA_TO_VOLUME_ID[source]);
}

export function litersToExtra(liters: number, unit: ExtraVolumeUnit): number {
  return fromLiters(liters, EXTRA_TO_VOLUME_ID[unit]);
}

export function calculateQuartsToGallons(
  input: QuartsToGallonsInput,
): QuartsToGallonsResult {
  const liters = litersFromDraft(
    input.value!,
    input.source,
    input.gallonUnit,
    input.quartUnit,
  );
  const gallons = fromLiters(liters, SOURCE_TO_VOLUME_ID[input.gallonUnit]);
  const quarts = fromLiters(liters, SOURCE_TO_VOLUME_ID[input.quartUnit]);

  const extras = {} as Record<ExtraVolumeUnit, number>;
  for (const unit of EXTRA_VOLUME_UNITS) {
    extras[unit] = litersToExtra(liters, unit);
  }

  const explanation = `${formatVolume(quarts)} ${QUART_UNIT_LABEL[input.quartUnit]} = ${formatVolume(gallons)} ${GALLON_UNIT_LABEL[input.gallonUnit]}`;

  return {
    source: input.source,
    quarts,
    gallons,
    liters,
    gallonUnit: input.gallonUnit,
    quartUnit: input.quartUnit,
    extras,
    explanation,
  };
}

export function shareResultText(result: QuartsToGallonsResult): string {
  return [
    'Quarts to Gallons Converter',
    'Omega Calculators',
    '',
    `${formatVolume(result.quarts)} ${QUART_UNIT_LABEL[result.quartUnit]} = ${formatVolume(result.gallons)} ${GALLON_UNIT_LABEL[result.gallonUnit]}`,
    '',
    '/tools/quarts-to-gallons-converter',
  ].join('\n');
}
