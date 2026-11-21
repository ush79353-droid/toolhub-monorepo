import {
  GALLON_KIND_LABEL,
  LITERS_PER_GALLON_KIND,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_OTHER_UNIT,
  LITERS_PER_US_GALLON,
  OTHER_UNIT_LABEL,
  type GallonKind,
  type LToGalInput,
  type LToGalResult,
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
  const raw = String(rounded);
  if (raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function litersToUSGallons(liters: number): number {
  return liters / LITERS_PER_US_GALLON;
}

export function usGallonsToLiters(gallons: number): number {
  return gallons * LITERS_PER_US_GALLON;
}

export function litersToImperialGallons(liters: number): number {
  return liters / LITERS_PER_IMPERIAL_GALLON;
}

export function imperialGallonsToLiters(gallons: number): number {
  return gallons * LITERS_PER_IMPERIAL_GALLON;
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

export function calculateLToGal(input: LToGalInput): LToGalResult {
  let liters: number;

  if (input.source === 'liters') {
    liters = input.liters!;
  } else if (input.source === 'gallons') {
    liters = gallonsToLiters(input.gallons!, input.gallonKind);
  } else {
    liters = otherToLiters(input.other!, input.otherUnit);
  }

  const gallons = litersToGallons(liters, input.gallonKind);
  const other = litersToOther(liters, input.otherUnit);

  const galLabel = GALLON_KIND_LABEL[input.gallonKind];
  const otherLabel = OTHER_UNIT_LABEL[input.otherUnit];
  const explanation =
    input.source === 'liters'
      ? `${formatVolume(liters)} L ÷ ${LITERS_PER_GALLON_KIND[input.gallonKind]} = ${formatVolume(gallons)} ${galLabel}`
      : input.source === 'gallons'
        ? `${formatVolume(gallons)} ${galLabel} × ${LITERS_PER_GALLON_KIND[input.gallonKind]} = ${formatVolume(liters)} L`
        : `${formatVolume(other)} ${otherLabel} → ${formatVolume(liters)} L → ${formatVolume(gallons)} ${galLabel}`;

  return {
    source: input.source,
    liters,
    gallons,
    other,
    gallonKind: input.gallonKind,
    otherUnit: input.otherUnit,
    explanation,
  };
}

export function shareResultText(result: LToGalResult): string {
  const galLabel = GALLON_KIND_LABEL[result.gallonKind];
  const factor = LITERS_PER_GALLON_KIND[result.gallonKind];
  return [
    'L to gal Converter | Omega Calculators',
    '',
    'Input:',
    result.source === 'gallons'
      ? `${formatVolume(result.gallons)} ${galLabel}`
      : result.source === 'other'
        ? `${formatVolume(result.other)} ${OTHER_UNIT_LABEL[result.otherUnit]}`
        : `${formatVolume(result.liters)} liters`,
    '',
    'Result:',
    `${formatVolume(result.gallons)} ${galLabel}`,
    `${formatVolume(result.liters)} L`,
    `${formatVolume(result.other)} ${OTHER_UNIT_LABEL[result.otherUnit]}`,
    '',
    'Formula:',
    result.gallonKind === 'usGal'
      ? `US gal = L / ${LITERS_PER_US_GALLON}`
      : `imp gal = L / ${LITERS_PER_IMPERIAL_GALLON}`,
    `${formatVolume(result.liters)} L ≈ ${formatVolume(result.gallons)} ${galLabel}`,
    `(1 ${galLabel} = ${factor} L)`,
  ].join('\n');
}
