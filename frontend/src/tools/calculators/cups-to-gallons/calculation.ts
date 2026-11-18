import {
  CUP_UNIT_LABEL,
  EXTRA_VOLUME_UNITS,
  GALLON_UNIT_LABEL,
  LITERS_PER_CUP,
  LITERS_PER_EXTRA,
  LITERS_PER_GALLON,
  type CupUnit,
  type CupsToGalInput,
  type CupsToGalResult,
  type ExtraVolumeUnit,
  type GallonUnit,
} from './types';

/** Readable volume display without ugly trailing zeros. */
export function formatVolume(value: number): string {
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

function assertNonNegative(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('Invalid volume');
  }
}

export function cupsToGallons(
  cups: number,
  cupUnit: CupUnit = 'usCustomary',
  gallonUnit: GallonUnit = 'usLiquid',
): number {
  assertNonNegative(cups);
  const liters = cups * LITERS_PER_CUP[cupUnit];
  const result = liters / LITERS_PER_GALLON[gallonUnit];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function gallonsToCups(
  gallons: number,
  gallonUnit: GallonUnit = 'usLiquid',
  cupUnit: CupUnit = 'usCustomary',
): number {
  assertNonNegative(gallons);
  const liters = gallons * LITERS_PER_GALLON[gallonUnit];
  const result = liters / LITERS_PER_CUP[cupUnit];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function litersFromSource(input: CupsToGalInput): number {
  const value = input.value!;
  if (input.source === 'cups') return value * LITERS_PER_CUP[input.cupUnit];
  if (input.source === 'gallons') return value * LITERS_PER_GALLON[input.gallonUnit];
  return value * LITERS_PER_EXTRA[input.source];
}

export function litersToExtra(liters: number, unit: ExtraVolumeUnit): number {
  return liters / LITERS_PER_EXTRA[unit];
}

export function calculateCupsToGal(input: CupsToGalInput): CupsToGalResult {
  const liters = litersFromSource(input);
  const cups = liters / LITERS_PER_CUP[input.cupUnit];
  const gallons = liters / LITERS_PER_GALLON[input.gallonUnit];

  const extras = {} as Record<ExtraVolumeUnit, number>;
  for (const unit of EXTRA_VOLUME_UNITS) {
    extras[unit] = litersToExtra(liters, unit);
  }

  const cupLabel = CUP_UNIT_LABEL[input.cupUnit];
  const galLabel = GALLON_UNIT_LABEL[input.gallonUnit];
  const explanation = `${formatVolume(cups)} ${cupLabel} = ${formatVolume(gallons)} ${galLabel} · ${formatVolume(liters)} L`;

  return {
    source: input.source,
    cups,
    gallons,
    liters,
    cupUnit: input.cupUnit,
    gallonUnit: input.gallonUnit,
    extras,
    explanation,
  };
}

export function shareResultText(result: CupsToGalResult): string {
  return [
    'Cups to Gallons Converter',
    'Omega Calculators',
    '',
    `Cups: ${formatVolume(result.cups)} ${CUP_UNIT_LABEL[result.cupUnit]}`,
    `Gallons: ${formatVolume(result.gallons)} ${GALLON_UNIT_LABEL[result.gallonUnit]}`,
    `Liters: ${formatVolume(result.liters)} L`,
  ].join('\n');
}
