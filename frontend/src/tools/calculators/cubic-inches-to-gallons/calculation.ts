import {
  CUBIC_INCHES_PER_US_GALLON,
  GALLON_KIND_LABEL,
  LITERS_PER_CUBIC_INCH,
  LITERS_PER_GALLON_KIND,
  LITERS_PER_OTHER_UNIT,
  LITERS_PER_UK_GALLON,
  LITERS_PER_US_GALLON,
  OTHER_UNIT_LABEL,
  type CuInToGalInput,
  type CuInToGalResult,
  type GallonKind,
  type OtherVolumeUnit,
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

function assertNonNegativeVolume(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('Invalid volume');
  }
}

export function cubicInchesToLiters(cubicInches: number): number {
  assertNonNegativeVolume(cubicInches);
  return cubicInches * LITERS_PER_CUBIC_INCH;
}

export function litersToCubicInches(liters: number): number {
  assertNonNegativeVolume(liters);
  return liters / LITERS_PER_CUBIC_INCH;
}

export function cubicInchesToUSGallons(cubicInches: number): number {
  assertNonNegativeVolume(cubicInches);
  return cubicInches / CUBIC_INCHES_PER_US_GALLON;
}

export function usGallonsToCubicInches(gallons: number): number {
  assertNonNegativeVolume(gallons);
  return gallons * CUBIC_INCHES_PER_US_GALLON;
}

export function cubicInchesToUKGallons(cubicInches: number): number {
  assertNonNegativeVolume(cubicInches);
  return cubicInchesToLiters(cubicInches) / LITERS_PER_UK_GALLON;
}

export function ukGallonsToCubicInches(gallons: number): number {
  assertNonNegativeVolume(gallons);
  return litersToCubicInches(gallons * LITERS_PER_UK_GALLON);
}

export function litersToGallons(liters: number, kind: GallonKind): number {
  return liters / LITERS_PER_GALLON_KIND[kind];
}

export function gallonsToLiters(gallons: number, kind: GallonKind): number {
  return gallons * LITERS_PER_GALLON_KIND[kind];
}

export function litersToOther(liters: number, unit: OtherVolumeUnit): number {
  return liters / LITERS_PER_OTHER_UNIT[unit];
}

export function otherToLiters(value: number, unit: OtherVolumeUnit): number {
  return value * LITERS_PER_OTHER_UNIT[unit];
}

/**
 * Convert between volume units via liters.
 * Supports the brief API surface: in3, us_gal, uk_gal, L, mL.
 */
export type ConvertVolumeUnit = 'in3' | 'us_gal' | 'uk_gal' | 'L' | 'mL';

const LITERS_PER_CONVERT_UNIT: Record<ConvertVolumeUnit, number> = {
  in3: LITERS_PER_CUBIC_INCH,
  us_gal: LITERS_PER_US_GALLON,
  uk_gal: LITERS_PER_UK_GALLON,
  L: 1,
  mL: 0.001,
};

export function convertVolume(
  value: number,
  from: ConvertVolumeUnit,
  to: ConvertVolumeUnit,
): number {
  assertNonNegativeVolume(value);
  const liters = value * LITERS_PER_CONVERT_UNIT[from];
  const result = liters / LITERS_PER_CONVERT_UNIT[to];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function calculateCuInToGal(input: CuInToGalInput): CuInToGalResult {
  let liters: number;

  if (input.source === 'cubicInches') {
    liters = cubicInchesToLiters(input.cubicInches!);
  } else if (input.source === 'gallons') {
    liters = gallonsToLiters(input.gallons!, input.gallonKind);
  } else {
    liters = otherToLiters(input.other!, input.otherUnit);
  }

  const cubicInches = litersToCubicInches(liters);
  const gallons = litersToGallons(liters, input.gallonKind);
  const other = litersToOther(liters, input.otherUnit);

  const galLabel = GALLON_KIND_LABEL[input.gallonKind];
  const otherLabel = OTHER_UNIT_LABEL[input.otherUnit];
  const explanation =
    input.source === 'cubicInches'
      ? `${formatVolume(cubicInches)} in³ → ${formatVolume(gallons)} ${galLabel} · ${formatVolume(other)} ${otherLabel}`
      : input.source === 'gallons'
        ? `${formatVolume(gallons)} ${galLabel} → ${formatVolume(cubicInches)} in³ · ${formatVolume(other)} ${otherLabel}`
        : `${formatVolume(other)} ${otherLabel} → ${formatVolume(cubicInches)} in³ · ${formatVolume(gallons)} ${galLabel}`;

  return {
    source: input.source,
    cubicInches,
    gallons,
    other,
    liters,
    gallonKind: input.gallonKind,
    otherUnit: input.otherUnit,
    explanation,
  };
}

export function shareResultText(result: CuInToGalResult): string {
  const galLabel = GALLON_KIND_LABEL[result.gallonKind];
  const otherLabel = OTHER_UNIT_LABEL[result.otherUnit];
  return [
    'Cubic Inches to Gallons Converter',
    'Omega Calculators',
    '',
    `Cubic Inches: ${formatVolume(result.cubicInches)} in³`,
    `${galLabel}: ${formatVolume(result.gallons)} ${galLabel}`,
    `${otherLabel}: ${formatVolume(result.other)} ${otherLabel}`,
    `Liters: ${formatVolume(result.liters)} L`,
  ].join('\n');
}
